import { setCurrentPage } from "@/lib/slices/pagesSlice";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { ButtonGroup } from "./ui/button-group";
import { getLanguageName } from "@/lib/utils";
import { setSelectedLanguage, reloadPreview } from "@/lib/slices/previewSlice";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ToolBar() {
    const dispatch = useAppDispatch()
    const availableLanguages = useAppSelector((state) => state.settings.availableLanguages);
    const selectedLanguage = useAppSelector((state) => state.preview.selectedLanguage);
    const defaultLanguage = useAppSelector((state) => state.settings.defaultLanguage);

    const handleLanguageChange = (language: string) => {
        dispatch(setSelectedLanguage(language));
        dispatch(reloadPreview());
    };

    const sortedLanguages = [...availableLanguages].sort((a, b) => {
        if (a === defaultLanguage) return -1;
        if (b === defaultLanguage) return 1;
        return getLanguageName(a).localeCompare(getLanguageName(b));
    });

    return (
        <div className="bg-background p-1 text-sm border-t flex items-center justify-between">
            <div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => dispatch(reloadPreview())}
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Reload Preview
                    </TooltipContent>
                </Tooltip>
            </div>
            {availableLanguages.length > 0 ? (
                <div className="flex items-center gap-1">
                    <ButtonGroup>
                        {sortedLanguages.map((language) => (
                            <Button 
                                key={language}
                                onClick={() => handleLanguageChange(language)}
                                variant={selectedLanguage === language ? "outline" : "secondary"}
                                size="sm"
                            >
                                {language === defaultLanguage ? <span>Default <bdi className="uppercase">({language})</bdi></span> : getLanguageName(language)}
                            </Button>
                        ))}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="secondary"
                                    size="icon-sm"
                                    onClick={() => dispatch(setCurrentPage('settings'))}
                                >
                                    <i className="bi bi-plus"></i>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Manage Languages
                            </TooltipContent>
                        </Tooltip>
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