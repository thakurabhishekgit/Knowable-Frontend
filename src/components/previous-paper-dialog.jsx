
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { analyzePaper } from "@/ai/flows/paper-analysis-flow";

export function PreviousPaperDialog({ children, document }) {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !subjectName || !document?.id) {
        toast({ variant: "destructive", title: "Missing fields", description: "Please provide a subject name and select a file."});
        return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('subjectName', subjectName);
    formData.append('file', file);

    try {
        // Step 1: Upload the previous paper and get its text
        toast({ title: "Step 1/2: Uploading Paper", description: "Please wait while we upload your document..." });
        const uploadedPaper = await api.post(`/api/previous-papers/upload/${document.id}`, formData);

        if (!uploadedPaper.textExtracted || !document.textExtracted) {
            throw new Error("Text could not be extracted from one or both documents.");
        }

        // Step 2: Run AI analysis
        toast({ title: "Step 2/2: Analyzing", description: "The AI is now analyzing the documents. This may take a moment." });
        const analysisResult = await analyzePaper({
            documentText: document.textExtracted,
            paperText: uploadedPaper.textExtracted,
        });

        // Step 3: Store result and navigate
        sessionStorage.setItem('paperAnalysisResult', JSON.stringify(analysisResult));
        sessionStorage.setItem('documentTitle', document.title);

        toast({ title: "Analysis Complete!", description: "Redirecting to your analysis report." });
        router.push(`/analysis-report/${document.id}`);
        
        // Reset form and close dialog
        setSubjectName('');
        setFile(null);
        document.getElementById('paper-file-input').value = '';
        setOpen(false);
    } catch (error) {
        console.error("Failed to process previous paper:", error);
        toast({ variant: "destructive", title: "Analysis Failed", description: error.message || "An unknown error occurred."});
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Analyze Previous Year's Paper</DialogTitle>
            <DialogDescription>
                Upload a past question paper (.pdf, .docx). The AI will compare it with your current document.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subjectName" className="text-right">
                    Subject
                    </Label>
                    <Input 
                        id="subjectName" 
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        placeholder="e.g. Python Programming" 
                        className="col-span-3" 
                        required
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paper-file-input" className="text-right">
                    Paper File
                    </Label>
                    <Input 
                        id="paper-file-input" 
                        type="file"
                        onChange={handleFileChange}
                        className="col-span-3" 
                        accept=".pdf,.docx"
                        required
                    />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Upload & Analyze"}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
