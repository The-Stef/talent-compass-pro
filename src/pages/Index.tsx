import { DashboardLayout } from "@/components/DashboardLayout";
import { ScoreRing } from "@/components/ScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { usePipeline } from "@/context/PipelineContext";
import { AlertTriangle, TrendingUp, Users, Target, Sparkles, Shield, Play, Loader2, Info } from "lucide-react";

function StatCard({ icon: Icon, label, value, gradient, subtitle }: {
  icon: React.ElementType; label: string; value: string | number; gradient: string; subtitle?: string;
}) {
  return (
    <div className="glass-card-hover p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${gradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-display text-3xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

export default function ExecutiveDashboard() {
  const {
    executiveSummary,
    roleMatches,
    executiveDecisions,
    isRunning,
    isUsingDemoData,
    runAnalysis,
  } = usePipeline();

  const internalCount = roleMatches.filter(r => r.recommendedAction === 'internal').length;
  const externalCount = roleMatches.filter(r => r.recommendedAction === 'external').length;
  const hybridCount = roleMatches.filter(r => r.recommendedAction === 'hybrid').length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Executive Dashboard</h1>
            <p className="text-muted-foreground mt-1">AI-powered talent intelligence overview — BMW Group</p>
          </div>
          <div className="flex items-center gap-3">
            {isUsingDemoData && (
              <span className="flex items-center gap-1.5 text-xs text-warning bg-warning/10 px-3 py-1.5 rounded-full border border-warning/20">
                <Info className="w-3 h-3" />
                Demo Data
              </span>
            )}
            <button
              onClick={() => runAnalysis()}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg stat-gradient-blue text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Analysis…
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Target} label="Pipeline Health" value={executiveSummary.pipelineHealth > 0 ? `${executiveSummary.pipelineHealth}%` : executiveSummary.pipelineHealthLabel} gradient="stat-gradient-blue" subtitle={`Status: ${executiveSummary.pipelineHealthLabel}`} />
          <StatCard icon={AlertTriangle} label="Urgent Roles" value={executiveSummary.urgentRoles} gradient="stat-gradient-red" subtitle="Requiring immediate action" />
          <StatCard icon={Users} label="Internal Ready" value={internalCount} gradient="stat-gradient-green" subtitle={`${externalCount} external, ${hybridCount} hybrid`} />
          <StatCard icon={TrendingUp} label="Forecasted Roles" value={executiveSummary.totalForecastedRoles} gradient="stat-gradient-amber" subtitle="Next 6–12 months" />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Risks */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-4 h-4 text-destructive" />
              <h2 className="font-display text-lg font-semibold text-foreground">Top Organizational Risks</h2>
            </div>
            <div className="space-y-3">
              {executiveSummary.topRisks.map((risk, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <span className="text-destructive font-bold text-sm mt-0.5">{i + 1}</span>
                  <p className="text-sm text-foreground/80 leading-relaxed">{risk}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hidden Talent */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-warning" />
              <h2 className="font-display text-lg font-semibold text-foreground">Hidden Talent Highlights</h2>
            </div>
            <div className="space-y-3">
              {executiveSummary.hiddenTalent.map((talent, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10">
                  <Sparkles className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 leading-relaxed">{talent}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Critical Roles Summary */}
        <div className="glass-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-5">Critical Role Decisions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Department</th>
                  <th className="text-center py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Decision</th>
                  <th className="text-center py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Candidate</th>
                  <th className="text-center py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Confidence</th>
                  <th className="text-center py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Urgency</th>
                </tr>
              </thead>
              <tbody>
                {executiveDecisions.map((d) => (
                  <tr key={d.roleId} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-foreground">{d.roleTitle}</td>
                    <td className="py-3 px-3 text-muted-foreground">{d.department}</td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge status={d.decision.split(' ')[0]} variant="action" />
                    </td>
                    <td className="py-3 px-3 text-center text-foreground/80">{d.primaryCandidate || '—'}</td>
                    <td className="py-3 px-3 text-center">
                      <ScoreRing score={d.confidence} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-center text-xs text-muted-foreground">{d.urgency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
