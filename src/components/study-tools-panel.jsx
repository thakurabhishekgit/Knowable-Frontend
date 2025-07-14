
"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, FileQuestion, GraduationCap } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function StudyToolsPanel({ document }) {
    const router = useRouter();
    const { toast } = useToast();

    const handleGenerate = (toolType) => {
        if (!document?.textExtracted) {
            toast({
                variant: "destructive",
                title: "Cannot Generate",
                description: "The text for this document has not been processed yet. Please wait a moment and try again."
            });
            return;
        }

        // Store the text in sessionStorage to pass it to the new page
        // It's a simple way to pass large data without using the URL
        try {
            sessionStorage.setItem('documentTextForTool', document.textExtracted);
            router.push(`/results?type=${toolType}`);
        } catch (error) {
            console.error("Failed to use sessionStorage or navigate:", error);
            toast({
                variant: "destructive",
                title: "Navigation Error",
                description: "Could not navigate to the results page. Your browser may not support session storage or it is full."
            });
        }
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6 gap-6">
            <div className="text-center">
                <GraduationCap className="w-10 h-10 mx-auto text-primary mb-2" />
                <h3 className="text-lg font-semibold">AI Study Tools</h3>
                <p className="text-sm text-muted-foreground">
                    Generate helpful materials from your document with one click.
                </p>
            </div>
            
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Layers className="w-6 h-6 text-primary" />
                            <CardTitle className="text-base">Generate Flashcards</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Automatically create flashcards for key terms and concepts in the document.
                        </CardDescription>
                        <Button className="mt-4 w-full" onClick={() => handleGenerate('flashcards')}>
                            Create Flashcards
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                           <FileQuestion className="w-6 h-6 text-primary" />
                            <CardTitle className="text-base">Generate Quiz</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Create a multiple-choice quiz to test your understanding of the material.
                        </CardDescription>
                        <Button className="mt-4 w-full" onClick={() => handleGenerate('quiz')}>
                            Create a Quiz
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
