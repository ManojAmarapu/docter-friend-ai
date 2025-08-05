import { ClaimAnalytics } from "@/components/ClaimAnalytics";

const ClaimInsights = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Claim Insights</h1>
        <p className="text-muted-foreground">
          Analyze claim patterns, approval rates, and policy coverage insights from processed documents.
        </p>
      </div>
      <ClaimAnalytics />
    </div>
  );
};

export default ClaimInsights;