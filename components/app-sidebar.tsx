'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "CV Data",
    icon: "bi-file-earmark-person",
    isActive: true,
  },
  {
    title: "Templates",
    icon: "bi-layout-sidebar-inset",
    isActive: false,
  },
  {
    title: "Languages",
    icon: "bi-translate",
    isActive: false,
  },
  {
    title: "Themes",
    icon: "bi-palette2",
    isActive: false,
  },
  {
    title: "Versions",
    icon: "bi-book-half",
    isActive: false,
  },
  {
    title: "Export",
    icon: "bi-floppy2-fill",
    isActive: false,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.isActive}>
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-gray-600">
          &copy;{new Date().getFullYear()} Krystian Kurlej
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}