'use client'

import PersonalForm from "@/components/cv/form/personal"
import ExperienceForm from "@/components/cv/form/experience";
import EducationForm from "@/components/cv/form/education";
import SkillsForm from "@/components/cv/form/skills";
import FooterForm from "@/components/cv/form/footer";
import Preview from "@/components/cv/preview";
import PreviewScale from "@/components/PreviewScale";
import { Accordion } from "@/components/ui/accordion"
import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { 
  SidebarProvider, 
  SidebarInset
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area"

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
            <ScrollArea className="h-full">
              <PageHeader iconClass="bi-file-earmark-person">
                <PageHeaderTitle>
                  CV Data
                </PageHeaderTitle>
                <PageHeaderDescription>
                  Set up your core CV information. Add experience, skills, education, and personal details once and reuse them everywhere.
                </PageHeaderDescription>
              </PageHeader>
              <div className="p-2">
                <Accordion type="multiple" defaultValue="personal-section">
                  <PersonalForm />
                  <ExperienceForm />
                  <EducationForm />
                  <SkillsForm />
                  <FooterForm />
                </Accordion>
              </div>
            </ScrollArea>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

