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
import Languages from "@/components/pages/Languages";
import Templates from "@/components/pages/Templates";
import Themes from "@/components/pages/Themes";
import Applications from "@/components/pages/Applications";

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

  const previewKey = useMemo(() => {
    return JSON.stringify({
      personal,
      experiences: experiences.length,
      educations: educations.length,
      skills: skills?.skillsText?.length || 0,
      footer: footer?.footerText?.length || 0
    })
  }, [personal, experiences, educations, skills, footer])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden">
        {currentPage === 'applications' ? 
          <Applications /> :
          (
            <div className="flex h-full" style={{ backgroundColor: '#282828' }}>
              <div className="flex-1">
                <Preview key={previewKey} />
              </div>
              <div className="border-l h-full flex-1 max-w-lg bg-white">
                {currentPage === 'personal' && <CvData />}
                {currentPage === 'templates' && <Templates />}
                {currentPage === 'languages' && <Languages />}
                {currentPage === 'themes' && <Themes />}
                {currentPage === 'export' && <Export />}
              </div>
            </div>
          )}
      </SidebarInset>
    </SidebarProvider>
  );
}

