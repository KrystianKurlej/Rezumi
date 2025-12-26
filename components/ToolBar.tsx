import { setCurrentPage } from "@/lib/slices/pagesSlice";
import { Button } from "./ui/button";
import { useAppDispatch } from '@/lib/hooks'

export default function ToolBar() {
    const dispatch = useAppDispatch()

    return (
        <div className="bg-sidebar p-1 text-sm border-t flex items-center justify-between text-gray-600">
            <div className="px-1">
                Zoom: 100%
            </div>
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
        </div>
    )
}