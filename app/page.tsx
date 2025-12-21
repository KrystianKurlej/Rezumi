'use client'

import Preview from "@/components/cv/preview";
import PreviewScale from "@/components/PreviewScale";
import { 
  SidebarProvider, 
  SidebarInset
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area"
import CvData from "@/components/cv/pages/CvData";

export default function Home() {
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
            <CvData />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

