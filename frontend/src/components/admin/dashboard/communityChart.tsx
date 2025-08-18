"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function CommunityChart() {
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
        const endpoint = `${backendUrl.replace(/\/$/, "")}/statistics`;

        // read token from localStorage (auth-storage.persisted zustand shape)
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
          // credentials omitted because we use Bearer token
        });

        if (!res.ok) {
          // provide both status and body message when possible
          let msg = `Failed to fetch statistics: ${res.status}`;
          try {
            const body = await res.json();
            if (body?.message) msg += ` — ${body.message}`;
            else if (body?.error) msg += ` — ${body.error}`;
          } catch {
            // ignore JSON parse errors
          }
          throw new Error(msg);
        }

        const payload = await res.json();
        if (!payload?.success || !payload?.data) {
          throw new Error("Invalid response format from statistics endpoint");
        }

        setStats(payload.data);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error("CommunityChart fetch error:", err);
        setError(err.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    return () => ac.abort();
  }, []);

  // Derived values
  const totalMembers = stats?.total_users?.toLocaleString() ?? "0";
  const growthRate =
    stats && stats.total_users
      ? `+${Math.round((stats.active_donation_events / Math.max(1, stats.total_users)) * 100)}%`
      : "+0%";
  const growthPeriod = "based on active events";

  const chartPath = "M 0 150 Q 50 120 100 130 T 200 110 T 300 120 T 400 100";
  const chartFillPath = `${chartPath} L 400 200 L 0 200 Z`;

  return (
    <Card className="bg-background w-full shadow-sm hover:shadow transition-shadow duration-200 border border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">Community Growth</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="text-center text-destructive">{error}</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl font-bold">{totalMembers}</div>
                <div className="text-sm text-muted-foreground">Total Members</div>
              </div>
              <div className="text-sm font-medium text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full">
                {growthRate} {growthPeriod}
              </div>
            </div>

            <div className="relative h-[250px] md:h-[300px] w-full mt-4">
              <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path d={chartPath} stroke="#ef4444" strokeWidth="3" fill="none" />
                <path d={chartFillPath} fill="url(#chartGradient)" />
              </svg>
            </div>

            {/* optional recent transactions preview */}
            {stats?.recent_transactions && stats.recent_transactions.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="font-medium mb-2">Recent Transactions</div>
                <ul className="space-y-1">
                  {stats.recent_transactions.slice(0, 5).map((t: any) => (
                    <li key={t.id} className="flex justify-between">
                      <span>{t.user} — {t.event}</span>
                      <span className="text-muted-foreground">{t.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
