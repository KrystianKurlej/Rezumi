'use client';

import { useState } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import languages from "@/lib/data/languages.json";
import currencies from "@/lib/data/currencies.json";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import Footer from '@/components/Footer'
import { updateSettings } from "@/lib/db";
import { useAppDispatch } from "@/lib/hooks";
import { setSettings } from "@/lib/slices/settingsSlice";

interface IntroProps {
    onComplete: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
    const dispatch = useAppDispatch();
    const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
    const [selectedCurrency, setSelectedCurrency] = useState<string | undefined>(undefined);

    const handleSubmit = async () => {
        if (!selectedLanguage || !selectedCurrency) {
            return;
        }

        const newSettings = {
            defaultLanguage: selectedLanguage,
            availableLanguages: [selectedLanguage],
            defaultCurrency: selectedCurrency,
            ghostedDelay: null,
            theme: 'system' as const
        };

        await updateSettings(newSettings);
        dispatch(setSettings(newSettings));
        onComplete();
    };

    const isFormValid = selectedLanguage && selectedCurrency;

    return (
        <main className="min-h-screen flex flex-col justify-center items-center p-12 pb-0">
            <div className="max-w-md flex-1 flex-col flex justify-center">
                <h1 className="text-4xl font-medium text-center">
                    Set up your CV workspace
                </h1>
                <FieldSet className="mt-8 space-y-3">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="defaultLanguage">
                                What language do you usually apply in?
                            </FieldLabel>
                            <Select 
                                value={selectedLanguage} 
                                onValueChange={setSelectedLanguage}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a default language" />
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
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="defaultCurrency">
                                What currency do you usually use?
                            </FieldLabel>
                            <Select 
                                value={selectedCurrency} 
                                onValueChange={setSelectedCurrency}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a default currency" />
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
                        </Field>
                    </FieldGroup>
                    <FieldGroup>
                        <Field>
                            <Button
                                className="w-full"
                                onClick={handleSubmit}
                                disabled={!isFormValid}
                            >
                                Let&apos;s Get Started
                                <i className="bi bi-arrow-right"></i>
                            </Button>
                        </Field>
                    </FieldGroup>
                </FieldSet>
            </div>
            <Footer variant="page"/>
        </main>
    )
}