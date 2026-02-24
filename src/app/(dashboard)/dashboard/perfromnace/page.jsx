"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      const res = await fetch("/api/performanceTrack");
      
      console.log(res);
      if (!res.ok) return;
      const json = await res.json();
      console.log("kui",json);
      
      setData(json);
    };

    fetchPerformance();
  }, []);

  if (!data) return null;

  return (
    <section className="flex flex-col  gap-s40">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="heading-h3">Performance Track</p>
        <Button as="link" href="/dashboard/perfromnace/upload">
          Update
        </Button>
      </div>

      {/* Cards */}
      <div className="flex justify-center items-center gap-s32 flex-wrap">
        {/* Total Trades */}
        <Card
          title="Total Trades"
          value={data.totalTrades}
          footer="This month"
          bg="bg-primary-main text-background"
        />

        {/* Accuracy */}
        <Card
          title="Accuracy"
          value={data.accuracy}
          footer="Win rate"
          bg="bg-gray-100"
        />

        {/* Avg Risk : Reward */}
        <Card
          title="Avg Risk : Reward"
          value={data.avgRiskToReward}
          footer="Based on executed trades"
          bg="bg-primary-light"
        />

        {/* Best / Worst */}
        <Card
          title="Best / Worst"
          value={`${data.best} / ${data.worst}`}
          footer="Learning focus
Measured in R-multiples (risk units)"
          bg="bg-main text-background"
        />
      </div>
    </section>
  );
}

/* Small reusable card */
function Card({ title, value, footer, bg }) {
  return (
    <div
      className={`
        flex flex-col items-center justify-between space-y-[50px]
        py-s24 px-s32 rounded-r32 min-w-[300px]
        text-center ${bg}
      `}
    >
      <p className="border-b border-background pb-s8 min-w-[240px] heading-h5">
        {title}
      </p>

      <p className="heading-h4">{value}</p>

      <p className="border-t border-background pt-s16 min-w-[240px] text-center max-w-[100px]  caption">
        {footer}
      </p>
    </div>
  );
}
