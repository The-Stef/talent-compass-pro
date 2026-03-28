import { DashboardLayout } from "@/components/DashboardLayout";
import { ScoreRing } from "@/components/ScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { forecastedRoles } from "@/data/demo-data";
import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, AlertTriangle } from "lucide-react";

function RoleCard({ role }: { role: typeof forecastedRoles[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card-hover p-5 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <StatusBadge status={role.status} variant="urgency" />
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {role.openingTimeline}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-1">{role.title}</h3>
          <p className="text-sm text-muted-foreground">{role.department}</p>
        </div>
        <ScoreRing score={role.urgencyScore} size="lg" />
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-primary mt-4 hover:text-primary/80 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? 'Less detail' : 'More detail'}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 pt-4 border-t border-border/50 animate-fade-in">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Strategic Importance</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">{role.strategicImportance}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Key Requirements</h4>
            <div className="flex flex-wrap gap-2">
              {role.keyRequirements.map((req, i) => (
                <span key={i} className="text-xs bg-secondary px-2.5 py-1 rounded-md text-secondary-foreground">{req}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-destructive mb-1">Risk if Unfilled</h4>
              <p className="text-sm text-foreground/70">{role.riskIfUnfilled}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ForecastedRoles() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Forecasted Roles</h1>
          <p className="text-muted-foreground mt-1">Ranked by urgency score — AI Role Forecasting Agent</p>
        </div>
        <div className="space-y-4">
          {forecastedRoles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
