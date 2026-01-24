'use client'

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
import Preview from '@/components/preview/Preview';

export default function Home() {
  const currentPage = useAppSelector(state => state.pages.currentPage)
  const pagesWithPreview = ['personal', 'templates', 'themes', 'export'];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden text-foreground">
        {pagesWithPreview.includes(currentPage) ? 
          (
            <div className="flex h-full" style={{ backgroundColor: '#282828' }}>
              <div className="flex-1 flex flex-col">
                <Preview />
                <ToolBar />
              </div>
              <div className="border-l h-full flex-1 max-w-lg bg-background">
                {currentPage === 'personal' && <CvData />}
                {currentPage === 'templates' && <Templates />}
                {currentPage === 'export' && <Export />}
              </div>
            </div>
          ) : (
            <div className="h-full flex-1 bg-secondary">
              {currentPage === 'applications' && <Applications />}
              {currentPage === 'settings' && <Settings />}
            </div>
          )}
      </SidebarInset>
    </SidebarProvider>
  );
}

