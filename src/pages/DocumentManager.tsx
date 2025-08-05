import { DocumentUploader } from "@/components/DocumentUploader";

const DocumentManager = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Document Manager</h1>
        <p className="text-muted-foreground">
          Upload and manage policy documents, contracts, and other files for query processing.
        </p>
      </div>
      <DocumentUploader />
    </div>
  );
};

export default DocumentManager;