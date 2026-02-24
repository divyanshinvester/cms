"use client";

import { useEffect, useRef, useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import LogsListingPage from "./LogsListing";

export default function MainBlogpage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [journeyLogs, setJourneyLogs] = useState([]);
const NAVBAR_OFFSET = 96;

  const [performance, setPerformance] = useState(null);
  const [performanceLoading, setPerformanceLoading] = useState(true);

  // 🔥 REF for scroll
  const resultsRef = useRef(null);

  /* ======================
     FETCH DATA
     ====================== */
  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/api/journeyLogs", { cache: "no-store" });
      const json = await res.json();
      setJourneyLogs(Array.isArray(json) ? json : []);
    };

    const fetchPerformance = async () => {
      try {
        setPerformanceLoading(true);
        const res = await fetch("/api/performanceTrack", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        setPerformance(json);
      } catch (e) {
        console.error(e);
      } finally {
        setPerformanceLoading(false);
      }
    };

    fetchLogs();
    fetchPerformance();
  }, []);

  /* ======================
     SEARCH HANDLER
     ====================== */
 const handleSearch = (query) => {
  setSearchQuery(query);

  setTimeout(() => {
    if (!resultsRef.current) return;

    const elementTop =
      resultsRef.current.getBoundingClientRect().top +
      window.pageYOffset;

    window.scrollTo({
      top: elementTop - NAVBAR_OFFSET,
      behavior: "smooth",
    });
  }, 100);
};


  return (
    <div className="max-w-6xl mx-auto px-s16 space-y-s104">
      <h1 className="heading-h1 pt-s160 text-center">
        My Trading Journey
      </h1>

      {/* SEARCH + PERFORMANCE */}
      <div className="bg-background p-s24 space-y-s40 rounded-r40">
        <SearchBar
          items={journeyLogs}
          onSearch={handleSearch} // ✅ UPDATED
        />

        {/* PERFORMANCE TRACK */}
        <div className="flex flex-col gap-s32">
          <div className="flex justify-between items-center">
            <p className="heading-h4">Performance Track</p>

              <p className="body-default">Lifetime</p>
          
          </div>

          {performanceLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] rounded-r16 bg-secondary-main">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-background py-s16 flex flex-col items-center gap-s16 animate-pulse"
                >
                  <div className="h-3 w-20 bg-secondary-main rounded" />
                  <div className="h-5 w-16 bg-secondary-main rounded" />
                </div>
              ))}
            </div>

          ) : (
            
            performance && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] rounded-r16 bg-secondary-main">
                <Stat label="Total Trades" value={performance.totalTrades} />
                <Stat label="Accuracy" value={`${performance.accuracy}%`} />
                <Stat
                  label="Avg Risk : Reward"
                  value={performance.avgRiskToReward}
                />
                <Stat
                  label="Best / Worst"
                  value={`${performance.best} / ${performance.worst}`}
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* RESULTS */}
      <div ref={resultsRef} className="space-y-s56 min-h-screen">
        <p className="px-s16 heading-h6">Daily Trades</p>

        <LogsListingPage
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
        />
      </div>
    </div>
  );
}

/* ======================
   STAT
   ====================== */
function Stat({ label, value }) {
  return (
    <div className="bg-background text-center flex flex-col gap-s16 py-s16">
      <p className="body-default">{label}</p>
      <p className="heading-h6">{value}</p>
    </div>
  );
}
