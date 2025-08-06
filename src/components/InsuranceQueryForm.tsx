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
      // Advanced query parsing and structured response
      const queryLower = query.toLowerCase();
      const extractedAge = query.match(/(\d+)[-\s]*(year|yr|y)/i)?.[1] || query.match(/(\d+)m/i)?.[1];
      const extractedLocation = query.match(/(pune|mumbai|delhi|bangalore|chennai|kolkata|hyderabad)/i)?.[1];
      const extractedProcedure = query.match(/(surgery|operation|procedure|treatment)/i)?.[0];
      const extractedPolicyDuration = query.match(/(\d+)[-\s]*(month|day|year)/i)?.[0];
      
      let decision: "approved" | "rejected" | "pending" = "pending";
      let amount: number | undefined;
      let justification = "";
      let clauses = [];
      
      // Complex decision logic based on multiple factors
      if (queryLower.includes("knee") || queryLower.includes("orthopedic")) {
        const age = extractedAge ? parseInt(extractedAge) : 0;
        const isEmergency = queryLower.includes("emergency") || queryLower.includes("urgent");
        const policyAge = queryLower.includes("3-month") || queryLower.includes("3 month");
        
        if (age > 0 && age < 65 && (isEmergency || !policyAge)) {
          decision = "approved";
          amount = 45000;
          justification = `Knee surgery approved for ${age}-year-old patient. Coverage includes orthopedic procedures with emergency waiver applied.`;
        } else if (policyAge && !isEmergency) {
          decision = "rejected";
          justification = "Claim rejected due to 3-month waiting period for non-emergency orthopedic procedures.";
        } else {
          decision = "approved";
          amount = 35000;
          justification = "Partial coverage approved based on policy terms and patient profile.";
        }
        
        clauses = [
          {
            clause_id: "ORTH-001",
            text: "Orthopedic procedures including knee surgery are covered after a 3-month waiting period, unless deemed emergency.",
            relevance: "high" as const
          },
          {
            clause_id: "AGE-002",
            text: "Patients below 65 years are eligible for full orthopedic coverage with emergency provisions.",
            relevance: "high" as const
          }
        ];
      } else if (queryLower.includes("cardiac") || queryLower.includes("heart")) {
        decision = "approved";
        amount = 75000;
        justification = "Cardiac procedures are covered under critical illness benefits with immediate effect.";
        clauses = [
          {
            clause_id: "CARD-001",
            text: "All cardiac procedures are covered immediately upon policy activation with no waiting period.",
            relevance: "high" as const
          }
        ];
      } else if (queryLower.includes("dental") || queryLower.includes("tooth")) {
        decision = "rejected";
        justification = "Dental procedures require specific dental coverage add-on not present in current policy.";
        clauses = [
          {
            clause_id: "DENT-001",
            text: "Dental procedures are excluded unless specific dental coverage is purchased as add-on.",
            relevance: "high" as const
          }
        ];
      } else {
        decision = "pending";
        justification = "Insufficient information provided. Please specify procedure type, patient age, and medical necessity.";
        clauses = [
          {
            clause_id: "GEN-001",
            text: "All claims require complete medical information for processing and approval.",
            relevance: "medium" as const
          }
        ];
      }
      
      // Add location-based clause if location detected
      if (extractedLocation) {
        clauses.push({
          clause_id: "GEO-002",
          text: `Procedures performed in Tier-1 cities like ${extractedLocation} are eligible for enhanced coverage rates.`,
          relevance: "medium" as const
        });
      }
      
      const mockResult: QueryResult = {
        decision,
        amount,
        justification,
        clauses,
        extracted_info: {
          age: extractedAge ? parseInt(extractedAge) : undefined,
          procedure: extractedProcedure || "unspecified",
          location: extractedLocation || "not specified",
          policy_duration: extractedPolicyDuration || "not specified"
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

          </CardContent>
        </Card>
      )}
    </div>
  );
};