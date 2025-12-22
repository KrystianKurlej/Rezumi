import PersonalForm from "@/components/cv-data/personal"
import ExperienceForm from "@/components/cv-data/experience";
import EducationForm from "@/components/cv-data/education";
import SkillsForm from "@/components/cv-data/skills";
import FooterForm from "@/components/cv-data/footer";
import { Accordion } from "@/components/ui/accordion"
import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import { menuIcons } from "@/components/AppSidebar";

export default function CvData() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass={menuIcons.personal}>
                <PageHeaderTitle>
                    CV Data
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Set up your core CV information. Add experience, skills, education, and personal details once and reuse them everywhere.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-2 pb-10">
                <Accordion type="single" collapsible defaultValue="personal-section">
                    <PersonalForm />
                    <ExperienceForm />
                    <EducationForm />
                    <SkillsForm />
                    <FooterForm />
                </Accordion>
            </div>
        </ScrollArea>
    )
}