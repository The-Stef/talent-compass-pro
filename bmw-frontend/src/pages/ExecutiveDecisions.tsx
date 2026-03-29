import { DashboardLayout } from "@/components/DashboardLayout";
import { ScoreRing } from "@/components/ScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { usePipeline } from "@/context/PipelineContext";
import { FileCheck, ArrowRight, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function ExecutiveDecisions() {
  const { executiveDecisions, executiveSummary } = usePipeline();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Executive Decisions</h1>
          <p className="text-muted-foreground mt-1">Final recommendations — AI Decision Synthesis Agent</p>
        </div>

        {/* Executive Summary */}
        <div className="glass-card p-6 border-l-4 border-primary">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-semibold text-foreground">Executive Summary</h2>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground/80 leading-relaxed">
              Analysis of <span className="font-semibold text-foreground">{executiveSummary.totalForecastedRoles} strategic roles</span> forecasted
              for Q2–Q4 2026 reveals a pipeline health score of <span className="font-semibold text-foreground">{executiveSummary.pipelineHealth}%</span>.
              BMW has strong internal candidates for <span className="font-semibold text-success">{executiveSummary.internalReady} positions</span>,
              requires <span className="font-semibold text-destructive">{executiveSummary.externalRequired} external hire</span>,
              and <span className="font-semibold text-warning">{executiveSummary.hybridApproach} hybrid approach</span>.
              Immediate attention required for {executiveSummary.urgentRoles} critical roles.
            </p>
          </div>
        </div>

        {/* Decision Cards */}
        <div className="space-y-4">
          {executiveDecisions.map((d, i) => (
            <div key={d.roleId} className="glass-card-hover p-6 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge status={d.decision.split(' ')[0]} variant="action" />
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {d.urgency}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{d.roleTitle}</h3>
                  <p className="text-sm text-muted-foreground">{d.department}</p>
                </div>
                <div className="text-center flex-shrink-0">
                  <ScoreRing score={d.confidence} size="lg" />
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Confidence</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {d.primaryCandidate && (
                  <div className="p-3 rounded-lg bg-success/5 border border-success/10">
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      <span className="text-[10px] font-semibold text-success uppercase tracking-wider">Primary Candidate</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{d.primaryCandidate}</p>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    <span className="text-[10px] font-semibold text-destructive uppercase tracking-wider">Key Risk</span>
                  </div>
                  <p className="text-sm text-foreground/70">{d.keyRisk}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Next Step This Week</span>
                  </div>
                  <p className="text-sm text-foreground/70">{d.nextStep}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
