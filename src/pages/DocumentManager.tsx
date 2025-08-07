import { DocumentUploader } from "@/components/DocumentUploader";

const DocumentManager = () => {
  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-medical">
          <span className="text-2xl">📄</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Medical Document Analyzer</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload and analyze medical documents, lab reports, prescriptions, and health records with advanced AI processing. 
          Get instant insights and professional document analysis.
        </p>
      </div>
      <DocumentUploader />
    </div>
  );
};

export default DocumentManager;