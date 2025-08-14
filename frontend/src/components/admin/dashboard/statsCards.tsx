"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface DashboardStats {
  total_users: number;
  total_donation_events: number;
  total_donation_requests: number;
  total_donation_offers: number;
  total_transactions: number;
  total_transaction_contributions: number;
  total_transaction_claims: number;
  total_amount_donated: number;
  active_donation_events: number;
  recent_transactions?: any[];
}

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const endpoint = `${backendUrl.replace(/\/$/, "")}/api/statistics`;

        let token: string | null = null;
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem("auth-storage");
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              token = parsed?.state?.user?.token ?? null;
            } catch (err) {
              console.error("Failed to parse auth-storage from localStorage", err);
            }
          }
        }

        const headers: HeadersInit = { Accept: "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(endpoint, {
          method: "GET",
          headers,
          signal: ac.signal,
        });

        if (!res.ok) {
          let msg = `Failed to fetch statistics: ${res.status}`;
          try {
            const body = await res.json();
            if (body?.message) msg += ` — ${body.message}`;
          } catch {}
          throw new Error(msg);
        }

        const payload = await res.json();
        if (!payload?.success || !payload?.data) {
          throw new Error("Invalid response format from statistics endpoint");
        }

        setStats(payload.data);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("StatsCards fetch error:", err);
        setError(err.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    return () => ac.abort();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="bg-background shadow-sm border border-red-500">
            <CardContent className="p-6 text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">Loading...</div>
              <div className="text-3xl font-bold text-red-500">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <Card className="bg-background shadow-sm border border-red-500 md:col-span-3">
          <CardContent className="p-6 text-center">
            <div className="text-sm font-medium text-destructive mb-2">Error loading statistics</div>
            <div className="text-sm text-muted-foreground">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dashboardStats = [
    { label: "Global Users", value: stats?.total_users?.toLocaleString() ?? "0" },
    { label: "Donations", value: stats?.total_donation_events?.toLocaleString() ?? "0" },
    { label: "Active Events", value: stats?.active_donation_events?.toLocaleString() ?? "0" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {dashboardStats.map((stat, index) => (
        <Card
          key={index}
          className="bg-background shadow-sm hover:shadow transition-shadow duration-200 border border-red-500"
        >
          <CardContent className="p-6 text-center">
            <div className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-red-500">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
