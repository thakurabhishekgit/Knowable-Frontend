
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Loader2, MessageSquare } from 'lucide-react';
import { answerQuestion } from '@/ai/flows/chat-flow';
import { api } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

export function ChatPanel({ document }) {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const scrollAreaRef = useRef(null);

  // Effect to scroll to the bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current?.children[0]) {
      const scrollableView = scrollAreaRef.current.children[0];
       setTimeout(() => {
        scrollableView.scrollTop = scrollableView.scrollHeight;
      }, 0);
    }
  }, [messages]);

  // Effect to fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!document?.id) return;
      setIsHistoryLoading(true);
      try {
        const history = await api.get(`/api/questions/getDocumentQuestions/${document.id}`);
        if (history && Array.isArray(history)) {
          const formattedHistory = history.flatMap(item => [
            { text: item.question, from: 'user' },
            { text: item.answer, from: 'bot' }
          ]);
          setMessages(formattedHistory);
        }
      } catch (error) {
        // It's okay if this fails (e.g., 404), it just means no history yet.
        console.log("Could not fetch chat history, starting fresh.", error.message);
        setMessages([]); // Start with an empty chat on error
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchChatHistory();
  }, [document?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage = { text: input, from: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = input;
    setInput('');
    setIsLoading(true);

    // Add a temporary "thinking" message
    setMessages(prev => [...prev, { text: 'Thinking...', from: 'bot', isLoading: true }]);

    try {
        const aiAnswer = await answerQuestion({
            documentText: document.textExtracted,
            question: currentQuestion,
        });

        const botMessage = { text: aiAnswer, from: 'bot' };
        
        // Replace the "thinking" message with the actual answer
        setMessages(prev => prev.map(m => m.isLoading ? botMessage : m));
        
        // Save the question and answer to the backend
        await api.post(`/api/questions/document/${document.id}`, {
            question: currentQuestion,
            answer: aiAnswer
        });

    } catch (error) {
        console.error("Failed to get answer from AI or save question:", error);
        const errorMessage = { text: "Sorry, I couldn't process that question. The AI service may be temporarily unavailable. Please try again later.", from: 'bot' };
        setMessages(prev => prev.map(m => m.isLoading ? errorMessage : m));
        toast({
            variant: "destructive",
            title: "Chat Error",
            description: "There was a problem communicating with the AI.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          Chat with AI
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
          {isHistoryLoading ? (
             <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p>Loading chat history...</p>
                </div>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
                {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex items-start gap-3 ${
                    message.from === 'user' ? 'justify-end' : ''
                    }`}
                >
                    {message.from === 'bot' && (
                    <div className="p-2 rounded-full bg-muted">
                        <Bot className="w-5 h-5" />
                    </div>
                    )}
                    <div
                    className={`rounded-lg p-3 max-w-[90%] text-sm break-words ${
                        message.from === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                    >
                        {message.isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <p>{message.text}</p>
                            </div>
                        ) : (
                            <p>{message.text}</p>
                        )}
                    </div>
                    {message.from === 'user' && (
                    <div className="p-2 rounded-full bg-muted">
                        <User className="w-5 h-5" />
                    </div>
                    )}
                </div>
                ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2" />
                    <p>No messages yet.</p>
                    <p className="text-xs">Ask a question to start the conversation.</p>
                </div>
            </div>
          )}
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the document..."
            autoComplete="off"
            disabled={isLoading || isHistoryLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || isHistoryLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
