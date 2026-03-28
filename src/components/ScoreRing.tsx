interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

function getScoreColor(score: number) {
  if (score >= 85) return { bg: 'bg-success/15', text: 'text-success', border: 'border-success/30' };
  if (score >= 70) return { bg: 'bg-warning/15', text: 'text-warning', border: 'border-warning/30' };
  return { bg: 'bg-destructive/15', text: 'text-destructive', border: 'border-destructive/30' };
}

const sizes = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
};

export function ScoreRing({ score, size = 'md' }: ScoreRingProps) {
  const colors = getScoreColor(score);
  return (
    <div className={`inline-flex items-center justify-center rounded-full font-bold border-2 ${colors.bg} ${colors.text} ${colors.border} ${sizes[size]}`}>
      {score}
    </div>
  );
}
