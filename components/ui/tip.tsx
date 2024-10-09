
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface TipProps {
    content?: any;
    message: string;
}

export const Tip: React.FC<TipProps> = ({ content, message }) => {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {content}
                </TooltipTrigger>
                <TooltipContent
                    className="bg-green-900 p-4 text-green-300 text-1xl  border-lime-200 rounded-br-lg border-spacing-9"
                >
                    <div className="border-lime-200 border-spacing-5">
                        {message}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}


