import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { developmentInterventions } from "@/data/demo-data";
import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, BookOpen, Users2, RotateCw, FolderKanban, HeartHandshake } from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  training: BookOpen,
  mentorship: HeartHandshake,
  rotation: RotateCw,
  project: FolderKanban,
  coaching: Users2,
};

function InterventionCard({ intervention }: { intervention: typeof developmentInterventions[0] }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = typeIcons[intervention.type] || BookOpen;

  return (
    <div className="glass-card-hover p-5 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <StatusBadge status={intervention.priority} variant="priority" />
            <span className="text-xs text-muted-foreground capitalize bg-secondary px-2 py-0.5 rounded">{intervention.type}</span>
            <span className="text-xs text-muted-foreground">{intervention.duration}</span>
          </div>
          <h3 className="font-display text-base font-semibold text-foreground">{intervention.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {intervention.employeeName} → {intervention.targetRole}
          </p>
        </div>
      </div>

      <div className="mt-3 p-2.5 rounded-lg bg-secondary/30 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/70">Gap addressed:</span> {intervention.gapAddressed}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-primary mt-3 hover:text-primary/80 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? 'Less detail' : 'Success metrics & risk'}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 pt-3 border-t border-border/50 animate-fade-in">
          <div className="flex gap-2 p-3 rounded-lg bg-success/5 border border-success/10">
            <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-success mb-0.5">Success Metrics</h4>
              <p className="text-sm text-foreground/70">{intervention.successMetrics}</p>
            </div>
          </div>
          <div className="flex gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-destructive mb-0.5">Risk if Not Completed</h4>
              <p className="text-sm text-foreground/70">{intervention.riskIfNotCompleted}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DevelopmentPlans() {
  const grouped = developmentInterventions.reduce((acc, item) => {
    if (!acc[item.employeeName]) acc[item.employeeName] = [];
    acc[item.employeeName].push(item);
    return acc;
  }, {} as Record<string, typeof developmentInterventions>);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Development Plans</h1>
          <p className="text-muted-foreground mt-1">Targeted interventions — AI Development Planning Agent</p>
        </div>
        {Object.entries(grouped).map(([name, interventions]) => (
          <div key={name}>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-xs">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              {name}
            </h2>
            <div className="space-y-3 ml-9">
              {interventions.map((intervention) => (
                <InterventionCard key={intervention.id} intervention={intervention} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
