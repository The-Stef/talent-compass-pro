import { DashboardLayout } from "@/components/DashboardLayout";
import { ScoreRing } from "@/components/ScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { usePipeline } from "@/context/PipelineContext";
import { AlertTriangle, TrendingUp, Users, Target, Sparkles, Shield, RefreshCw, Play } from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
  subtitle,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  gradient: string;
  subtitle?: string;
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
    forecastedRoles,
    roleMatches,
    executiveDecisions,
    isLoading,
    isRunning,
    loadRawData,
    runAnalysis,
  } = usePipeline();

  const internalCount = roleMatches.filter((r) => r.recommendedAction === "internal").length;
  const externalCount = roleMatches.filter((r) => r.recommendedAction === "external").length;
  const hybridCount = roleMatches.filter((r) => r.recommendedAction === "hybrid").length;

  const hasRawData = forecastedRoles.length > 0;
  const hasAnalysis = executiveDecisions.length > 0 || roleMatches.length > 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Executive Dashboard</h1>
            <p className="text-muted-foreground mt-1">AI-powered talent intelligence overview — BMW Group</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadRawData}
              disabled={isLoading || isRunning}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              {isLoading ? "Loading Data..." : "Load Data"}
            </button>

            <button
              onClick={() => runAnalysis()}
              disabled={isLoading || isRunning || !hasRawData}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {isRunning ? "Running Analysis..." : "Run Analysis"}
            </button>
          </div>
        </div>

        {!hasRawData && (
          <div className="glass-card p-8 text-center">
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">No data loaded yet</h2>
            <p className="text-muted-foreground">
              Click <span className="font-medium text-foreground">Load Data</span> to fetch the latest employees and roles.
              Then run the analysis to generate AI insights.
            </p>
          </div>
        )}

        {hasRawData && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Target}
                label="Pipeline Health"
                value={hasAnalysis ? `${executiveSummary.pipelineHealth}%` : "—"}
                gradient="stat-gradient-blue"
                subtitle={hasAnalysis ? executiveSummary.pipelineHealthLabel : "Run analysis to assess"}
              />
              <StatCard
                icon={AlertTriangle}
                label="Urgent Roles"
                value={forecastedRoles.filter((r) => r.status === "critical").length}
                gradient="stat-gradient-red"
                subtitle="Based on current role definitions"
              />
              <StatCard
                icon={Users}
                label="Internal Ready"
                value={hasAnalysis ? internalCount : "—"}
                gradient="stat-gradient-green"
                subtitle={hasAnalysis ? `${externalCount} external, ${hybridCount} hybrid` : "Run analysis for readiness"}
              />
              <StatCard
                icon={TrendingUp}
                label="Forecasted Roles"
                value={forecastedRoles.length}
                gradient="stat-gradient-amber"
                subtitle="Loaded from source data"
              />
            </div>

            {!hasAnalysis && (
              <div className="glass-card p-6 border-l-4 border-primary">
                <p className="text-sm text-muted-foreground">
                  Raw employee and role data are loaded. Click <span className="font-medium text-foreground">Run Analysis</span> to generate
                  trajectory scores, matching, development plans, and executive decisions.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Shield className="w-4 h-4 text-destructive" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Top Organizational Risks</h2>
                </div>

                {(executiveSummary.topRisks ?? []).length > 0 ? (
                  <div className="space-y-3">
                    {(executiveSummary.topRisks ?? []).map((risk, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                        <span className="text-destructive font-bold text-sm mt-0.5">{i + 1}</span>
                        <p className="text-sm text-foreground/80 leading-relaxed">{risk}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Run analysis to identify organizational risks.</p>
                )}
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-4 h-4 text-warning" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Hidden Talent Highlights</h2>
                </div>

                {(executiveSummary.hiddenTalent ?? []).length > 0 ? (
                  <div className="space-y-3">
                    {(executiveSummary.hiddenTalent ?? []).map((talent, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10">
                        <Sparkles className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground/80 leading-relaxed">{talent}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Run analysis to surface hidden talent.</p>
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-5">Critical Role Decisions</h2>

              {executiveDecisions.length > 0 ? (
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
                            <StatusBadge status={d.decision.split(" ")[0]} variant="action" />
                          </td>
                          <td className="py-3 px-3 text-center text-foreground/80">{d.primaryCandidate || "—"}</td>
                          <td className="py-3 px-3 text-center">
                            <ScoreRing score={d.confidence} size="sm" />
                          </td>
                          <td className="py-3 px-3 text-center text-xs text-muted-foreground">{d.urgency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No executive decisions yet. Load data and run analysis first.</p>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}