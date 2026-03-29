import { Circle, BarChart3, Users, GitCompare, GraduationCap, FileCheck, Zap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Executive Dashboard", url: "/", icon: BarChart3 },
  { title: "Forecasted Roles", url: "/roles", icon: Circle },
  { title: "Employee Trajectories", url: "/trajectories", icon: Users },
  { title: "Role Matching", url: "/matching", icon: GitCompare },
  { title: "Development Plans", url: "/development", icon: GraduationCap },
  { title: "Executive Decisions", url: "/decisions", icon: FileCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-6">
        <div className={`px-4 mb-8 ${collapsed ? 'px-2' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg stat-gradient-blue flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-display text-sm font-bold text-foreground tracking-wide">BMW TalentAI</h1>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Intelligence Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest uppercase text-muted-foreground">
            {!collapsed && "Analytics"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-secondary/50 transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium border-r-2 border-primary"
                    >
                      <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
