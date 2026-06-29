import type { Drink } from '../types';
import { vibeEmojis } from '../data/ingredients';
import { ScoreGauge } from './ScoreGauge';
import { fr } from '../i18n';

interface DrinkDetailProps {
  drink: Drink;
  onBack: () => void;
  onEdit: (drink: Drink) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onPrint: (drink: Drink) => void;
}

export function DrinkDetail({ drink, onBack, onEdit, onToggleFavorite, onDuplicate, onDelete, onPrint }: DrinkDetailProps) {
  const ev = drink.evaluation;
  const getVibeLabel = (vibe: string) => fr.vibeNames[vibe] || vibe;

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
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-4xl mx-auto">
      <button onClick={onBack} className="text-sm text-gray-400 hover:text-white mb-6 inline-flex items-center gap-1 transition">
        {fr.backToLibrary}
      </button>

      <div className="slide-up">
        {/* Header */}
        <div className={`rounded-2xl p-8 mb-6 relative overflow-hidden
          ${drink.type === 'cocktail'
            ? 'bg-gradient-to-br from-amber-600/20 to-violet-600/20'
            : 'bg-gradient-to-br from-emerald-600/20 to-cyan-600/20'
          }`}>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                  ${drink.type === 'cocktail'
                    ? 'bg-amber-500/30 text-amber-200'
                    : 'bg-emerald-500/30 text-emerald-200'
                  }`}>
                  {drink.type === 'cocktail' ? '🍸 Cocktail' : '🍹 Mocktail'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onToggleFavorite(drink.id)}
                  className="text-xl hover:scale-125 transition-transform">
                  {drink.favorite ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{drink.name}</h1>
            <p className="text-gray-300 text-sm mb-3">{fr.base}: {drink.base}</p>
            <div className="flex flex-wrap gap-2">
              {drink.vibes.map(v => (
                <span key={v} className="chip text-xs">
                  {vibeEmojis[v]} {getVibeLabel(v)}
                </span>
              ))}
            </div>
          </div>
          <div className="absolute top-4 right-4 text-8xl opacity-20">
            {drink.type === 'cocktail' ? '🍸' : '🍹'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ingredients */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📝 {fr.ingredients}
            </h3>
            <div className="space-y-2">
              {drink.ingredients.map(i => (
                <div key={i.id} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-violet-400" />
                  <span className="text-sm text-gray-300 flex-1">{i.name}</span>
                  <span className="text-sm text-amber-400 font-medium">{i.quantity} {i.unit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation */}
          <div className="space-y-6">
            {drink.preparation && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  🔧 {fr.prep}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">{drink.preparation}</p>
              </div>
            )}

            {ev && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  {fr.serving}
                </h3>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="text-gray-500">{fr.glass}:</span> {ev.glassRecommendation}
                </p>
                <p className="text-sm text-gray-300">
                  <span className="text-gray-500">{fr.garnish}:</span> {ev.suggestedGarnish}
                </p>
              </div>
            )}

            {drink.notes && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">📝 {fr.notes}</h3>
                <p className="text-sm text-gray-300">{drink.notes}</p>
              </div>
            )}

            {drink.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {drink.tags.map(t => (
                  <span key={t} className="chip text-xs">#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Evaluation */}
        {ev && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-center">🧪 {fr.evaluation}</h3>

            <div className="flex justify-center mb-6">
              <ScoreGauge value={ev.scores.overall} label={fr.overallScore} size="lg" />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-6">
              {(Object.entries(ev.scores) as [string, number][])
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ev.pros.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-2">{fr.pros}</h4>
                  <ul className="space-y-1">
                    {ev.pros.map((p, i) => (
                      <li key={i} className="text-xs text-gray-300">• {p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {ev.cons.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-red-400 mb-2">{fr.cons}</h4>
                  <ul className="space-y-1">
                    {ev.cons.map((c, i) => (
                      <li key={i} className="text-xs text-gray-300">• {c}</li>
                    ))}
                  </ul>
                </div>
              )}
              {ev.suggestedImprovements.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-amber-400 mb-2">{fr.improvements}</h4>
                  <ul className="space-y-1">
                    {ev.suggestedImprovements.map((s, i) => (
                      <li key={i} className="text-xs text-gray-300">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {ev.possibleVariations.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-violet-400 mb-2">{fr.possibleVariations}</h4>
                  <ul className="space-y-1">
                    {ev.possibleVariations.map((v, i) => (
                      <li key={i} className="text-xs text-gray-300">• {v}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <button onClick={() => onEdit(drink)}
            className="px-4 py-2 rounded-lg glass text-sm font-medium hover:bg-white/10 transition">
            {fr.edit}
          </button>
          <button onClick={() => onDuplicate(drink.id)}
            className="px-4 py-2 rounded-lg glass text-sm font-medium hover:bg-white/10 transition">
            {fr.duplicate}
          </button>
          <button onClick={() => onPrint(drink)}
            className="px-4 py-2 rounded-lg glass text-sm font-medium hover:bg-white/10 transition">
            {fr.printPdf}
          </button>
          <button onClick={() => { onDelete(drink.id); onBack(); }}
            className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition border border-red-500/20">
            {fr.delete}
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-4">
          {fr.created}: {new Date(drink.createdAt).toLocaleDateString('fr-FR')} • {fr.updated}: {new Date(drink.updatedAt).toLocaleDateString('fr-FR')}
        </p>
      </div>
    </div>
  );
}
