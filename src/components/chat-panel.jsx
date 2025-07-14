
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, MessageSquare, ScanText, FileText as FileTextIcon } from 'lucide-react';
import { DocumentChat } from '@/components/document-chat';
import { TextAnalyzerPanel } from '@/components/text-analyzer-panel';
import { DocumentTextViewer } from '@/components/document-text-viewer';

export function ChatPanel({ document }) {
  
  return (
    <Card className="h-full flex flex-col border-0 shadow-none rounded-none">
        <Tabs defaultValue="chat" className="h-full flex flex-col">
            <CardHeader className="p-2 border-b">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chat">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Chat
                    </TabsTrigger>
                    <TabsTrigger value="analyze">
                        <ScanText className="w-4 h-4 mr-2" />
                        Analyze
                    </TabsTrigger>
                    <TabsTrigger value="text">
                        <FileTextIcon className="w-4 h-4 mr-2" />
                        Text
                    </TabsTrigger>
                </TabsList>
            </CardHeader>
            <TabsContent value="chat" className="flex-1 overflow-auto mt-0">
               <DocumentChat document={document} />
            </TabsContent>
            <TabsContent value="analyze" className="flex-1 overflow-auto mt-0">
                <TextAnalyzerPanel />
            </TabsContent>
            <TabsContent value="text" className="flex-1 overflow-auto mt-0">
                <DocumentTextViewer document={document} />
            </TabsContent>
        </Tabs>
    </Card>
  );
}
