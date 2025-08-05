import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, FileCheck, Clock, XCircle } from "lucide-react";

const approvalData = [
  { category: "Orthopedic", approved: 85, rejected: 15 },
  { category: "Cardiac", approved: 92, rejected: 8 },
  { category: "Dental", approved: 78, rejected: 22 },
  { category: "Vision", approved: 95, rejected: 5 },
  { category: "Emergency", approved: 98, rejected: 2 },
];

const claimValueData = [
  { name: "0-10K", value: 35, amount: "₹2.5L" },
  { name: "10-50K", value: 40, amount: "₹12.8L" },
  { name: "50K-1L", value: 20, amount: "₹15.2L" },
  { name: "1L+", value: 5, amount: "₹8.9L" },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ClaimAnalytics = () => {
  const [customQuery, setCustomQuery] = useState("");
  const [insights, setInsights] = useState("");

  const generateInsights = () => {
    const mockInsights = `
Based on your query "${customQuery}", here are the key insights:

• **Coverage Analysis**: The mentioned procedure shows a 87% approval rate based on historical data
• **Policy Alignment**: Your query matches 3 policy clauses with high confidence
• **Cost Estimation**: Similar claims average ₹45,000-₹65,000 in coverage
• **Processing Time**: Expected decision within 2-3 business days
• **Risk Factors**: No red flags detected in the query parameters

**Recommendation**: Submit claim with supporting documentation for expedited processing.
    `;
    setInsights(mockInsights);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FileCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved Claims</p>
                <p className="text-2xl font-bold text-green-600">87.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Processing</p>
                <p className="text-2xl font-bold text-blue-600">2.3 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold text-yellow-600">₹39.4L</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">12.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Approval Rates by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={approvalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="approved" fill="#10b981" name="Approved %" />
                <Bar dataKey="rejected" fill="#ef4444" name="Rejected %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claim Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={claimValueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimValueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Claims']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Custom Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Claim Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Enter a claim scenario to analyze
            </label>
            <Textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="e.g., 35-year-old female, diabetes treatment, Mumbai, 2-year policy"
              className="min-h-[80px]"
            />
          </div>
          
          <Button onClick={generateInsights} disabled={!customQuery.trim()}>
            Generate Insights
          </Button>

          {insights && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Analysis Results</h4>
              <pre className="whitespace-pre-wrap text-sm">{insights}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Common Query Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { pattern: "Age + Surgery Type + Location", frequency: 87, example: "45M, knee surgery, Delhi" },
              { pattern: "Condition + Treatment + Duration", frequency: 76, example: "diabetes, insulin therapy, 6 months" },
              { pattern: "Emergency + Procedure + Hospital", frequency: 65, example: "emergency, appendectomy, Apollo Hospital" },
              { pattern: "Chronic + Medication + Coverage", frequency: 54, example: "hypertension, medication refill, outpatient" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{item.pattern}</h4>
                  <p className="text-sm text-muted-foreground">{item.example}</p>
                </div>
                <Badge variant="outline">{item.frequency}% queries</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};