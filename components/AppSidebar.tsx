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

const items = [
  {
    title: "CV Data",
    slug: "personal",
    icon: "bi-file-earmark-person",
    isActive: true,
  },
  {
    title: "Templates",
    slug: "templates",
    icon: "bi-layout-sidebar-inset",
    isActive: false,
  },
  {
    title: "Languages",
    slug: "languages",
    icon: "bi-translate",
    isActive: false,
  },
  {
    title: "Themes",
    slug: "themes",
    icon: "bi-palette2",
    isActive: false,
  },
  {
    title: "Applications",
    slug: "applications",
    icon: "bi-envelope-arrow-up",
    isActive: false,
  },
  {
    title: "Send & Save Application",
    slug: "export",
    icon: "bi-send-arrow-down",
    isActive: false,
  },
]

export function AppSidebar() {
    const dispatch = useAppDispatch()
    const currentPage = useAppSelector(state => state.pages.currentPage)

    items.forEach(item => {
        item.isActive = (item.slug === currentPage)
    })

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
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