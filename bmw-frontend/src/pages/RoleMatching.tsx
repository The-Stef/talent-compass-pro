import { DashboardLayout } from "@/components/DashboardLayout";
import { ScoreRing } from "@/components/ScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { usePipeline } from "@/context/PipelineContext";
import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, UserCheck } from "lucide-react";
import type { RoleMatch } from "@/data/demo-data";

function MatchCard({ match }: { match: RoleMatch }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card-hover p-5 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <StatusBadge status={match.recommendedAction} variant="action" />
            {match.externalHireNeeded && match.recommendedAction !== 'external' && (
              <span className="text-[10px] text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20">External also needed</span>
            )}
            <ScoreRing score={match.urgencyScore} size="sm" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground">{match.roleTitle}</h3>
          <p className="text-sm text-muted-foreground">{match.department}</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
          <UserCheck className="w-3.5 h-3.5" />
          {match.candidates.length} candidate{match.candidates.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {match.candidates.map((c) => (
          <div key={c.employeeId} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-xs flex-shrink-0">
              {c.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{c.employeeName}</p>
              <p className="text-xs text-muted-foreground">{c.readinessTiming}</p>
            </div>
            <ScoreRing score={c.fitScore} size="sm" />
          </div>
        ))}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-primary mt-4 hover:text-primary/80 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? 'Less detail' : 'Gap analysis & reasoning'}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3 pt-4 border-t border-border/50 animate-fade-in">
          {match.candidates.map((c) => (
            <div key={c.employeeId}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{c.employeeName} — Gap Summary</h4>
              <p className="text-sm text-foreground/80">{c.gapSummary}</p>
            </div>
          ))}
          {match.externalReasoning && (
            <div className="p-3 rounded-lg bg-warning/5 border border-warning/10">
              <div className="flex items-center gap-1.5 mb-1">
                <ExternalLink className="w-3.5 h-3.5 text-warning" />
                <h4 className="text-xs font-semibold text-warning uppercase tracking-wider">External Hire Reasoning</h4>
              </div>
              <p className="text-sm text-foreground/70">{match.externalReasoning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RoleMatching() {
  const { roleMatches } = usePipeline();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Role Matching</h1>
          <p className="text-muted-foreground mt-1">Internal vs. external recommendations — AI Gap Bridging Agent</p>
        </div>
        <div className="space-y-4">
          {roleMatches.map((match) => (
            <MatchCard key={match.roleId} match={match} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
