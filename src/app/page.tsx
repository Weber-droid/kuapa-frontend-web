"use client";

import { useRouter } from "next/navigation";
import {
  Camera,
  ScanLine,
  History,
  BookOpen,
  TrendingUp,
  Leaf,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard, QuickActionCard } from "@/components/dashboard/stats-card";
import { RecentScans } from "@/components/dashboard/recent-scans";
import { useAuthStore } from "@/stores/auth-store";
import { useScanStore } from "@/stores/scan-store";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { history } = useScanStore();

  // Calculate stats from scan history
  const totalScans = history.length;
  const healthyScans = history.filter((s) => s.isHealthy).length;
  const diseasedScans = totalScans - healthyScans;
  const healthRate = totalScans > 0 ? Math.round((healthyScans / totalScans) * 100) : 0;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.name?.split(" ")[0] || "Farmer";

  return (
    <div className="page-content space-y-6">
      {/* Welcome Section */}
      <section className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white">
        <p className="text-primary-100">{getGreeting()}</p>
        <h1 className="mt-1 text-2xl font-bold">{userName}</h1>
        <p className="mt-2 text-primary-100">
          {totalScans === 0
            ? "Ready to scan your first crop?"
            : `You've scanned ${totalScans} crop${totalScans !== 1 ? "s" : ""} so far`}
        </p>

        <Button
          onClick={() => router.push("/scan")}
          className="mt-4 bg-white text-primary-600 hover:bg-primary-50"
          size="lg"
          leftIcon={<Camera className="h-5 w-5" />}
        >
          Scan Crop Now
        </Button>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 gap-3">
        <StatsCard
          title="Total Scans"
          value={totalScans}
          icon={ScanLine}
          iconClassName="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
        />
        <StatsCard
          title="Healthy"
          value={healthyScans}
          icon={CheckCircle}
          iconClassName="bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400"
        />
        <StatsCard
          title="Diseased"
          value={diseasedScans}
          icon={AlertTriangle}
          iconClassName="bg-danger-100 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400"
        />
        <StatsCard
          title="Health Rate"
          value={`${healthRate}%`}
          icon={TrendingUp}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="space-y-3">
          <QuickActionCard
            title="Scan History"
            description="View all your previous scans"
            icon={History}
            onClick={() => router.push("/history")}
          />
          <QuickActionCard
            title="Disease Library"
            description="Learn about crop diseases"
            icon={BookOpen}
            onClick={() => router.push("/diseases")}
          />
        </div>
      </section>

      {/* Recent Scans */}
      <section>
        <RecentScans scans={history} />
      </section>

      {/* Tips Section */}
      <section className="rounded-xl border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-900/20">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-800/50">
            <Leaf className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-900 dark:text-primary-100">
              Scanning Tips
            </h3>
            <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
              For best results, take photos in natural daylight and focus on the
              affected area of the plant. Close-up shots work best for disease
              detection.
            </p>
          </div>
        </div>
      </section>

      {/* Login prompt for unauthenticated users */}
      {!isAuthenticated && (
        <section className="rounded-xl bg-white p-6 shadow-card dark:bg-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Save Your Scans
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create an account to save your scan history and access it from any
            device.
          </p>
          <div className="mt-4 flex gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/login")}
            >
              Log In
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
