import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface QueryResult {
  decision: "approved" | "rejected" | "pending";
  amount?: number;
  justification: string;
  clauses: {
    clause_id: string;
    text: string;
    relevance: "high" | "medium" | "low";
  }[];
  extracted_info: {
    age?: number;
    procedure?: string;
    location?: string;
    policy_duration?: string;
    [key: string]: any;
  };
}

export const InsuranceQueryForm = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock structured response based on the query
      const mockResult: QueryResult = {
        decision: query.toLowerCase().includes("knee") ? "approved" : "rejected",
        amount: query.toLowerCase().includes("knee") ? 45000 : undefined,
        justification: query.toLowerCase().includes("knee") 
          ? "Knee surgery is covered under the orthopedic procedures clause with a 3-month waiting period waiver for emergency cases."
          : "The requested procedure is not covered under the current policy terms.",
        clauses: [
          {
            clause_id: "ORTH-001",
            text: "Orthopedic procedures including knee surgery are covered after a 3-month waiting period, unless deemed emergency.",
            relevance: "high"
          },
          {
            clause_id: "GEO-002", 
            text: "Procedures performed in Tier-1 cities like Pune are eligible for full coverage.",
            relevance: "medium"
          }
        ],
        extracted_info: {
          age: 46,
          procedure: "knee surgery",
          location: "Pune",
          policy_duration: "3 months"
        }
      };

      setResult(mockResult);
      setIsLoading(false);
      
      toast({
        title: "Query Processed",
        description: "Analysis complete",
      });
    }, 2000);
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "approved": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "rejected": return "bg-red-500/10 text-red-700 border-red-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Natural Language Query Processor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Enter your query (e.g., "46-year-old male, knee surgery in Pune, 3-month-old insurance policy")
            </label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="46M, knee surgery, Pune, 3-month policy"
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={processQuery} 
            disabled={isLoading || !query.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Query...
              </>
            ) : (
              "Process Query"
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Structured Analysis Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Decision */}
            <div className="flex items-center gap-3">
              <Badge className={`${getDecisionColor(result.decision)} flex items-center gap-1`}>
                {getDecisionIcon(result.decision)}
                {result.decision.toUpperCase()}
              </Badge>
              {result.amount && (
                <span className="text-lg font-semibold text-green-600">
                  ₹{result.amount.toLocaleString()}
                </span>
              )}
            </div>

            {/* Extracted Information */}
            <div>
              <h4 className="font-semibold mb-2">Extracted Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(result.extracted_info).map(([key, value]) => (
                  <Badge key={key} variant="outline" className="justify-center">
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Justification */}
            <div>
              <h4 className="font-semibold mb-2">Justification</h4>
              <p className="text-muted-foreground bg-muted/50 p-3 rounded-md">
                {result.justification}
              </p>
            </div>

            {/* Referenced Clauses */}
            <div>
              <h4 className="font-semibold mb-2">Referenced Clauses</h4>
              <div className="space-y-2">
                {result.clauses.map((clause) => (
                  <div key={clause.clause_id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-mono text-muted-foreground">
                        {clause.clause_id}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={
                          clause.relevance === "high" ? "border-green-500 text-green-700" :
                          clause.relevance === "medium" ? "border-yellow-500 text-yellow-700" :
                          "border-gray-500 text-gray-700"
                        }
                      >
                        {clause.relevance} relevance
                      </Badge>
                    </div>
                    <p className="text-sm">{clause.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* JSON Output */}
            <div>
              <h4 className="font-semibold mb-2">JSON Response</h4>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};