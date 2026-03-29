import { DashboardLayout } from "@/components/DashboardLayout";
import { ScoreRing } from "@/components/ScoreRing";
import { StatusBadge } from "@/components/StatusBadge";
import { usePipeline } from "@/context/PipelineContext";
import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, TrendingUp, Zap, AlertCircle } from "lucide-react";
import type { EmployeeTrajectory } from "@/data/demo-data";

function EmployeeCard({ emp }: { emp: EmployeeTrajectory }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card-hover p-5 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-lg flex-shrink-0">
          {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="font-display text-lg font-semibold text-foreground">{emp.name}</h3>
            <StatusBadge status={emp.growthVelocity} variant="velocity" />
          </div>
          <p className="text-sm text-muted-foreground">{emp.currentRole}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{emp.department} · {emp.tenure} years</p>
        </div>
        <div className="text-center flex-shrink-0">
          <ScoreRing score={emp.trajectoryScore} size="lg" />
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Trajectory</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Ready: {emp.readinessHorizon}</span>
        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Growth: {emp.growthVelocity}</span>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-primary mt-3 hover:text-primary/80 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? 'Less detail' : 'View strengths & gaps'}
      </button>

      {expanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50 animate-fade-in">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5 text-success" />
              <h4 className="text-xs font-semibold text-success uppercase tracking-wider">Strengths</h4>
            </div>
            <ul className="space-y-1.5">
              {emp.strengths.map((s, i) => (
                <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-success mt-1.5 w-1 h-1 rounded-full bg-success flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-3.5 h-3.5 text-warning" />
              <h4 className="text-xs font-semibold text-warning uppercase tracking-wider">Critical Gaps</h4>
            </div>
            <ul className="space-y-1.5">
              {emp.criticalGaps.map((g, i) => (
                <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-warning mt-1.5 w-1 h-1 rounded-full bg-warning flex-shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmployeeTrajectories() {
  const { employeeTrajectories } = usePipeline();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Employee Trajectories</h1>
          <p className="text-muted-foreground mt-1">Growth analysis — AI Employee Trajectory Agent</p>
        </div>
        <div className="space-y-4">
          {employeeTrajectories.map((emp) => (
            <EmployeeCard key={emp.id} emp={emp} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
