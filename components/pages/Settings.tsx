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
import currencies from "@/lib/data/currencies.json";
import { Button } from "../ui/button";
import { updateSettings, getSettings, exportDB, importDB } from "@/lib/db";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { getLanguageName } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { 
    setSettings, 
    addLanguage, 
    removeLanguage, 
    setDefaultLanguage, 
    setDefaultCurrency 
} from "@/lib/slices/settingsSlice";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

function SettingsSection({ title, description, children, className }: { title: string; description: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={className}>
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="mt-3">{children}</div>
        </div>
    )
}

export default function Settings() {
    const dispatch = useAppDispatch();
    const settings = useAppSelector((state) => state.settings);
    
    const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
    const [selectedCurrency, setSelectedCurrency] = useState<string | undefined>(undefined);
    const [selectedDefaultLanguage, setSelectedDefaultLanguage] = useState<string | undefined>(undefined);
    const [defaultLanguageChanged, setDefaultLanguageChanged] = useState<boolean>(false);
    const [isLanguagesSelected, setIsLanguagesSelected] = useState<boolean>(false);
    const [isImportErrorOpen, setIsImportErrorOpen] = useState<boolean>(false);
    const [isImportSuccessOpen, setIsImportSuccessOpen] = useState<boolean>(false);

    useEffect(() => {
        const loadSettings = async () => {
            const savedSettings = await getSettings();
            
            if (savedSettings) {
                dispatch(setSettings(savedSettings));

                if (savedSettings.availableLanguages.length > 0) {
                    setIsLanguagesSelected(true);
                }

                if (savedSettings.defaultLanguage) {
                    setSelectedDefaultLanguage(savedSettings.defaultLanguage);
                }
            } else {
                const defaultSettings = {
                    defaultLanguage: null,
                    availableLanguages: [],
                    defaultCurrency: "USD"
                };
                await updateSettings(defaultSettings);
                dispatch(setSettings(defaultSettings));
            }
        };

        loadSettings();
    }, [dispatch]);

    const handleAddLanguage = async () => {
        if (!selectedLanguage) return;
        
        dispatch(addLanguage(selectedLanguage));
        
        const newSettings = {
            ...settings,
            availableLanguages: settings.availableLanguages.includes(selectedLanguage)
                ? settings.availableLanguages
                : [...settings.availableLanguages, selectedLanguage],
        };
        
        await updateSettings(newSettings);
        setSelectedLanguage(undefined);
        setIsLanguagesSelected(true);
    }

    const handleRemoveLanguage = async (langCode: string) => {
        dispatch(removeLanguage(langCode));
        
        const newSettings = {
            ...settings,
            availableLanguages: settings.availableLanguages.filter(code => code !== langCode),
        };
        
        await updateSettings(newSettings);
        
        if (newSettings.availableLanguages.length === 0) {
            setIsLanguagesSelected(false);
        }
    }

    const handleSetDefaultLanguage = async () => {
        if (!selectedDefaultLanguage) return;

        dispatch(setDefaultLanguage(selectedDefaultLanguage));

        const newSettings = {
            ...settings,
            defaultLanguage: selectedDefaultLanguage,
        };

        await updateSettings(newSettings);
        setSelectedDefaultLanguage(undefined);
        setDefaultLanguageChanged(false);
    }

    const handleSetDefaultCurrency = async () => {
        if (!selectedCurrency) return;

        dispatch(setDefaultCurrency(selectedCurrency));

        const newSettings = {
            ...settings,
            defaultCurrency: selectedCurrency,
        };

        await updateSettings(newSettings);
        setSelectedCurrency(undefined);
    }

    const handleExportData = async () => {
        const data = await exportDB();
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = "cv_data_export" + new Date().toISOString().slice(0,10) + ".json";
        a.click();
        URL.revokeObjectURL(url);
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
            <div className="p-4 pb-16">
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
                <Separator className="my-6" />
                <SettingsSection
                    title="Default Currency"
                    description="Set your preferred default currency for your CV. This will be used for formatting your salary values."
                >
                    <div className="flex gap-2">
                        <Select onValueChange={(value) => setSelectedCurrency(value)} value={selectedCurrency || settings.defaultCurrency}>
                            <SelectTrigger className="w-64" >
                                <SelectValue placeholder={settings.defaultCurrency ? `${currencies.find(c => c.code === settings.defaultCurrency)?.name || settings.defaultCurrency} (${currencies.find(c => c.code === settings.defaultCurrency)?.symbol || ''})` : "Select a default currency"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {currencies.map((currency) => (
                                        <SelectItem key={currency.code} value={currency.code}>
                                            {currency.name} ({currency.symbol})
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button 
                            variant="outline"
                            onClick={() => {handleSetDefaultCurrency();}}
                            disabled={!selectedCurrency}
                        >
                            Set as default currency
                        </Button>
                    </div>
                </SettingsSection>
                <Separator className="my-6" />
                <div className="grid grid-cols-3">
                    <SettingsSection
                        title="Export your data"
                        description="You can export all your CV data as a JSON file for backup or transfer purposes."
                        className="pr-6 border-r"
                    >
                        <Button
                            variant="outline"
                            onClick={handleExportData}
                            className="w-64"
                        >
                            Download your data
                            <i className="bi bi-file-earmark-arrow-down"></i>
                        </Button>
                    </SettingsSection>
                    <SettingsSection
                        title="Import data"
                        description="Import your CV data from a previously exported JSON file."
                        className="px-6 border-r"
                    >
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-64">
                                    Import data
                                    <i className="bi bi-file-earmark-arrow-up"></i>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Import CV Data</DialogTitle>
                                    <DialogDescription>
                                        <strong>This will overwrite your current data</strong>, so please make sure to back up any important information before proceeding.
                                    </DialogDescription>
                                </DialogHeader>
                                <InputGroup className="my-4">
                                    <InputGroupInput
                                        type="file"
                                        accept="application/json"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const text = await file.text();
                                            try {
                                                await importDB(text);
                                                setIsImportSuccessOpen(true);
                                            } catch (error) {
                                                console.error("Error importing data:", error);
                                                setIsImportErrorOpen(true);
                                            }
                                        }}
                                    />
                                    <InputGroupAddon>
                                        <i className="bi bi-file-earmark-arrow-up"></i>
                                    </InputGroupAddon>
                                </InputGroup>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isImportErrorOpen} onOpenChange={setIsImportErrorOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Something went wrong</DialogTitle>
                                    <DialogDescription>
                                        Import of your data failed. Please make sure you are using a valid JSON export file from this application and try again.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Close</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isImportSuccessOpen} onOpenChange={setIsImportSuccessOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Import Successful!</DialogTitle>
                                    <DialogDescription>
                                        Your data has been imported successfully. Please reload the page to see the changes.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button onClick={() => window.location.reload()}>
                                        Reload Page
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </SettingsSection>
                    <SettingsSection
                        title="Remove all data"
                        description="If you want to start fresh, you can remove all your CV data from the application."
                        className="pl-6"
                    >
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-64">
                                    Remove all data
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Remove All Data?</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to remove all your CV data? This action cannot be undone.
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
                                            onClick={async () => {
                                                await importDB('{"cvData":[],"templates":[],"settings":{}}');
                                                window.location.reload();
                                            }}
                                        >
                                            Remove all data
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </SettingsSection>
                </div>
            </div>
        </ScrollArea>
    )
}