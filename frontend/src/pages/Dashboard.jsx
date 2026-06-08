import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) return <div>Failed to load stats. Ensure backend is running.</div>;

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-surface p-6 rounded-xl border border-border flex items-center gap-4 hover:shadow-lg transition-shadow">
      <div className={`p-4 rounded-lg ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon className={`w-8 h-8 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-text-muted">{title}</p>
        <h3 className="text-2xl font-bold text-text mt-1">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Dashboard Overview</h1>
        <p className="text-sm text-text-muted">Welcome back! Here is your placement progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value={stats.companyStats.totalApplications} 
          icon={Briefcase} 
          colorClass="text-primary bg-primary" 
        />
        <StatCard 
          title="In Progress" 
          value={stats.companyStats.inProgress} 
          icon={Clock} 
          colorClass="text-amber-500 bg-amber-500" 
        />
        <StatCard 
          title="Selected" 
          value={stats.companyStats.selected} 
          icon={CheckCircle} 
          colorClass="text-emerald-500 bg-emerald-500" 
        />
        <StatCard 
          title="Rejected" 
          value={stats.companyStats.rejected} 
          icon={XCircle} 
          colorClass="text-rose-500 bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-surface p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Activity Last 7 Days
            </h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--border)', opacity: 0.2 }}
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)', borderRadius: '8px' }}
                />
                <Bar dataKey="applications" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Interviews & DSA */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-xl border border-border">
            <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Interviews
            </h2>
            {stats.upcomingInterviews.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingInterviews.map((interview, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-bg transition-colors">
                    <div className="bg-primary/10 text-primary p-2 rounded flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-text">{interview.companyName}</h4>
                      <p className="text-xs text-text-muted mt-1">{interview.roundName} - {new Date(interview.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted flex flex-col items-center">
                <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                <p>No upcoming interviews scheduled</p>
              </div>
            )}
          </div>

          <div className="bg-surface p-6 rounded-xl border border-border">
            <h2 className="text-lg font-semibold text-text mb-4">DSA Progress</h2>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-3xl font-bold text-primary">{stats.dsaStats.solved}</p>
                <p className="text-sm text-text-muted">Problems Solved</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-text">{stats.dsaStats.total}</p>
                <p className="text-sm text-text-muted">Total Tracked</p>
              </div>
            </div>
            {stats.dsaStats.total > 0 && (
              <div className="w-full bg-border rounded-full h-2.5 mt-4">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(stats.dsaStats.solved / stats.dsaStats.total) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
