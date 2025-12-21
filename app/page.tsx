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

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex">
          <div className="bg-gray-100 h-screen px-6 overflow-y-hidden relative flex-1">
            <div className="h-full overflow-auto w-full my-6">
              <Preview />
            </div>
            <PreviewScale />
          </div>
          <div className="h-screen overflow-y-auto border-l w-96">
            <PageHeader iconClass="bi-file-earmark-text">
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
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

