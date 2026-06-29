import { useState, useMemo } from 'react';
import type { Drink, DrinkType, DrinkIngredient, IngredientSuggestion } from '../types';
import { alcoholBases, mocktailBases, vibes, vibeEmojis, ingredientCategories, units } from '../data/ingredients';
import { baseEmojis } from '../data/baseEmojis';
import { getIngredientSuggestions } from '../data/recommendations';
import { evaluateDrink } from '../data/evaluation';
import { StarRating } from './StarRating';
import { ScoreGauge } from './ScoreGauge';
import { fr } from '../i18n';

interface BuilderProps {
  drinkType: DrinkType;
  onSave: (drink: Drink) => void;
  onBack: () => void;
  editDrink?: Drink | null;
}

type BuilderStep = 'base' | 'vibe' | 'ingredients' | 'preparation' | 'evaluate';

export function Builder({ drinkType, onSave, onBack, editDrink }: BuilderProps) {
  const [step, setStep] = useState<BuilderStep>(editDrink ? 'ingredients' : 'base');
  const [selectedBase, setSelectedBase] = useState(editDrink?.base || '');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(editDrink?.vibes || []);
  const [ingredients, setIngredients] = useState<DrinkIngredient[]>(editDrink?.ingredients || []);
  const [preparation, setPreparation] = useState(editDrink?.preparation || '');
  const [drinkName, setDrinkName] = useState(editDrink?.name || '');
  const [notes, setNotes] = useState(editDrink?.notes || '');
  const [tags, setTags] = useState(editDrink?.tags?.join(', ') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // New ingredient form
  const [newIngName, setNewIngName] = useState('');
  const [newIngQty, setNewIngQty] = useState('');
  const [newIngUnit, setNewIngUnit] = useState('ml');

  const bases = drinkType === 'cocktail' ? alcoholBases : mocktailBases;

  const suggestions = useMemo<IngredientSuggestion[]>(() => {
    if (!selectedBase) return [];
    return getIngredientSuggestions(
      selectedBase,
      selectedVibes,
      ingredients.map(i => i.name)
    );
  }, [selectedBase, selectedVibes, ingredients]);

  const allIngredients = useMemo(() => {
    const all: { name: string; category: string }[] = [];
    for (const [cat, items] of Object.entries(ingredientCategories)) {
      for (const item of items) {
        if (!searchTerm || item.toLowerCase().includes(searchTerm.toLowerCase())) {
          all.push({ name: item, category: cat });
        }
      }
    }
    return all;
  }, [searchTerm]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return ingredientCategories;
    const filtered: Record<string, string[]> = {};
    for (const [cat, items] of Object.entries(ingredientCategories)) {
      const f = items.filter(i => i.toLowerCase().includes(searchTerm.toLowerCase()));
      if (f.length > 0) filtered[cat] = f;
    }
    return filtered;
  }, [searchTerm]);

  // Quick add ingredient from suggestion or category - adds directly with default quantity
  const quickAddIngredient = (name: string, category: string) => {
    if (ingredients.some(i => i.name === name)) return; // Already added
    const id = crypto.randomUUID();
    setIngredients(prev => [...prev, {
      id,
      name,
      quantity: '30',
      unit: 'ml',
      category
    }]);
  };

  // Add ingredient from form
  const addIngredient = () => {
    if (!newIngName.trim()) return;
    if (ingredients.some(i => i.name === newIngName.trim())) return; // Already added
    const id = crypto.randomUUID();
    const cat = allIngredients.find(a => a.name === newIngName)?.category || 'Other';
    setIngredients(prev => [...prev, {
      id,
      name: newIngName.trim(),
      quantity: newIngQty || '30',
      unit: newIngUnit,
      category: cat
    }]);
    setNewIngName('');
    setNewIngQty('');
    setNewIngUnit('ml');
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  const updateIngredient = (id: string, field: 'quantity' | 'unit', value: string) => {
    setIngredients(prev => prev.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  const moveIngredient = (index: number, direction: 'up' | 'down') => {
    const newArr = [...ingredients];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newArr.length) return;
    [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
    setIngredients(newArr);
  };

  const toggleVibe = (vibe: string) => {
    setSelectedVibes(prev =>
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    );
  };

  const buildDrink = (): Drink => ({
    id: editDrink?.id || crypto.randomUUID(),
    name: drinkName || `Mon ${drinkType === 'cocktail' ? 'Cocktail' : 'Mocktail'}`,
    type: drinkType,
    base: selectedBase,
    vibes: selectedVibes,
    ingredients,
    preparation,
    notes,
    tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    evaluation: null,
    photo: editDrink?.photo || null,
    favorite: editDrink?.favorite || false,
    createdAt: editDrink?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [evaluation, setEvaluation] = useState(editDrink?.evaluation || null);

  const handleEvaluate = () => {
    const drink = buildDrink();
    const eval_ = evaluateDrink(drink);
    setEvaluation(eval_);
    setStep('evaluate');
  };

  const handleSave = () => {
    const drink = buildDrink();
    drink.evaluation = evaluation;
    onSave(drink);
  };

  const canProceed = () => {
    switch (step) {
      case 'base': return !!selectedBase;
      case 'vibe': return selectedVibes.length > 0;
      case 'ingredients': return ingredients.length > 0;
      case 'preparation': return true;
      default: return true;
    }
  };

  const stepOrder: BuilderStep[] = ['base', 'vibe', 'ingredients', 'preparation', 'evaluate'];
  const currentStepIndex = stepOrder.indexOf(step);

  const goNext = () => {
    if (step === 'preparation') {
      handleEvaluate();
    } else {
      const next = stepOrder[currentStepIndex + 1];
      if (next) setStep(next);
    }
  };

  const goPrev = () => {
    if (currentStepIndex === 0) {
      onBack();
    } else {
      setStep(stepOrder[currentStepIndex - 1]);
    }
  };

  const stepLabels = [fr.base, fr.vibe, fr.ingredients, fr.prep, fr.evaluate];

  const getVibeLabel = (vibe: string) => fr.vibeNames[vibe] || vibe;
  const getCategoryLabel = (cat: string) => fr.categories[cat] || cat;

  const scoreLabels: Record<string, string> = {
    taste: fr.taste,
    balance: fr.balance,
    presentation: fr.presentation,
    style: fr.style,
    originality: fr.originality,
    difficulty: fr.difficulty,
    professionalism: fr.professionalism,
    ingredientHarmony: fr.ingredientHarmony,
    vibeConsistency: fr.vibeConsistency,
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-5xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8 fade-in">
        {stepLabels.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => i <= currentStepIndex && setStep(stepOrder[i])}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${i === currentStepIndex
                  ? 'animated-gradient text-white shadow-lg shadow-violet-500/30'
                  : i < currentStepIndex
                    ? 'bg-violet-500/30 text-violet-300 cursor-pointer'
                    : 'bg-white/5 text-gray-500'
                }`}
            >
              {i < currentStepIndex ? '✓' : i + 1}
            </button>
            <span className={`hidden sm:inline text-xs ${i === currentStepIndex ? 'text-white' : 'text-gray-500'}`}>
              {label}
            </span>
            {i < stepLabels.length - 1 && (
              <div className={`w-8 h-px ${i < currentStepIndex ? 'bg-violet-500/50' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="text-center mb-8 fade-in">
        <span className="text-4xl">{drinkType === 'cocktail' ? '🍸' : '🍹'}</span>
        <h2 className="text-2xl font-bold mt-2">
          {drinkType === 'cocktail' ? fr.cocktailBuilder : fr.mocktailBuilder}
        </h2>
      </div>

      {/* Step: Base Selection */}
      {step === 'base' && (
        <div className="slide-up">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-300">
            {drinkType === 'cocktail' ? fr.chooseYourSpiritBase : fr.chooseYourBase}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {bases.map(base => (
              <button
                key={base}
                onClick={() => setSelectedBase(base)}
                className={`glass-card rounded-xl p-4 text-center transition-all cursor-pointer
                  ${selectedBase === base
                    ? 'border-violet-500/50 bg-violet-500/15 ring-2 ring-violet-500/30'
                    : ''
                  }`}
              >
                <div className="text-2xl mb-1">{baseEmojis[base] || '🍸'}</div>
                <div className="text-sm font-medium">{base}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Vibe Selection */}
      {step === 'vibe' && (
        <div className="slide-up">
          <h3 className="text-lg font-semibold mb-2 text-center text-gray-300">
            {fr.selectVibeOneOrMore}
          </h3>
          <p className="text-gray-500 text-sm text-center mb-6">
            {fr.base}: <span className="text-amber-400">{selectedBase}</span>
          </p>
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {vibes.map(vibe => (
              <button
                key={vibe}
                onClick={() => toggleVibe(vibe)}
                className={`chip text-sm ${selectedVibes.includes(vibe) ? 'chip-selected' : ''}`}
              >
                <span>{vibeEmojis[vibe]}</span>
                <span>{getVibeLabel(vibe)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Ingredients */}
      {step === 'ingredients' && (
        <div className="slide-up">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: suggestions + library */}
            <div className="flex-1">
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="flex items-center gap-2 text-sm font-semibold text-violet-300 mb-3"
                  >
                    <span>{fr.smartSuggestionsTitle}</span>
                    <span className="text-xs text-gray-500">{showSuggestions ? '▼' : '▶'}</span>
                  </button>
                  {showSuggestions && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggestions.slice(0, 10).map(s => {
                        const isAdded = ingredients.some(i => i.name === s.name);
                        return (
                          <button
                            key={s.name}
                            onClick={() => !isAdded && quickAddIngredient(s.name, s.category)}
                            disabled={isAdded}
                            className={`glass-card rounded-lg p-3 text-left flex items-center gap-3 transition-all
                              ${isAdded 
                                ? 'opacity-50 cursor-not-allowed border-emerald-500/30 bg-emerald-500/10' 
                                : 'cursor-pointer hover:bg-violet-500/10'}`}
                          >
                            <div className="flex-1">
                              <div className="text-sm font-medium flex items-center gap-2">
                                {s.name}
                                {isAdded && <span className="text-emerald-400 text-xs">✓ Ajouté</span>}
                              </div>
                              <div className="text-[10px] text-gray-500">{s.reason}</div>
                            </div>
                            <StarRating rating={s.rating} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Search */}
              <div className="mb-4">
                <input
                  type="search"
                  placeholder={fr.searchIngredients}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Categories */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {Object.entries(filteredCategories).map(([cat, items]) => (
                  <div key={cat} className="glass rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === cat ? null : cat)}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center justify-between hover:bg-white/5 transition"
                    >
                      <span>{getCategoryLabel(cat)}</span>
                      <span className="text-gray-500 text-xs">
                        {items.length} {fr.items} {expandedCategory === cat ? '▼' : '▶'}
                      </span>
                    </button>
                    {expandedCategory === cat && (
                      <div className="px-4 pb-3 flex flex-wrap gap-2">
                        {items.map(item => {
                          const isAdded = ingredients.some(i => i.name === item);
                          return (
                            <button
                              key={item}
                              onClick={() => !isAdded && quickAddIngredient(item, cat)}
                              className={`chip text-xs transition-all
                                ${isAdded 
                                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 cursor-not-allowed' 
                                  : 'hover:bg-violet-500/20 cursor-pointer'}`}
                              disabled={isAdded}
                            >
                              {item} {isAdded && '✓'}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: current ingredients */}
            <div className="lg:w-96">
              <div className="glass-strong rounded-xl p-4 sticky top-24">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <span>📝</span> {fr.recipe} ({ingredients.length} {fr.ingredients.toLowerCase()})
                </h4>

                {/* Manual add form */}
                <div className="mb-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-xs text-gray-400 mb-2">Ajouter manuellement:</div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={fr.ingredient}
                      value={newIngName}
                      onChange={e => setNewIngName(e.target.value)}
                      className="flex-1 text-xs"
                      onKeyDown={e => e.key === 'Enter' && addIngredient()}
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={fr.qty}
                      value={newIngQty}
                      onChange={e => setNewIngQty(e.target.value)}
                      className="w-16 text-xs"
                    />
                    <select
                      value={newIngUnit}
                      onChange={e => setNewIngUnit(e.target.value)}
                      className="flex-1 text-xs"
                    >
                      {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <button
                      onClick={addIngredient}
                      className="px-3 py-1.5 rounded-lg bg-violet-500/30 text-violet-300 text-xs font-medium hover:bg-violet-500/40 transition"
                    >
                      {fr.add}
                    </button>
                  </div>
                </div>

                {/* Ingredient list */}
                <div className="space-y-2 max-h-[350px] overflow-y-auto">
                  {ingredients.map((ing, idx) => (
                    <div key={ing.id} className="flex items-center gap-2 glass rounded-lg px-3 py-2">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveIngredient(idx, 'up')}
                          className="text-[10px] text-gray-500 hover:text-white leading-none"
                          disabled={idx === 0}
                        >▲</button>
                        <button
                          onClick={() => moveIngredient(idx, 'down')}
                          className="text-[10px] text-gray-500 hover:text-white leading-none"
                          disabled={idx === ingredients.length - 1}
                        >▼</button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{ing.name}</div>
                        <div className="flex gap-1 mt-1">
                          <input
                            type="text"
                            value={ing.quantity}
                            onChange={e => updateIngredient(ing.id, 'quantity', e.target.value)}
                            className="w-12 text-[10px] py-0.5 px-1"
                          />
                          <select
                            value={ing.unit}
                            onChange={e => updateIngredient(ing.id, 'unit', e.target.value)}
                            className="text-[10px] py-0.5 px-1 flex-1"
                          >
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => removeIngredient(ing.id)}
                        className="text-red-400/60 hover:text-red-400 text-sm"
                      >✕</button>
                    </div>
                  ))}
                </div>

                {ingredients.length === 0 && (
                  <p className="text-gray-500 text-xs text-center py-4">
                    {fr.clickToAdd}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step: Preparation */}
      {step === 'preparation' && (
        <div className="slide-up max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-300">
            {fr.finalDetails}
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{fr.drinkName}</label>
              <input
                type="text"
                placeholder={`Mon ${drinkType === 'cocktail' ? 'Cocktail' : 'Mocktail'}`}
                value={drinkName}
                onChange={e => setDrinkName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{fr.preparationMethod}</label>
              <textarea
                placeholder={fr.describeHowToPrepare}
                value={preparation}
                onChange={e => setPreparation(e.target.value)}
                rows={3}
                className="w-full resize-none"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {fr.prepSuggestions.map(sug => (
                  <button
                    key={sug}
                    onClick={() => setPreparation(prev => prev ? `${prev}. ${sug}` : sug)}
                    className="chip text-[10px]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{fr.notesOptional}</label>
              <textarea
                placeholder={fr.anyAdditionalNotes}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                className="w-full resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{fr.tagsCommaSeparated}</label>
              <input
                type="text"
                placeholder={fr.tagsPlaceholder}
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
            </div>

            {/* Recipe preview */}
            <div className="glass rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-2 text-amber-400">{fr.recipePreview}</h4>
              <p className="text-xs text-gray-400 mb-1">
                <span className="text-gray-300">{fr.base}:</span> {selectedBase}
              </p>
              <p className="text-xs text-gray-400 mb-1">
                <span className="text-gray-300">{fr.vibes}:</span> {selectedVibes.map(v => getVibeLabel(v)).join(', ')}
              </p>
              <div className="mt-2 space-y-1">
                {ingredients.map(i => (
                  <p key={i.id} className="text-xs text-gray-300">
                    • {i.quantity} {i.unit} {i.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step: Evaluate */}
      {step === 'evaluate' && evaluation && (
        <div className="slide-up max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">
              {evaluation.scores.overall >= 8 ? '🏆' :
                evaluation.scores.overall >= 6 ? '⭐' :
                  evaluation.scores.overall >= 4 ? '👍' : '🔧'}
            </div>
            <h3 className="text-2xl font-bold">
              {drinkName || 'Votre Boisson'} — {fr.evaluation}
            </h3>
          </div>

          {/* Overall Score */}
          <div className="flex justify-center mb-8">
            <ScoreGauge
              value={evaluation.scores.overall}
              label={fr.overallScore}
              size="lg"
            />
          </div>

          {/* Individual Scores */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-8">
            {(Object.entries(evaluation.scores) as [string, number][])
              .filter(([key]) => key !== 'overall')
              .map(([key, value]) => (
                <ScoreGauge
                  key={key}
                  value={value}
                  label={scoreLabels[key] || key}
                  size="sm"
                />
              ))}
          </div>

          {/* Feedback */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {evaluation.pros.length > 0 && (
              <div className="glass rounded-xl p-4">
                <h4 className="text-sm font-semibold text-emerald-400 mb-2">{fr.pros}</h4>
                <ul className="space-y-1">
                  {evaluation.pros.map((p, i) => (
                    <li key={i} className="text-xs text-gray-300">• {p}</li>
                  ))}
                </ul>
              </div>
            )}
            {evaluation.cons.length > 0 && (
              <div className="glass rounded-xl p-4">
                <h4 className="text-sm font-semibold text-red-400 mb-2">{fr.cons}</h4>
                <ul className="space-y-1">
                  {evaluation.cons.map((c, i) => (
                    <li key={i} className="text-xs text-gray-300">• {c}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="glass rounded-xl p-4">
              <h4 className="text-sm font-semibold text-cyan-400 mb-2">{fr.serving}</h4>
              <p className="text-xs text-gray-300 mb-1">
                <span className="text-gray-400">{fr.glass}:</span> {evaluation.glassRecommendation}
              </p>
              <p className="text-xs text-gray-300 mb-2">
                <span className="text-gray-400">{fr.garnish}:</span> {evaluation.suggestedGarnish}
              </p>
              <ul className="space-y-1">
                {evaluation.servingTips.map((t, i) => (
                  <li key={i} className="text-xs text-gray-400">• {t}</li>
                ))}
              </ul>
            </div>
            {evaluation.suggestedImprovements.length > 0 && (
              <div className="glass rounded-xl p-4">
                <h4 className="text-sm font-semibold text-amber-400 mb-2">{fr.improvements}</h4>
                <ul className="space-y-1">
                  {evaluation.suggestedImprovements.map((s, i) => (
                    <li key={i} className="text-xs text-gray-300">• {s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {evaluation.possibleVariations.length > 0 && (
            <div className="glass rounded-xl p-4 mb-8">
              <h4 className="text-sm font-semibold text-violet-400 mb-2">{fr.possibleVariations}</h4>
              <div className="flex flex-wrap gap-2">
                {evaluation.possibleVariations.map((v, i) => (
                  <span key={i} className="chip text-xs">{v}</span>
                ))}
              </div>
            </div>
          )}

          {/* Save */}
          <div className="flex justify-center">
            <button
              onClick={handleSave}
              className="px-8 py-3 rounded-xl animated-gradient text-white font-bold text-lg shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
            >
              {fr.saveRecipe}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      {step !== 'evaluate' && (
        <div className="flex justify-between items-center mt-8 max-w-3xl mx-auto">
          <button
            onClick={goPrev}
            className="px-5 py-2.5 rounded-xl glass text-sm font-medium hover:bg-white/10 transition"
          >
            {fr.back}
          </button>
          <button
            onClick={goNext}
            disabled={!canProceed()}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition
              ${canProceed()
                ? 'animated-gradient text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
          >
            {step === 'preparation' ? fr.evaluateBtn : fr.next}
          </button>
        </div>
      )}
    </div>
  );
}
