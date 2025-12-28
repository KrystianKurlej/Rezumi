'use client';

import { useState, useEffect } from "react";
import { setCurrentPage } from "@/lib/slices/pagesSlice";
import { Button } from "./ui/button";
import { useAppDispatch } from '@/lib/hooks'
import { getSettings } from "@/lib/db";
import { ButtonGroup } from "./ui/button-group";
import { getLanguageName } from "@/lib/utils";

export default function ToolBar() {
    const dispatch = useAppDispatch()
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            const savedSettings = await getSettings();
            
            if (savedSettings && savedSettings.availableLanguages.length > 0 && savedSettings.defaultLanguage) {
                setSelectedLanguage(savedSettings.defaultLanguage);
                setAvailableLanguages(savedSettings.availableLanguages);
            }
        };

        loadSettings();
    }, []);

    return (
        <div className="bg-sidebar p-1 text-sm border-t flex items-center justify-between text-gray-600">
            <div className="px-1">
                Zoom: 100%
            </div>
            {availableLanguages.length > 0 ? (
                <div className="flex items-center gap-1">
                    <ButtonGroup>
                        {availableLanguages.map((language) => (
                            <Button 
                                key={language}
                                onClick={() => setSelectedLanguage(language)}
                                variant={selectedLanguage === language ? "default" : "outline"}
                                size="sm"
                            >
                                {getLanguageName(language)}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>
            ) : (
                <div>
                    No languages added yet
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => dispatch(setCurrentPage('settings'))}
                    >
                        Manage Languages
                    </Button>
                </div>
            )}
        </div>
    )
}