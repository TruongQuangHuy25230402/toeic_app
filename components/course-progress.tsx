import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
    value: number;
    variant?: "default" | "success";
    size?: "default" | "sm";
}

const colorByVariant = {
    default: "text-sky-700",
    success: "text-emerald-700",
};
const sizeByVariant = {
    default: "text-sm",
    sm: "text-xs",
};

export const CourseProgress = ({
    value,
    variant = "default",
    size = "default",
}: CourseSidebarProps) => {
    return (
        <div>
            <Progress
                className={cn("h-2", colorByVariant[variant])} // Áp dụng màu sắc cho thanh Progress
                value={value}
            />

            <p
                className={cn(
                    "font-medium mt-2",
                    colorByVariant[variant],
                    sizeByVariant[size]
                )}
            >
                {Math.round(value)}% Complete
            </p>
        </div>
    );
};
