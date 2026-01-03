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
  SidebarHeader,
} from "@/components/ui/sidebar"
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setCurrentPage } from '@/lib/slices/pagesSlice'
import Logo from './Logo'
import Footer from './Footer'
import Link from "next/link"

export const menuIcons = {
  personal: "bi-file-earmark-person",
  templates: "bi-layers-half",
  applications: "bi-envelope-arrow-up",
  export: "bi-send-arrow-down",
  settings: "bi-gear",
}

const menuItems = [
  {
    title: "CV Data",
    slug: "personal",
    icon: menuIcons.personal,
    isActive: true,
    isDisabled: false,
  },
  {
    title: "Templates",
    slug: "templates",
    icon: menuIcons.templates,
    isActive: false,
    isDisabled: false,
  },
  {
    title: "Send & Save Application",
    slug: "export",
    icon: menuIcons.export,
    isActive: false,
    isDisabled: false,
  },
  {
    title: "Applications",
    slug: "applications",
    icon: menuIcons.applications,
    isActive: false,
    isDisabled: false,
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
            <SidebarHeader className="pt-4">
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={item.isActive}
                                        onClick={() => dispatch(setCurrentPage(item.slug as string))}
                                        disabled={item.isDisabled}
                                    >
                                        <i className={`bi ${item.icon}`}></i>
                                        {item.title}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuButton asChild>
                                <Link href="/how-it-works">
                                    <i className={`bi bi-book`}></i>
                                    <span>How it works</span>
                                </Link>
                            </SidebarMenuButton>
                            <SidebarMenuButton
                                isActive={currentPage === 'settings'}
                                onClick={() => dispatch(setCurrentPage('settings'))}
                            >
                                <i className={`bi ${menuIcons.settings}`}></i>
                                <span>Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Footer />
            </SidebarFooter>
        </Sidebar>
    )
}