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
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setCurrentPage } from '@/lib/slices/pagesSlice'

export const menuIcons = {
  personal: "bi-file-earmark-person",
  templates: "bi-layout-sidebar-inset",
  languages: "bi-translate",
  themes: "bi-palette2",
  applications: "bi-envelope-arrow-up",
  export: "bi-send-arrow-down",
}

const menuItems = [
  {
    title: "CV Data",
    slug: "personal",
    icon: menuIcons.personal,
    isActive: true,
  },
  {
    title: "Templates",
    slug: "templates",
    icon: menuIcons.templates,
    isActive: false,
  },
  {
    title: "Languages",
    slug: "languages",
    icon: menuIcons.languages,
    isActive: false,
  },
  {
    title: "Themes",
    slug: "themes",
    icon: menuIcons.themes,
    isActive: false,
  },
  {
    title: "Applications",
    slug: "applications",
    icon: menuIcons.applications,
    isActive: false,
  },
  {
    title: "Send & Save Application",
    slug: "export",
    icon: menuIcons.export,
    isActive: false,
  },
]

export function AppSidebar() {
    const dispatch = useAppDispatch()
    const currentPage = useAppSelector(state => state.pages.currentPage)

    menuItems.forEach(item => {
        item.isActive = (item.slug === currentPage)
    })

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={item.isActive}
                                        onClick={() => dispatch(setCurrentPage(item.slug as string))}
                                    >
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