import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, File, Trash2, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "uploading" | "processing" | "ready" | "error";
  extractedClauses?: number;
  lastModified: Date;
}

export const DocumentUploader = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach((file) => {
      const newDoc: Document = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        status: "uploading",
        lastModified: new Date(file.lastModified)
      };

      setDocuments(prev => [...prev, newDoc]);

      // Simulate upload and processing
      simulateUpload(newDoc.id);
    });

    // Reset input
    event.target.value = '';
  };

  const simulateUpload = (docId: string) => {
    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(uploadInterval);
        
        // Update to processing
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === docId ? { ...doc, status: "processing" } : doc
          )
        );

        // Simulate advanced processing based on document type
        setTimeout(() => {
          const doc = documents.find(d => d.id === docId);
          const fileName = doc?.name.toLowerCase() || '';
          
          let clauseCount = 10;
          if (fileName.includes('policy') || fileName.includes('insurance')) {
            clauseCount = Math.floor(Math.random() * 30) + 20; // 20-50 clauses
          } else if (fileName.includes('contract')) {
            clauseCount = Math.floor(Math.random() * 20) + 15; // 15-35 clauses
          } else if (fileName.includes('claim')) {
            clauseCount = Math.floor(Math.random() * 15) + 5; // 5-20 clauses
          }
          
          setDocuments(prev => 
            prev.map(doc => 
              doc.id === docId 
                ? { 
                    ...doc, 
                    status: "ready",
                    extractedClauses: clauseCount
                  } 
                : doc
            )
          );
          
          toast({
            title: "Document Processed",
            description: `Document analyzed successfully with ${clauseCount} clauses extracted`,
          });
        }, 2500);
      }
    }, 200);
  };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast({
      title: "Document Removed",
      description: "Document has been deleted from the system",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "processing": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "uploading": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "error": return "bg-red-500/10 text-red-700 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return <CheckCircle className="w-4 h-4" />;
      case "processing": 
      case "uploading": return <Clock className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Upload policy documents, contracts, or emails (PDF, DOC, DOCX, TXT)
            </p>
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="max-w-xs mx-auto"
            />
          </div>
        </CardContent>
      </Card>

      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <File className="w-8 h-8 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{doc.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>{doc.lastModified.toLocaleDateString()}</span>
                        {doc.extractedClauses && (
                          <>
                            <span>•</span>
                            <span>{doc.extractedClauses} clauses extracted</span>
                          </>
                        )}
                      </div>
                      {doc.status === "uploading" && (
                        <Progress value={uploadProgress} className="mt-2 w-32" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(doc.status)} flex items-center gap-1`}>
                      {getStatusIcon(doc.status)}
                      {doc.status}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Supported Document Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-1">Policy Documents</h4>
              <p className="text-muted-foreground">Insurance policies, terms & conditions</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-1">Contracts</h4>
              <p className="text-muted-foreground">Legal agreements, service contracts</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-1">Emails</h4>
              <p className="text-muted-foreground">Correspondence, communications</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};