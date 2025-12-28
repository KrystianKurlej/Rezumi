'use client';

import { useState, useEffect } from "react";
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
import { Button } from "../ui/button";
import { updateSettings, getSettings, type Settings } from "@/lib/db";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { getLanguageName } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="mt-3">{children}</div>
        </div>
    )
}

export default function Settings() {
    const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
    const [selectedDefaultLanguage, setSelectedDefaultLanguage] = useState<string | undefined>(undefined);
    const [defaultLanguageChanged, setDefaultLanguageChanged] = useState<boolean>(false);
    const [settings, setSettings] = useState<Settings>({ defaultLanguage: null, availableLanguages: [] });
    const [isLanguagesSelected, setIsLanguagesSelected] = useState<boolean>(false);

    useEffect(() => {
        const loadSettings = async () => {
            const savedSettings = await getSettings();
            
            if (savedSettings) {
                setSettings(savedSettings);

                if (savedSettings.availableLanguages.length > 0) {
                    setIsLanguagesSelected(true);
                }

                if (savedSettings.defaultLanguage) {
                    setSelectedDefaultLanguage(savedSettings.defaultLanguage);
                }
            }
        };

        loadSettings();
    }, []);

    const handleAddLanguage = async () => {
        if (!selectedLanguage) return;
        
        const updatedLanguages = settings.availableLanguages.includes(selectedLanguage)
            ? settings.availableLanguages
            : [...settings.availableLanguages, selectedLanguage];
        
        const newSettings: Settings = {
            ...settings,
            availableLanguages: updatedLanguages,
        };
        
        await updateSettings(newSettings);
        setSettings(newSettings);
        setSelectedLanguage(undefined);
    }

    const handleRemoveLanguage = async (langCode: string) => {
        const updatedLanguages = settings.availableLanguages.filter(code => code !== langCode);
        
        const newSettings: Settings = {
            ...settings,
            availableLanguages: updatedLanguages,
        };
        
        await updateSettings(newSettings);
        setSettings(newSettings);
    }

    const handleSetDefaultLanguage = async () => {
        if (!selectedDefaultLanguage) return;

        const newSettings: Settings = {
            ...settings,
            defaultLanguage: selectedDefaultLanguage,
        };

        await updateSettings(newSettings);
        setSettings(newSettings);
        setSelectedDefaultLanguage(undefined);
    }

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
                <SettingsSection
                    title="Default Language"
                    description="Set your preferred default language for your CV. This will be the base language used when creating translated versions."
                >
                    <div className="flex gap-2">
                        <Select onValueChange={(value) => {setSelectedDefaultLanguage(value); setDefaultLanguageChanged(true);}} value={selectedDefaultLanguage} >
                            <SelectTrigger disabled={!isLanguagesSelected} className="w-64">
                                <SelectValue placeholder={isLanguagesSelected ? "Select a default language" : "No languages added yet"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {settings.availableLanguages.map((langCode) => {
                                        return (
                                            <SelectItem key={langCode} value={langCode}>
                                                {getLanguageName(langCode)}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button 
                            variant="outline"
                            disabled={!defaultLanguageChanged}
                            onClick={() => {handleSetDefaultLanguage();}}
                        >
                            Set as default language
                        </Button>
                    </div>
                </SettingsSection>
                <Separator className="my-6" />
                <SettingsSection
                    title="Manage Languages"
                    description="Add or remove the languages available for you to edit."
                >
                    <div className="flex gap-2">
                        <Select onValueChange={(value) => setSelectedLanguage(value)} value={selectedLanguage} >
                            <SelectTrigger className="w-64">
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
                        <Button 
                            variant="outline"
                            disabled={!selectedLanguage}
                            onClick={() => {handleAddLanguage();}}
                        >
                            Add selected language
                        </Button>
                    </div>
                    <div className="mt-4">
                        <span className="text-sm text-gray-600">
                            {settings.availableLanguages.length > 0
                                ? `Available languages:`
                                : 'No languages added yet.'
                            }
                        </span>
                        {settings.availableLanguages.length > 0 && (
                            <div className="mt-1 flex gap-2">
                                {settings.availableLanguages.map((langCode) => {
                                    return (
                                        <Dialog key={langCode}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    {getLanguageName(langCode)}
                                                    <i className="bi bi-x"></i>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Remove <em>{getLanguageName(langCode)}</em>?
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to remove this language? This will delete all data associated with this language.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">
                                                            Cancel
                                                        </Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button 
                                                            variant="destructive"
                                                            onClick={() => {handleRemoveLanguage(langCode);}}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </SettingsSection>
            </div>
        </ScrollArea>
    )
}