import { InsuranceQueryForm } from "@/components/InsuranceQueryForm";

const QueryProcessor = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Query Processor</h1>
        <p className="text-muted-foreground">
          Enter insurance queries in natural language to get structured decisions based on policy documents.
        </p>
      </div>
      <InsuranceQueryForm />
    </div>
  );
};

export default QueryProcessor;