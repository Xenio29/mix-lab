import type { Page } from '../types';
import { fr } from '../i18n';

interface NavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Nav({ currentPage, onNavigate }: NavProps) {
  const links: { page: Page; label: string; icon: string }[] = [
    { page: 'landing', label: fr.home, icon: '🏠' },
    { page: 'builder', label: fr.create, icon: '✨' },
    { page: 'library', label: fr.library, icon: '📚' },
    { page: 'stats', label: fr.stats, icon: '📊' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-xl font-bold"
          >
            <span className="text-2xl">🍸</span>
            <span className="animated-gradient-text hidden sm:inline">{fr.appName}</span>
          </button>
          <div className="flex items-center gap-1 sm:gap-2">
            {links.map(({ page, label, icon }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
                  ${currentPage === page
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="text-base">{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
