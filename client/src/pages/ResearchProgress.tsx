import { useStats } from "@/hooks/use-stats";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ResearchProgress() {
  const { data: stats } = useStats(1);

  const data = [
    { name: 'Jan', progress: 40 },
    { name: 'Feb', progress: 30 },
    { name: 'Mar', progress: 20 },
    { name: 'Apr', progress: 27 },
    { name: 'May', progress: 18 },
    { name: 'Jun', progress: 23 },
    { name: 'Jul', progress: 34 },
  ];

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden">
      <Sidebar className="w-64 hidden md:flex" />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-display font-bold text-slate-900">Research Progress</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-muted-foreground font-medium">Completed Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-slate-900">{stats?.completedReviews || 0}</div>
                  <p className="text-sm text-emerald-600 mt-2">+1 this month</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-muted-foreground font-medium">Pending Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-slate-900">{stats?.pendingReports || 0}</div>
                  <p className="text-sm text-amber-500 mt-2">Action required</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-muted-foreground font-medium">Publications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-slate-900">{stats?.publications || 0}</div>
                  <p className="text-sm text-blue-600 mt-2">In reputed journals</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="progress" fill="#0b6a55" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
