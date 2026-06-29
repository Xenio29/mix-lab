import { useState, useMemo } from 'react';
import type { Drink } from '../types';
import { vibeEmojis } from '../data/ingredients';
import { fr } from '../i18n';

interface LibraryProps {
  drinks: Drink[];
  onView: (drink: Drink) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function Library({ drinks, onView, onToggleFavorite, onDelete, onDuplicate }: LibraryProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'cocktail' | 'mocktail'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score' | 'name'>('newest');
  const [vibeFilter, setVibeFilter] = useState('');
  const [baseFilter, setBaseFilter] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  const [minScore, setMinScore] = useState(0);

  const getVibeLabel = (vibe: string) => fr.vibeNames[vibe] || vibe;

  const allVibes = useMemo(() => {
    const s = new Set<string>();
    drinks.forEach(d => d.vibes.forEach(v => s.add(v)));
    return Array.from(s).sort();
  }, [drinks]);

  const allBases = useMemo(() => {
    const s = new Set<string>();
    drinks.forEach(d => s.add(d.base));
    return Array.from(s).sort();
  }, [drinks]);

  const filtered = useMemo(() => {
    let result = [...drinks];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.base.toLowerCase().includes(q) ||
        d.vibes.some(v => v.toLowerCase().includes(q) || getVibeLabel(v).toLowerCase().includes(q)) ||
        d.ingredients.some(i => i.name.toLowerCase().includes(q)) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Type
    if (typeFilter !== 'all') result = result.filter(d => d.type === typeFilter);

    // Vibe
    if (vibeFilter) result = result.filter(d => d.vibes.includes(vibeFilter));

    // Base
    if (baseFilter) result = result.filter(d => d.base === baseFilter);

    // Favorites
    if (favOnly) result = result.filter(d => d.favorite);

    // Min score
    if (minScore > 0) result = result.filter(d => (d.evaluation?.scores.overall || 0) >= minScore);

    // Sort
    switch (sortBy) {
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'oldest': result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case 'score': result.sort((a, b) => (b.evaluation?.scores.overall || 0) - (a.evaluation?.scores.overall || 0)); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return result;
  }, [drinks, search, typeFilter, sortBy, vibeFilter, baseFilter, favOnly, minScore]);

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2 fade-in">{fr.drinkLibrary}</h2>
      <p className="text-gray-500 text-center mb-8 text-sm fade-in">{drinks.length} {fr.recipes}</p>

      {/* Filters */}
      <div className="glass rounded-xl p-4 mb-6 fade-in">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <input
              type="search"
              placeholder={fr.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as 'all' | 'cocktail' | 'mocktail')} className="w-36">
            <option value="all">{fr.allTypes}</option>
            <option value="cocktail">{fr.cocktail}</option>
            <option value="mocktail">{fr.mocktail}</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="w-32">
            <option value="newest">{fr.newest}</option>
            <option value="oldest">{fr.oldest}</option>
            <option value="score">{fr.topRated}</option>
            <option value="name">{fr.nameAZ}</option>
          </select>
          {allVibes.length > 0 && (
            <select value={vibeFilter} onChange={e => setVibeFilter(e.target.value)} className="w-40">
              <option value="">{fr.allVibes}</option>
              {allVibes.map(v => <option key={v} value={v}>{vibeEmojis[v] || ''} {getVibeLabel(v)}</option>)}
            </select>
          )}
          {allBases.length > 0 && (
            <select value={baseFilter} onChange={e => setBaseFilter(e.target.value)} className="w-36">
              <option value="">{fr.allBases}</option>
              {allBases.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          )}
          <button
            onClick={() => setFavOnly(!favOnly)}
            className={`px-3 py-2 rounded-lg text-sm transition ${favOnly ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'glass'}`}
          >
            {fr.favorites}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{fr.minScore}</span>
            <input
              type="number"
              min={0}
              max={10}
              value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-16 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 fade-in">
          <div className="text-6xl mb-4">🍸</div>
          <p className="text-gray-500 text-lg">
            {drinks.length === 0 ? fr.noRecipesYet : fr.noResults}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((drink, i) => (
            <div
              key={drink.id}
              className="glass-card rounded-xl overflow-hidden cursor-pointer fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => onView(drink)}
            >
              {/* Card header with gradient */}
              <div className={`h-24 relative ${drink.type === 'cocktail'
                ? 'bg-gradient-to-br from-amber-600/30 to-violet-600/30'
                : 'bg-gradient-to-br from-emerald-600/30 to-cyan-600/30'
                }`}>
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold
                    ${drink.type === 'cocktail'
                      ? 'bg-amber-500/30 text-amber-200'
                      : 'bg-emerald-500/30 text-emerald-200'
                    }`}>
                    {drink.type === 'cocktail' ? '🍸 Cocktail' : '🍹 Mocktail'}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    onClick={e => { e.stopPropagation(); onToggleFavorite(drink.id); }}
                    className="text-lg hover:scale-125 transition-transform"
                  >
                    {drink.favorite ? '❤️' : '🤍'}
                  </button>
                </div>
                {drink.evaluation && (
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: drink.evaluation.scores.overall >= 7
                        ? 'rgba(16,185,129,0.3)'
                        : drink.evaluation.scores.overall >= 5
                          ? 'rgba(245,158,11,0.3)'
                          : 'rgba(239,68,68,0.3)',
                      border: `2px solid ${drink.evaluation.scores.overall >= 7
                        ? 'rgba(16,185,129,0.5)'
                        : drink.evaluation.scores.overall >= 5
                          ? 'rgba(245,158,11,0.5)'
                          : 'rgba(239,68,68,0.5)'}`
                    }}>
                    {drink.evaluation.scores.overall}
                  </div>
                )}
                <div className="absolute bottom-3 left-3 text-3xl">
                  {drink.type === 'cocktail' ? '🍸' : '🍹'}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 truncate">{drink.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{drink.base}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {drink.vibes.slice(0, 3).map(v => (
                    <span key={v} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400">
                      {vibeEmojis[v]} {getVibeLabel(v)}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>{drink.ingredients.length} {fr.ingredientsCount}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={e => { e.stopPropagation(); onDuplicate(drink.id); }}
                      className="hover:text-white transition"
                      title="Dupliquer"
                    >📋</button>
                    <button
                      onClick={e => { e.stopPropagation(); onDelete(drink.id); }}
                      className="hover:text-red-400 transition"
                      title="Supprimer"
                    >🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
