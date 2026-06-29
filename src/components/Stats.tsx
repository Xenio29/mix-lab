import { useMemo } from 'react';
import type { Drink } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fr } from '../i18n';

interface StatsProps {
  drinks: Drink[];
}

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#f43f5e', '#10b981', '#f97316', '#6366f1', '#ec4899'];

export function Stats({ drinks }: StatsProps) {
  const getVibeLabel = (vibe: string) => fr.vibeNames[vibe] || vibe;

  const stats = useMemo(() => {
    if (drinks.length === 0) return null;

    const totalDrinks = drinks.length;
    const cocktails = drinks.filter(d => d.type === 'cocktail').length;
    const mocktails = drinks.filter(d => d.type === 'mocktail').length;

    const scores = drinks
      .map(d => d.evaluation?.scores.overall || 0)
      .filter(s => s > 0);
    const avgScore = scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;

    // Most used ingredient
    const ingredientCount: Record<string, number> = {};
    drinks.forEach(d => d.ingredients.forEach(i => {
      ingredientCount[i.name] = (ingredientCount[i.name] || 0) + 1;
    }));
    const sortedIngredients = Object.entries(ingredientCount).sort((a, b) => b[1] - a[1]);
    const mostUsedIngredient = sortedIngredients[0]?.[0] || 'N/A';

    // Most used base
    const baseCount: Record<string, number> = {};
    drinks.forEach(d => { baseCount[d.base] = (baseCount[d.base] || 0) + 1; });
    const sortedBases = Object.entries(baseCount).sort((a, b) => b[1] - a[1]);
    const mostUsedBase = sortedBases[0]?.[0] || 'N/A';

    // Most common vibe
    const vibeCount: Record<string, number> = {};
    drinks.forEach(d => d.vibes.forEach(v => {
      vibeCount[v] = (vibeCount[v] || 0) + 1;
    }));
    const sortedVibes = Object.entries(vibeCount).sort((a, b) => b[1] - a[1]);
    const mostCommonVibe = sortedVibes[0]?.[0] || 'N/A';

    // Highest rated
    const highestRated = drinks.reduce((best, d) => {
      const score = d.evaluation?.scores.overall || 0;
      const bestScore = best.evaluation?.scores.overall || 0;
      return score > bestScore ? d : best;
    }, drinks[0]);

    // Newest
    const newest = drinks.reduce((n, d) =>
      new Date(d.createdAt) > new Date(n.createdAt) ? d : n, drinks[0]);

    // Ingredient frequency chart data
    const ingredientChartData = sortedIngredients.slice(0, 10).map(([name, count]) => ({
      name: name.length > 12 ? name.substring(0, 12) + '…' : name,
      count
    }));

    // Score distribution
    const scoreDistribution = Array.from({ length: 10 }, (_, i) => ({
      range: `${i + 1}`,
      count: scores.filter(s => Math.floor(s) === i + 1 || (i === 9 && s === 10)).length
    }));

    // Type pie
    const typePieData = [
      { name: fr.cocktails, value: cocktails },
      { name: fr.mocktails, value: mocktails }
    ].filter(d => d.value > 0);

    // Vibe pie
    const vibePieData = sortedVibes.slice(0, 6).map(([name, value]) => ({ 
      name: getVibeLabel(name), 
      value 
    }));

    return {
      totalDrinks, cocktails, mocktails, avgScore,
      mostUsedIngredient, mostUsedBase, mostCommonVibe,
      highestRated, newest,
      ingredientChartData, scoreDistribution,
      typePieData, vibePieData
    };
  }, [drinks]);

  if (!stats) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500 text-lg">{fr.noDataYet}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2 fade-in">{fr.statistics}</h2>
      <p className="text-gray-500 text-center mb-8 text-sm fade-in">{fr.yourMixologyAnalytics}</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: fr.totalDrinks, value: stats.totalDrinks, icon: '🍹', color: 'violet' },
          { label: fr.avgScore, value: stats.avgScore, icon: '⭐', color: 'amber' },
          { label: fr.topIngredient, value: stats.mostUsedIngredient, icon: '🧪', color: 'cyan' },
          { label: fr.topBase, value: stats.mostUsedBase, icon: '🥃', color: 'emerald' },
          { label: fr.topVibe, value: getVibeLabel(stats.mostCommonVibe), icon: '✨', color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl p-4 text-center fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-lg font-bold truncate">{stat.value}</div>
            <div className="text-[10px] text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Highlight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="glass rounded-xl p-4 fade-in-1">
          <h4 className="text-sm font-semibold text-amber-400 mb-2">{fr.highestRated}</h4>
          <p className="text-lg font-bold">{stats.highestRated.name}</p>
          <p className="text-xs text-gray-400">
            Score: {stats.highestRated.evaluation?.scores.overall || 'N/A'} • {stats.highestRated.base}
          </p>
        </div>
        <div className="glass rounded-xl p-4 fade-in-2">
          <h4 className="text-sm font-semibold text-cyan-400 mb-2">{fr.newestDrink}</h4>
          <p className="text-lg font-bold">{stats.newest.name}</p>
          <p className="text-xs text-gray-400">
            {new Date(stats.newest.createdAt).toLocaleDateString('fr-FR')} • {stats.newest.base}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingredient Frequency */}
        <div className="glass rounded-xl p-4 fade-in-3">
          <h4 className="text-sm font-semibold mb-4">{fr.topIngredients}</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ingredientChartData} layout="vertical">
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} width={100} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="glass rounded-xl p-4 fade-in-4">
          <h4 className="text-sm font-semibold mb-4">{fr.scoreDistribution}</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.scoreDistribution}>
                <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Type Distribution */}
        <div className="glass rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-4">{fr.typeBreakdown}</h4>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.typePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {stats.typePieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vibe Distribution */}
        <div className="glass rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-4">{fr.topVibes}</h4>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.vibePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {stats.vibePieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
