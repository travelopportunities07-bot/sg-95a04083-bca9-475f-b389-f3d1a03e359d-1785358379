import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, Calendar, Award, Filter, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/router";

interface CompletedTask {
  id: string;
  title: string;
  description: string;
  category: string;
  xp_reward: number;
  completed_at: string;
  priority: string;
  due_date?: string;
}

export default function ActivityTimeline() {
  const { user, userProfile } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [tasks, setTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (userProfile?.role !== "worker") {
      router.push("/");
      return;
    }

    fetchCompletedTasks();
  }, [user, userProfile]);

  const fetchCompletedTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false });

      if (error) throw error;

      setTasks(data || []);
      
      // Calculate total XP
      const xp = (data || []).reduce((sum, task) => sum + (task.xp_reward || 0), 0);
      setTotalXP(xp);
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Filter by period
    if (selectedPeriod !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (selectedPeriod) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(task => 
        new Date(task.completed_at) >= filterDate
      );
    }

    return filtered;
  };

  const getTasksByMonth = () => {
    const tasksByMonth: { [key: string]: CompletedTask[] } = {};
    
    getFilteredTasks().forEach(task => {
      const date = new Date(task.completed_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!tasksByMonth[monthKey]) {
        tasksByMonth[monthKey] = [];
      }
      tasksByMonth[monthKey].push(task);
    });

    return tasksByMonth;
  };

  const formatMonthYear = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Gesundheit": "bg-red-100 text-red-800 border-red-200",
      "Integration": "bg-blue-100 text-blue-800 border-blue-200",
      "Anmeldung": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Finanzen": "bg-green-100 text-green-800 border-green-200",
      "Steuern": "bg-purple-100 text-purple-800 border-purple-200",
      "Arbeit": "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const categories = ["Gesundheit", "Integration", "Anmeldung", "Finanzen", "Steuern", "Arbeit"];
  const tasksByMonth = getTasksByMonth();
  const filteredTasks = getFilteredTasks();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F7A63]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F5F7F6]">
        <div className="container py-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1E293B]">Aktivitätsverlauf</h1>
            <p className="text-[#64748B]">Ihre abgeschlossenen Aufgaben und Erfolge</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-[#1F7A63] to-[#2E8B6C] text-white">
              <CardHeader className="pb-3">
                <CardDescription className="text-white/80 text-sm">Gesamt XP</CardDescription>
                <CardTitle className="text-3xl font-bold flex items-center gap-2">
                  <Award className="w-8 h-8" />
                  {totalXP}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-[#64748B] text-sm">Abgeschlossene Aufgaben</CardDescription>
                <CardTitle className="text-3xl font-bold text-[#1E293B] flex items-center gap-2">
                  <CheckCircle className="w-8 h-8 text-[#22C55E]" />
                  {filteredTasks.length}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-[#64748B] text-sm">Durchschnitt pro Aufgabe</CardDescription>
                <CardTitle className="text-3xl font-bold text-[#1E293B] flex items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-[#3B82F6]" />
                  {filteredTasks.length > 0 ? Math.round(totalXP / filteredTasks.length) : 0} XP
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5" />
                Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1E293B]">Kategorie</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alle Kategorien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Kategorien</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1E293B]">Zeitraum</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alle Zeiträume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Zeiträume</SelectItem>
                      <SelectItem value="week">Letzte Woche</SelectItem>
                      <SelectItem value="month">Letzter Monat</SelectItem>
                      <SelectItem value="3months">Letzte 3 Monate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="space-y-6">
            {Object.keys(tasksByMonth).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#64748B] opacity-50" />
                  <h3 className="text-lg font-semibold text-[#1E293B] mb-2">Noch keine abgeschlossenen Aufgaben</h3>
                  <p className="text-[#64748B]">Beginnen Sie mit Ihren Aufgaben, um Ihren Fortschritt hier zu sehen!</p>
                </CardContent>
              </Card>
            ) : (
              Object.keys(tasksByMonth).sort().reverse().map(monthKey => (
                <div key={monthKey} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#1F7A63]" />
                    <h2 className="text-xl font-semibold text-[#1E293B]">{formatMonthYear(monthKey)}</h2>
                    <div className="flex-1 border-t border-[#E2E8F0]"></div>
                  </div>

                  <div className="space-y-3">
                    {tasksByMonth[monthKey].map(task => (
                      <Card key={task.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-[#22C55E]" />
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                  <h3 className="font-semibold text-[#1E293B]">{task.title}</h3>
                                  <p className="text-sm text-[#64748B]">{task.description}</p>
                                </div>
                                <Badge className={`${getCategoryColor(task.category)} px-3 py-1`}>
                                  {task.category}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-[#64748B]">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatDate(task.completed_at)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Award className="w-4 h-4 text-[#F59E0B]" />
                                  <span className="font-semibold text-[#1F7A63]">+{task.xp_reward} XP</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}