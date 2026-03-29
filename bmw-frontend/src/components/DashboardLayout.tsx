import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="h-5 w-px bg-border" />
              <span className="text-xs text-muted-foreground tracking-wide uppercase">
                HR Talent Intelligence
              </span>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">

              {/* NEW NAV BUTTONS 👇 */}
              <Link
                to="/"
                className="px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:bg-secondary transition"
              >
                Dashboard
              </Link>

              <Link
                to="/manage-data"
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-white hover:opacity-90 transition"
              >
                Manage Data
              </Link>

              {/* EXISTING BADGE */}
              <Badge
                variant="outline"
                className="text-[10px] border-success/30 text-success bg-success/10"
              >
                Demo Mode
              </Badge>

              <span className="text-xs text-muted-foreground">
                Last analysis: Mar 28, 2026
              </span>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
