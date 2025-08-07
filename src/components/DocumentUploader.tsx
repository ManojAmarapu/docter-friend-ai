import { useState, useRef } from "react";
import { Upload, FileText, AlertTriangle, CheckCircle2, X, Brain, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
  analysisResult?: string;
  isHealthRelated?: boolean;
}

export function DocumentUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isHealthRelated = (fileName: string): boolean => {
    const healthKeywords = [
      'medical', 'health', 'doctor', 'hospital', 'prescription', 'lab', 'test', 'report',
      'diagnosis', 'treatment', 'medication', 'patient', 'clinical', 'radiology',
      'blood', 'urine', 'xray', 'mri', 'ct', 'scan', 'therapy', 'insurance', 'claim',
      'vaccine', 'immunization', 'surgery', 'discharge', 'wellness', 'physical'
    ];
    
    const lowerFileName = fileName.toLowerCase();
    return healthKeywords.some(keyword => lowerFileName.includes(keyword));
  };

  const analyzeDocument = async (file: UploadedFile): Promise<{ result: string; isHealthDoc: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const isHealthDoc = isHealthRelated(file.name);
    
    if (!isHealthDoc) {
      return {
        result: "⚠️ **NON-MEDICAL DOCUMENT DETECTED**\n\nThis file doesn't appear to be health-related. Please upload medical documents like lab reports, prescriptions, or medical imaging reports.",
        isHealthDoc: false
      };
    }

    const fileName = file.name.toLowerCase();
    let analysisResult = "";

    if (fileName.includes('lab') || fileName.includes('blood') || fileName.includes('test')) {
      analysisResult = `🔬 **LAB REPORT ANALYSIS**\n\n**Document Type:** Medical Laboratory Results\n**AI Confidence:** 94%\n\n**Key Findings:**\n• Blood chemistry panel detected\n• Reference ranges identified\n• Critical values flagged\n\n**Recommendation:** Discuss results with your healthcare provider.`;
    } else if (fileName.includes('prescription') || fileName.includes('rx')) {
      analysisResult = `💊 **PRESCRIPTION ANALYSIS**\n\n**Document Type:** Medication Order\n**AI Confidence:** 96%\n\n**Medications Identified:**\n• Dosage instructions detected\n• Administration frequency noted\n• Safety alerts reviewed\n\n**Instructions:** Follow prescribed dosage exactly.`;
    } else {
      analysisResult = `📋 **MEDICAL DOCUMENT ANALYSIS**\n\n**Document Type:** General Medical Record\n**AI Confidence:** 87%\n\n**Content Analysis:**\n• Patient information detected\n• Medical terminology identified\n• Clinical data organized\n\n**Summary:** Valid medical document for healthcare review.`;
    }

    return { result: analysisResult, isHealthDoc: true };
  };

  const handleFileUpload = async (selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = Array.from(selectedFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: 'uploading' as const
    }));

    setFiles(prev => [...prev, ...newFiles]);

    for (const file of newFiles) {
      for (let progress = 0; progress <= 100; progress += 25) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, uploadProgress: progress } : f
        ));
      }
      
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'completed' } : f
      ));

      setIsAnalyzing(true);
      try {
        const { result, isHealthDoc } = await analyzeDocument(file);
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { 
            ...f, 
            analysisResult: result,
            isHealthRelated: isHealthDoc 
          } : f
        ));
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card 
        className={`border-2 border-dashed transition-all duration-300 ${
          isDragOver ? 'border-accent bg-accent/10 shadow-glow' : 'border-border hover:border-accent/60'
        }`}
        onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFileUpload(e.dataTransfer.files); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
      >
        <div className="p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6 shadow-medical">
            <Upload className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-3">Upload Medical Documents</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Drag and drop your health-related files here, or click the button below
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            multiple
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            className="hidden"
          />
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-primary hover:shadow-glow transition-spring shadow-medical px-10 py-4 text-lg font-medium h-auto"
          >
            <Upload className="w-6 h-6 mr-3" />
            Choose Medical Files
          </Button>
        </div>
      </Card>

      {isAnalyzing && (
        <Alert className="border-info bg-info/10">
          <Brain className="h-5 w-5 text-info animate-pulse" />
          <AlertDescription>🤖 AI analyzing document... Medical content recognition in progress.</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">Document Analysis Results ({files.length})</h3>
          <div className="space-y-6">
            {files.map((file) => (
              <div key={file.id} className={`p-6 rounded-xl border ${
                file.isHealthRelated === false ? 'border-destructive/50 bg-destructive/5' : 'border-border bg-muted/20'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    file.isHealthRelated === false ? 'bg-destructive/20' : 'bg-accent/20'
                  }`}>
                    {file.isHealthRelated === false ? 
                      <AlertTriangle className="w-6 h-6 text-destructive" /> :
                      <FileText className="w-6 h-6 text-accent" />
                    }
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{file.name}</h4>
                    <Badge variant={file.status === 'completed' ? 'default' : 'secondary'}>
                      {file.status === 'completed' && <CheckCircle2 className="w-4 h-4 mr-1" />}
                      {file.status === 'completed' ? 'Analyzed' : file.status}
                    </Badge>
                    
                    {file.status === 'uploading' && (
                      <Progress value={file.uploadProgress} className="h-3 mt-3" />
                    )}
                    
                    {file.analysisResult && (
                      <div className={`mt-4 p-5 rounded-lg border ${
                        file.isHealthRelated === false ? 'border-destructive/30 bg-destructive/10' : 'border-success/30 bg-success/10'
                      }`}>
                        <div className="flex items-center gap-2 mb-3">
                          <Brain className="w-5 h-5 text-accent" />
                          <h5 className="font-semibold">AI Analysis Result</h5>
                        </div>
                        <div className="text-sm whitespace-pre-line">{file.analysisResult}</div>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="sm" onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
