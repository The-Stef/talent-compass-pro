import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  variant?: 'urgency' | 'action' | 'velocity' | 'priority';
}

export function StatusBadge({ status, variant = 'urgency' }: StatusBadgeProps) {
  const getClasses = () => {
    if (variant === 'urgency') {
      switch (status) {
        case 'critical': return 'bg-destructive/15 text-destructive border-destructive/30';
        case 'high': return 'bg-warning/15 text-warning border-warning/30';
        case 'medium': return 'bg-info/15 text-info border-info/30';
        default: return 'bg-muted text-muted-foreground border-border';
      }
    }
    if (variant === 'action') {
      switch (status) {
        case 'internal': return 'bg-success/15 text-success border-success/30';
        case 'external': return 'bg-destructive/15 text-destructive border-destructive/30';
        case 'hybrid': return 'bg-warning/15 text-warning border-warning/30';
        default: return 'bg-muted text-muted-foreground border-border';
      }
    }
    if (variant === 'velocity') {
      switch (status) {
        case 'accelerating': return 'bg-success/15 text-success border-success/30';
        case 'steady': return 'bg-info/15 text-info border-info/30';
        case 'plateau': return 'bg-warning/15 text-warning border-warning/30';
        default: return 'bg-muted text-muted-foreground border-border';
      }
    }
    if (variant === 'priority') {
      switch (status) {
        case 'critical': return 'bg-destructive/15 text-destructive border-destructive/30';
        case 'high': return 'bg-warning/15 text-warning border-warning/30';
        case 'medium': return 'bg-info/15 text-info border-info/30';
        default: return 'bg-muted text-muted-foreground border-border';
      }
    }
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-semibold ${getClasses()}`}>
      {status}
    </Badge>
  );
}
