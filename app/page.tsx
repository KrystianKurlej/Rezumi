'use client'

import dynamic from 'next/dynamic';
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
  loading: () => <div className="w-full h-full flex items-center justify-center">Loading...</div>
});

export default function Home() {
  const currentPage = useAppSelector(state => state.pages.currentPage)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden">
        {currentPage === 'applications' ? 
          <Applications /> :
          (
            <div className="flex h-full">
              <div className="flex-1">
                <Preview />
              </div>
              <div className="border-l h-full flex-1 max-w-lg">
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

