import { TrendingUp, Activity, Heart, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SimpleBarChart, SimpleLineChart, SimplePieChart } from "./SimpleCharts";

export function HealthInsights() {
  // Sample data for charts
  const commonConditionsData = [
    { name: 'Common Cold', cases: 45, color: '#3B82F6' },
    { name: 'Headache', cases: 32, color: '#10B981' },
    { name: 'Fever', cases: 28, color: '#F59E0B' },
    { name: 'Stomach Issues', cases: 18, color: '#EF4444' },
    { name: 'Minor Injuries', cases: 12, color: '#8B5CF6' }
  ];

  const monthlyTrendsData = [
    { month: 'Jan', consultations: 120 },
    { month: 'Feb', consultations: 98 },
    { month: 'Mar', consultations: 156 },
    { month: 'Apr', consultations: 134 },
    { month: 'May', consultations: 145 },
    { month: 'Jun', consultations: 167 }
  ];

  const ageGroupData = [
    { group: '0-18', percentage: 25 },
    { group: '19-35', percentage: 35 },
    { group: '36-50', percentage: 25 },
    { group: '51+', percentage: 15 }
  ];

  const healthMetrics = [
    {
      title: "Total Consultations",
      value: "1,248",
      change: "+12.5%",
      trend: "up",
      icon: Activity,
      color: "text-primary"
    },
    {
      title: "Resolved Cases",
      value: "1,156",
      change: "+8.2%",
      trend: "up",
      icon: Heart,
      color: "text-success"
    },
    {
      title: "Avg Response Time",
      value: "2.3 min",
      change: "-15.3%",
      trend: "down",
      icon: Brain,
      color: "text-info"
    },
    {
      title: "User Satisfaction",
      value: "94.7%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-accent"
    }
  ];

  

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5 text-primary" />
            Health Insights Dashboard
          </CardTitle>
          <CardDescription>
            Analytics and trends from HealthAI consultations
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric, index) => (
          <Card key={index} className="shadow-soft border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    <Badge 
                      variant={metric.trend === 'up' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        metric.trend === 'up' 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-info/10 text-info border-info/20'
                      }`}
                    >
                      {metric.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-primary shadow-medical`}>
                  <metric.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Conditions */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Most Common Conditions</CardTitle>
            <CardDescription>Distribution of health consultations by condition type</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={commonConditionsData} />
          </CardContent>
        </Card>

        {/* Age Group Distribution */}
        <Card className="shadow-soft border-border">
          <CardHeader>
            <CardTitle className="text-foreground">User Age Distribution</CardTitle>
            <CardDescription>Breakdown of users by age groups</CardDescription>
          </CardHeader>
          <CardContent>
            <SimplePieChart data={ageGroupData} />
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card className="shadow-soft border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Monthly Consultation Trends</CardTitle>
          <CardDescription>Number of health consultations over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleLineChart data={monthlyTrendsData} />
        </CardContent>
      </Card>

      {/* Health Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-soft border-border bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-2">💧 Hydration Reminder</h3>
            <p className="text-sm text-muted-foreground">
              Drink at least 8 glasses of water daily to maintain optimal health and energy levels.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-2">🚶 Daily Exercise</h3>
            <p className="text-sm text-muted-foreground">
              30 minutes of moderate exercise daily can significantly improve your overall health.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-2">😴 Quality Sleep</h3>
            <p className="text-sm text-muted-foreground">
              Aim for 7-9 hours of quality sleep each night for better immune function and mental health.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}