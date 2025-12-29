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
import { getLanguageName } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";
import { InputGroupAddon, InputGroupButton } from "../ui/input-group";

export function InputHint({ children, onClick }: { 
    children: React.ReactNode; 
    onClick: () => void;
}) {
    return (
        <InputGroupAddon align="inline-end" className="max-w-[50%]">
            <InputGroupButton
                variant="secondary"
                onClick={onClick}
                className="max-w-[100%] gap-0"
            >
                <i className="bi bi-copy text-xs"></i>&nbsp;
                <span className="truncate">{children}</span>
            </InputGroupButton>
        </InputGroupAddon>
    )
}

export default function CvData() {
    const selectedLanguage = useAppSelector((state) => state.preview.selectedLanguage);

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
                {selectedLanguage && (
                    <p className="text-xs text-gray-600 px-3 py-2">
                        <i className="bi bi-info-circle mr-1"></i>
                        You&apos;re editing {getLanguageName(selectedLanguage)} version
                    </p>
                )}
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