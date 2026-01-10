'use client'

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { 
  SidebarProvider, 
  SidebarInset
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAppSelector } from '@/lib/hooks'
import CvData from "@/components/pages/CvData";
import Export from "@/components/pages/Export";
import Templates from "@/components/pages/Templates";
import Applications from "@/components/pages/Applications";
import Settings from "@/components/pages/Settings";
import ToolBar from '@/components/ToolBar';

const Preview = dynamic(() => import('@/components/preview/Preview'), {
  ssr: false,
});

export default function Home() {
  const currentPage = useAppSelector(state => state.pages.currentPage)
  const personal = useAppSelector(state => state.personal)
  const experiences = useAppSelector(state => state.experiences.list)
  const educations = useAppSelector(state => state.educations.list)
  const skills = useAppSelector(state => state.skills)
  const footer = useAppSelector(state => state.footer)
  const selectedLanguage = useAppSelector(state => state.preview.selectedLanguage)

  const previewKey = useMemo(() => {
    return JSON.stringify({
      selectedLanguage,
      personal,
      experiences: experiences.length,
      educations: educations.length,
      skills: skills?.skills?.length || 0,
      footer: footer?.footerText?.length || 0
    })
  }, [selectedLanguage, personal, experiences, educations, skills, footer])

  const pagesWithPreview = ['personal', 'templates', 'themes', 'export'];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden">
        {pagesWithPreview.includes(currentPage) ? 
          (
            <div className="flex h-full" style={{ backgroundColor: '#282828' }}>
              <div className="flex-1 flex flex-col">
                <Preview key={previewKey} />
                <ToolBar />
              </div>
              <div className="border-l h-full flex-1 max-w-lg bg-white dark:bg-gray-950">
                {currentPage === 'personal' && <CvData />}
                {currentPage === 'templates' && <Templates />}
                {currentPage === 'export' && <Export />}
              </div>
            </div>
          ) : (
            <div className="border-l h-full flex-1 bg-white dark:bg-gray-950">
              {currentPage === 'applications' && <Applications />}
              {currentPage === 'settings' && <Settings />}
            </div>
          )}
      </SidebarInset>
    </SidebarProvider>
  );
}

