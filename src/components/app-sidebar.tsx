import { useState } from "react";
import { 
  MessageCircle, 
  Search, 
  FileText, 
  TrendingUp, 
  Bot,
  Menu,
  X
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { 
    title: "AI Chat", 
    url: "/", 
    icon: MessageCircle,
    description: "Ask document questions"
  },
  { 
    title: "Query Processor", 
    url: "/query", 
    icon: Search,
    description: "Process natural language"
  },
  { 
    title: "Document Manager", 
    url: "/documents", 
    icon: FileText,
    description: "Upload & manage docs"
  },
  { 
    title: "Claim Insights", 
    url: "/insights", 
    icon: TrendingUp,
    description: "View analytics"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-primary text-primary-foreground shadow-medical" 
      : "hover:bg-muted/60 transition-smooth";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r bg-card transition-smooth`}
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medical">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-foreground">DocumentAI</h1>
              <p className="text-sm text-muted-foreground">LLM Document Processor</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-medium mb-4">
            {!collapsed ? "Main Navigation" : ""}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-auto p-0">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={`${getNavCls({ isActive: isActive(item.url) })} 
                        flex items-center gap-3 p-3 rounded-lg w-full group`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 text-left">
                          <span className="font-medium block">{item.title}</span>
                          <span className="text-xs opacity-80 block">
                            {item.description}
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Document Tip Section */}
        {!collapsed && (
          <div className="mt-8 p-4 bg-gradient-medical rounded-lg shadow-soft">
            <h3 className="text-sm font-semibold text-accent-foreground mb-2">
              💡 Processing Tip
            </h3>
            <p className="text-xs text-accent-foreground opacity-90">
              Upload policy documents for more accurate claim analysis and decision making.
            </p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}