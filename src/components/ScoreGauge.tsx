

interface ScoreGaugeProps {
  value: number;
  max?: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreGauge({ value, max = 10, label, size = 'md' }: ScoreGaugeProps) {
  const percentage = (value / max) * 100;
  const getColor = () => {
    if (percentage >= 80) return { ring: '#10b981', bg: 'rgba(16,185,129,0.15)' };
    if (percentage >= 60) return { ring: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
    if (percentage >= 40) return { ring: '#f97316', bg: 'rgba(249,115,22,0.15)' };
    return { ring: '#ef4444', bg: 'rgba(239,68,68,0.15)' };
  };
  const color = getColor();

  const dims = size === 'lg' ? 96 : size === 'md' ? 72 : 56;
  const strokeWidth = size === 'lg' ? 6 : size === 'md' ? 5 : 4;
  const radius = (dims - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dims, height: dims }}>
        <svg width={dims} height={dims} className="-rotate-90">
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={dims / 2}
            cy={dims / 2}
            r={radius}
            fill="none"
            stroke={color.ring}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-base' : 'text-xs'}`}
            style={{ color: color.ring }}>
            {value}
          </span>
        </div>
      </div>
      <span className={`text-gray-400 text-center ${size === 'lg' ? 'text-xs' : 'text-[10px]'} leading-tight`}>
        {label}
      </span>
    </div>
  );
}
