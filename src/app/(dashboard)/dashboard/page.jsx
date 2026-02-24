"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPageClient() {
  const router = useRouter();

  const [stats, setStats] = useState({
    performanceLastUpdated: null,
    lastBlogAdded: null,
    journeyLogsCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const json = await res.json();

        if (json?.data) {
          setStats(json.data);
        }
      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="flex flex-col gap-s32">
      {/* Header */}
      <div className="flex flex-col gap-s8">
        <h1 className="heading-h2">Dashboard Overview 📊</h1>
        <p className="heading-h6 max-w-2xl text-secondary">
          Track your performance, blogs, and journey logs at a glance.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s24">
        {/* Performance */}
        <div
          onClick={() => router.push("/dashboard/perfromnace")}
          className="
            bg-background

            p-s24
            rounded-r24
            shadow
            flex
            flex-col
            gap-s8
            cursor-pointer
            hover:scale-[1.02]
            transition-transform
          "
        >
          <h3 className="heading-h4 text-primary-main">
            Performance
          </h3>
          <p className="body-default text-secondary">
            Last updated :
          </p>
          <span className="heading-h6 text-primary-main">
            {loading ? "…" : formatDate(stats.performanceLastUpdated)}
          </span>
        </div>

        {/* Daily Blog */}
        <div
          onClick={() => router.push("/dashboard/dailyBlogs")}
          className="
                       bg-primary-light/40

            p-s24
            rounded-r24
            shadow
            flex
            flex-col
            gap-s8
            cursor-pointer
            hover:scale-[1.02]
            transition-transform
          "
        >
          <h3 className="heading-h4 text-primary-main">
            Daily Blog
          </h3>
          <p className="body-default text-secondary">
            Last added :
          </p>
          <span className="heading-h6 text-primary-main">
            {loading ? "…" : formatDate(stats.lastBlogAdded)}
          </span>
        </div>

        {/* Journey Logs */}
        <div
          onClick={() => router.push("/dashboard/journeyLogs")}
          className="
            bg-primary-light

            p-s24
            rounded-r24
            shadow
            flex
            flex-col
            gap-s8
            cursor-pointer
            hover:scale-[1.02]
            transition-transform
          "
        >
          <h3 className="heading-h4 text-primary-main">
            Journey Logs
          </h3>
          <p className="body-default text-secondary">
            Total logs :
          </p>
          <span className="heading-h6 text-primary-main">
            {loading ? "…" : stats.journeyLogsCount}
          </span>
        </div>
      </div>
    </section>
  );
}
