import { setCurrentPage } from "@/lib/slices/pagesSlice";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { ButtonGroup } from "./ui/button-group";
import { getLanguageName } from "@/lib/utils";
import { setSelectedLanguage } from "@/lib/slices/previewSlice";

export default function ToolBar() {
    const dispatch = useAppDispatch()
    const availableLanguages = useAppSelector((state) => state.settings.availableLanguages);
    const selectedLanguage = useAppSelector((state) => state.preview.selectedLanguage);
    const defaultLanguage = useAppSelector((state) => state.settings.defaultLanguage);

    const handleLanguageChange = (language: string) => {
        dispatch(setSelectedLanguage(language));
    };

    return (
        <div className="bg-sidebar p-1 text-sm border-t flex items-center justify-between text-gray-600">
            <div className="px-1">
            </div>
            {availableLanguages.length > 0 ? (
                <div className="flex items-center gap-1">
                    <ButtonGroup>
                        {availableLanguages.map((language) => (
                            <Button 
                                key={language}
                                onClick={() => handleLanguageChange(language)}
                                variant={selectedLanguage === language ? "default" : "outline"}
                                size="sm"
                            >
                                {language === defaultLanguage ? <span>Default <bdi className="uppercase">({language})</bdi></span> : getLanguageName(language)}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => dispatch(setCurrentPage('settings'))}
                        >
                            <i className="bi bi-plus"></i>
                        </Button>
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