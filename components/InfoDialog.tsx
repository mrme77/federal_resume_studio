"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface InfoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: LucideIcon;
    iconColorClass?: string;
    children: ReactNode;
}

export function InfoDialog({
    isOpen,
    onClose,
    title,
    icon: Icon,
    iconColorClass = "text-primary",
    children,
}: InfoDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="max-w-2xl w-full border-2 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <CardContent className="pt-6 flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6 flex-shrink-0">
                        <div className={`p-3 bg-muted/30 rounded-full flex-shrink-0`}>
                            <Icon className={`h-8 w-8 ${iconColorClass}`} />
                        </div>
                        <div className="flex-1 pt-1">
                            <h2 className="text-2xl font-bold mb-1">
                                {title}
                            </h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="flex-shrink-0"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto pr-2 custom-scrollbar">
                        {children}
                    </div>

                    {/* Footer Action */}
                    <div className="mt-6 pt-4 border-t border-border flex justify-end flex-shrink-0">
                        <Button onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
