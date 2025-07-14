
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookText, Lightbulb, Languages, Sparkles } from 'lucide-react';
import { analyzeText } from '@/ai/flows/text-analyzer-flow';
import { useToast } from '@/hooks/use-toast';

const analysisPrompts = [
    { text: "Summarize", icon: BookText },
    { text: "Explain Key Concepts", icon: Lightbulb },
    { text: "Translate to English", icon: Languages },
];

export function TextAnalyzerPanel() {
    const { toast } = useToast();
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');

    const handleAnalysis = async (task) => {
        if (!inputText.trim()) {
            toast({
                variant: "destructive",
                title: "Input Required",
                description: "Please paste some text to analyze.",
            });
            return;
        }

        setIsLoading(true);
        setAnalysisResult('');

        try {
            const result = await analyzeText({ text: inputText, task });
            setAnalysisResult(result);
        } catch (error) {
            console.error("Failed to analyze text:", error);
            const errorMessage = error.message.includes("overloaded")
                ? "The AI service is currently overloaded. Please try again."
                : "An error occurred during analysis.";
            toast({ variant: "destructive", title: "Analysis Failed", description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-2 md:p-4 gap-4">
            <Textarea
                placeholder="Paste text here to analyze, summarize, or translate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-grow text-sm min-h-[150px]"
                disabled={isLoading}
            />
            <div className="flex flex-wrap gap-2">
                {analysisPrompts.map((prompt) => (
                    <Button
                        key={prompt.text}
                        variant="outline"
                        onClick={() => handleAnalysis(prompt.text)}
                        disabled={isLoading || !inputText.trim()}
                        size="sm"
                    >
                        <prompt.icon className="w-4 h-4 mr-2" />
                        {prompt.text}
                    </Button>
                ))}
            </div>
            <div className="flex-1 min-h-0">
                <Card className="h-full">
                    <CardHeader className="p-3 border-b">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Analysis Result
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 h-[calc(100%-3.5rem)]">
                        <ScrollArea className="h-full">
                            <div className="p-4 text-sm whitespace-pre-wrap">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center text-muted-foreground">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            <p>Analyzing...</p>
                                        </div>
                                    </div>
                                ) : analysisResult ? (
                                    analysisResult
                                ) : (
                                    <p className="text-muted-foreground text-center pt-8">
                                        The analysis result will appear here.
                                    </p>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
