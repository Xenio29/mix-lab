import type { DrinkType } from '../types';
import { fr } from '../i18n';

interface LandingProps {
  onSelect: (type: DrinkType) => void;
  drinkCount: number;
}

export function Landing({ onSelect, drinkCount }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(6,182,212,0.1) 0%, transparent 50%)'
        }} />
      </div>

      {/* Ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-14 fade-in relative z-10">
        <div className="text-7xl sm:text-8xl mb-6 float-animation inline-block">🍸</div>
        <h1 className="text-5xl sm:text-7xl font-bold mb-4 tracking-tight">
          <span className="animated-gradient-text">{fr.appName}</span>
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
          {fr.tagline}
          <br className="hidden sm:block" />
          {fr.tagline2}
        </p>
        {drinkCount > 0 && (
          <p className="text-gray-500 text-sm mt-4 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {drinkCount} {fr.recipesInCollection}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-2xl w-full relative z-10">
        <button
          onClick={() => onSelect('cocktail')}
          className="glass-card rounded-2xl p-8 sm:p-10 text-center group fade-in-1 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="text-6xl sm:text-7xl mb-5 group-hover:scale-110 transition-transform duration-500">🍸</div>
            <h2 className="text-2xl font-bold mb-2 text-white">{fr.alcoholicCocktail}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {fr.alcoholicDesc}
            </p>
            <div className="mt-5 inline-block px-5 py-2 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 group-hover:bg-amber-500/30 transition-colors">
              {fr.selectSpiritBase}
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelect('mocktail')}
          className="glass-card rounded-2xl p-8 sm:p-10 text-center group fade-in-2 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="text-6xl sm:text-7xl mb-5 group-hover:scale-110 transition-transform duration-500">🍹</div>
            <h2 className="text-2xl font-bold mb-2 text-white">{fr.alcoholFreeMocktail}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {fr.mocktailDesc}
            </p>
            <div className="mt-5 inline-block px-5 py-2 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-colors">
              {fr.selectMocktailBase}
            </div>
          </div>
        </button>
      </div>

      {/* Bottom features teaser */}
      <div className="flex flex-wrap gap-6 justify-center mt-14 relative z-10 fade-in-3">
        {[
          { icon: '✨', label: fr.smartSuggestions },
          { icon: '🧪', label: fr.aiEvaluation },
          { icon: '📊', label: fr.analytics },
          { icon: '📚', label: fr.recipeLibrary },
        ].map(f => (
          <div key={f.label} className="flex items-center gap-2 text-gray-500 text-xs">
            <span className="text-base">{f.icon}</span>
            <span>{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
