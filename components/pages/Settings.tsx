import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription
} from "@/components/PageHeader";
import { ScrollArea } from "@/components/ui/scroll-area"
import { menuIcons } from "@/components/AppSidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "../ui/separator";
import languages from "@/lib/data/languages.json";

export default function Settings() {
    return(
        <ScrollArea className="h-full">
            <PageHeader iconClass={menuIcons.settings}>
                <PageHeaderTitle>
                    Settings
                </PageHeaderTitle>
                <PageHeaderDescription>
                    Manage your application settings here.
                </PageHeaderDescription>
            </PageHeader>
            <div className="p-4">
                <div>
                    <h2 className="font-semibold">Default language</h2>
                    <p className="text-sm text-gray-600">
                        Set your preferred default language for your CV. This will be the base language used when creating translated versions.
                    </p>
                    <div className="mt-4">
                        <Select>
                            <SelectTrigger disabled>
                                <SelectValue placeholder="No languages added yet" />
                            </SelectTrigger>
                        </Select>
                    </div>
                </div>
                <Separator className="my-6" />
                <div>
                    <h2 className="font-semibold">Manage Languages</h2>
                    <p className="text-sm text-gray-600">
                        Add or remove the languages available for you to edit.
                    </p>
                    <div className="mt-4">
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </ScrollArea>
    )
}