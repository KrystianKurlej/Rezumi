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

export const menuIcons = {
  personal: "bi-file-earmark-person",
  templates: "bi-layers-half",
  applications: "bi-envelope-arrow-up",
  export: "bi-send-arrow-down",
  settings: "bi-gear",
}

const menuItems = [
   {
    title: "Base Information",
    description: "Set up your core CV information. Add experience, skills, education, and personal details once and reuse them everywhere.",
    slug: "personal",
    icon: menuIcons.personal,
    isActive: true,
    isDisabled: false,
  },
  {
    title: "Templates",
    description: "Create different CV versions by choosing the layout and deciding what to show, hide, or rewrite for specific roles.",
    slug: "templates",
    icon: menuIcons.templates,
    isActive: false,
    isDisabled: false,
  },
  {
    title: "Send & Save",
    description: "Create a PDF version of your CV and save it together with job details, so you always know what you sent and where.",
    slug: "export",
    icon: menuIcons.export,
    isActive: false,
    isDisabled: false,
  },
  {
    title: "Applications",
    description: "Save snapshots of your CV for specific job applications and keep track of what you’ve sent.",
    slug: "applications",
    icon: menuIcons.applications,
    isActive: false,
    isDisabled: false,
  },
]

export function getMenuItems({slug}: {slug: string;}) {
    if (!slug) {
        return;
    }

    const item = menuItems.find(item => item.slug === slug);
    return item;
}

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