import { useState, useCallback } from 'react';
import type { Page, DrinkType, Drink } from './types';
import { useDrinkStore } from './store';
import { Nav } from './components/Nav';
import { Landing } from './components/Landing';
import { Builder } from './components/Builder';
import { Library } from './components/Library';
import { DrinkDetail } from './components/DrinkDetail';
import { Stats } from './components/Stats';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [drinkType, setDrinkType] = useState<DrinkType>('cocktail');
  const [viewDrink, setViewDrink] = useState<Drink | null>(null);
  const [editDrink, setEditDrink] = useState<Drink | null>(null);

  const { drinks, addDrink, updateDrink, deleteDrink, toggleFavorite, duplicateDrink } = useDrinkStore();

  const handleSelectType = useCallback((type: DrinkType) => {
    setDrinkType(type);
    setEditDrink(null);
    setPage('builder');
  }, []);

  const handleSave = useCallback((drink: Drink) => {
    if (editDrink) {
      updateDrink(drink);
    } else {
      addDrink(drink);
    }
    setEditDrink(null);
    setPage('library');
  }, [editDrink, updateDrink, addDrink]);

  const handleViewDrink = useCallback((drink: Drink) => {
    setViewDrink(drink);
    setPage('detail');
  }, []);

  const handleEditDrink = useCallback((drink: Drink) => {
    setEditDrink(drink);
    setDrinkType(drink.type);
    setPage('builder');
  }, []);

  const handleNavigate = useCallback((p: Page) => {
    setPage(p);
    if (p === 'landing') {
      setViewDrink(null);
      setEditDrink(null);
    }
  }, []);

  const handlePrint = useCallback((drink: Drink) => {
    const content = `
      <html>
        <head>
          <title>${drink.name} - Recette MixLab</title>
          <style>
            body { font-family: Georgia, serif; max-width: 600px; margin: 40px auto; padding: 20px; color: #222; }
            h1 { font-size: 28px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .badge { display: inline-block; padding: 2px 12px; border-radius: 20px; font-size: 12px; background: #f0f0f0; }
            .section { margin: 20px 0; }
            .section h3 { font-size: 16px; color: #555; margin-bottom: 8px; }
            .ingredient { padding: 4px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
            .score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
            .score-item { text-align: center; padding: 8px; background: #f9f9f9; border-radius: 8px; }
            .score-value { font-size: 24px; font-weight: bold; }
            .score-label { font-size: 10px; color: #888; }
          </style>
        </head>
        <body>
          <h1>${drink.name}</h1>
          <span class="badge">${drink.type === 'cocktail' ? '🍸 Cocktail' : '🍹 Mocktail'}</span>
          <p><strong>Base:</strong> ${drink.base}</p>
          <p><strong>Ambiances:</strong> ${drink.vibes.join(', ')}</p>
          
          <div class="section">
            <h3>Ingrédients</h3>
            ${drink.ingredients.map(i => `<div class="ingredient"><span>${i.name}</span><span>${i.quantity} ${i.unit}</span></div>`).join('')}
          </div>
          
          ${drink.preparation ? `<div class="section"><h3>Préparation</h3><p>${drink.preparation}</p></div>` : ''}
          
          ${drink.evaluation ? `
            <div class="section">
              <h3>Évaluation</h3>
              <div class="score-grid">
                ${Object.entries(drink.evaluation.scores).map(([k, v]) => `
                  <div class="score-item">
                    <div class="score-value">${v}</div>
                    <div class="score-label">${k.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="section">
              <h3>Service</h3>
              <p><strong>Verre:</strong> ${drink.evaluation.glassRecommendation}</p>
              <p><strong>Garniture:</strong> ${drink.evaluation.suggestedGarnish}</p>
            </div>
          ` : ''}
          
          ${drink.notes ? `<div class="section"><h3>Notes</h3><p>${drink.notes}</p></div>` : ''}
          
          <p style="text-align:center;color:#aaa;font-size:11px;margin-top:40px;">Créé avec MixLab</p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  }, []);

  return (
    <div className="min-h-screen bg-grid">
      <Nav currentPage={page} onNavigate={handleNavigate} />

      {page === 'landing' && (
        <Landing onSelect={handleSelectType} drinkCount={drinks.length} />
      )}

      {page === 'builder' && (
        <Builder
          drinkType={drinkType}
          onSave={handleSave}
          onBack={() => setPage('landing')}
          editDrink={editDrink}
        />
      )}

      {page === 'library' && (
        <Library
          drinks={drinks}
          onView={handleViewDrink}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteDrink}
          onDuplicate={duplicateDrink}
        />
      )}

      {page === 'detail' && viewDrink && (
        <DrinkDetail
          drink={drinks.find(d => d.id === viewDrink.id) || viewDrink}
          onBack={() => setPage('library')}
          onEdit={handleEditDrink}
          onToggleFavorite={toggleFavorite}
          onDuplicate={duplicateDrink}
          onDelete={deleteDrink}
          onPrint={handlePrint}
        />
      )}

      {page === 'stats' && (
        <Stats drinks={drinks} />
      )}
    </div>
  );
}
