"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Tractor,
  LogOut,
  ChevronRight,
  Settings,
  HelpCircle,
  Shield,
  Bell,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CropBadge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { useScanStore } from "@/stores/scan-store";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { history, clearHistory } = useScanStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="page-content">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <User className="h-10 w-10 text-slate-400" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Sign in to view your profile
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Create an account to save your scans and preferences
          </p>
          <div className="mt-6 flex gap-3">
            <Button onClick={() => router.push("/signup")}>
              Create Account
            </Button>
            <Button variant="outline" onClick={() => router.push("/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
            {user.farmName && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {user.farmName}
              </p>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 flex justify-around border-t border-slate-100 pt-4 dark:border-slate-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {history.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Scans
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {user.cropTypes.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Crop Types
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {history.filter((s) => s.isHealthy).length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Healthy
            </p>
          </div>
        </div>
      </Card>

      {/* Farm Details */}
      <Card>
        <div className="border-b border-slate-100 p-4 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Farm Details
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <ProfileItem icon={User} label="Name" value={user.name} />
          <ProfileItem icon={Mail} label="Email" value={user.email} />
          {user.phone && (
            <ProfileItem icon={Phone} label="Phone" value={user.phone} />
          )}
          {user.location && (
            <ProfileItem icon={MapPin} label="Location" value={user.location} />
          )}
          {user.farmName && (
            <ProfileItem
              icon={Tractor}
              label="Farm Name"
              value={user.farmName}
            />
          )}
        </div>

        {/* Crop Types */}
        {user.cropTypes.length > 0 && (
          <div className="border-t border-slate-100 p-4 dark:border-slate-700">
            <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
              Crops
            </p>
            <div className="flex flex-wrap gap-2">
              {user.cropTypes.map((crop) => (
                <CropBadge key={crop} cropType={crop} />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Settings */}
      <Card>
        <div className="border-b border-slate-100 p-4 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Settings
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <SettingsLink
            icon={Bell}
            label="Notifications"
            onClick={() => router.push("/notifications")}
          />
          <SettingsLink
            icon={Settings}
            label="General Settings"
            onClick={() => router.push("/settings")}
          />
          <SettingsLink
            icon={Shield}
            label="Privacy & Security"
            onClick={() => router.push("/settings")}
          />
          <SettingsLink
            icon={HelpCircle}
            label="Help & Support"
            onClick={() => router.push("/settings")}
          />
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <div className="border-b border-slate-100 p-4 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Data Management
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex w-full items-center gap-3 p-4 text-left text-danger-600 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <Trash2 className="h-5 w-5" />
            <span className="font-medium">Clear Scan History</span>
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full items-center gap-3 p-4 text-left text-danger-600 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </Card>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <ConfirmModal
          title="Sign Out"
          message="Are you sure you want to sign out?"
          confirmLabel="Sign Out"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <ConfirmModal
          title="Clear Scan History"
          message="This will permanently delete all your scan history. This action cannot be undone."
          confirmLabel="Clear History"
          onConfirm={handleClearHistory}
          onCancel={() => setShowClearConfirm(false)}
          variant="danger"
        />
      )}

      {/* App version */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        Kuapa v1.0.0
      </p>
    </div>
  );
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <Icon className="h-5 w-5 text-slate-400" />
      <div className="flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="font-medium text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function SettingsLink({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: typeof Settings;
  label: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
    >
      <Icon className="h-5 w-5 text-slate-400" />
      <span className="flex-1 font-medium text-slate-900 dark:text-white">
        {label}
      </span>
      {value && (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {value}
        </span>
      )}
      <ChevronRight className="h-5 w-5 text-slate-400" />
    </button>
  );
}

function ConfirmModal({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  variant = "default",
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "danger";
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            className="flex-1"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
