'use client'

import Preview from "@/components/cv/preview";
import PreviewScale from "@/components/PreviewScale";
import { 
  SidebarProvider, 
  SidebarInset
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppSelector } from '@/lib/hooks'
import CvData from "@/components/cv/pages/CvData";
import Export from "@/components/cv/pages/Export";
import Languages from "@/components/cv/pages/Languages";
import Templates from "@/components/cv/pages/Templates";
import Themes from "@/components/cv/pages/Themes";
import Versions from "@/components/cv/pages/Versions";

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
            {currentPage === 'versions' && <Versions />}
            {currentPage === 'export' && <Export />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

