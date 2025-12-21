'use client'

import Preview from "@/components/Preview";
import PreviewScale from "@/components/PreviewScale";
import { 
  SidebarProvider, 
  SidebarInset
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppSelector } from '@/lib/hooks'
import CvData from "@/components/pages/CvData";
import Export from "@/components/pages/Export";
import Languages from "@/components/pages/Languages";
import Templates from "@/components/pages/Templates";
import Themes from "@/components/pages/Themes";
import Applications from "@/components/pages/Applications";

export default function Home() {
  const currentPage = useAppSelector(state => state.pages.currentPage)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden">
        <div className="flex h-full">
          <div className="bg-gray-100 relative flex-1">
            <ScrollArea className="h-full">
              <div className="w-full p-6">
                <Preview />
              </div>
            </ScrollArea>
            <PreviewScale />
          </div>
          <div className="border-l h-full flex-1">
            {currentPage === 'personal' && <CvData />}
            {currentPage === 'templates' && <Templates />}
            {currentPage === 'languages' && <Languages />}
            {currentPage === 'themes' && <Themes />}
            {currentPage === 'applications' && <Applications />}
            {currentPage === 'export' && <Export />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

