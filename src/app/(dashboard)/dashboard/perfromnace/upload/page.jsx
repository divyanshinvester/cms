"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function Page() {
  const router = useRouter();
  const [status, setStatus] = useState("update"); 
  // update | updating | updated

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  /* 🔹 AUTO FILL FORM */
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/performanceTrack");
      if (!res.ok) return;

      const data = await res.json();
      reset({
        totalTrades: data.totalTrades,
        accuracy: data.accuracy,
        avgRiskToReward: data.avgRiskToReward,
        best: data.best,
        worst: data.worst,
      });
    };

    fetchData();
  }, [reset]);

  /* 🔹 UPDATE */
  const onSubmit = async (formData) => {
    console.log(formData);
    
    try {
      setStatus("updating");

      await fetch("/api/performanceTrack", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setStatus("updated");

      // ⏳ small UX delay
      setTimeout(() => {
        router.push("/dashboard/perfromnace");
      }, 600);
    } catch (err) {
      console.error(err);
      setStatus("update");
    }
  };

  return (
    <section className="mx-auto space-y-s24">
      <h2 className="heading-h3">Update Data</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-background rounded-r32 p-s32 flex flex-col gap-s32"
      >
        <Input
          label="Total Trades"
          
          registerProps={register("totalTrades", {
            required: "Required",
          })}
          error={errors.totalTrades?.message}
        />

        <Input
          label="Accuracy"
          noText
          registerProps={register("accuracy", {
            required: "Required",
          })}
          error={errors.accuracy?.message}
        />

        <Input
          label="Avg. Risk : Reward"
          registerProps={register("avgRiskToReward", {
            required: "Required",
          })}
          error={errors.avgRiskToReward?.message}
        />

        <div className="flex flex-col gap-s16">
          <p className="heading-h6">Best / Worst Data</p>

          <div className="grid grid-cols-2 gap-s24">
            <Input
              label="Best"
              registerProps={register("best", {
                required: "Required",
              })}
              error={errors.best?.message}
            />

            <Input
              label="Worst"
              registerProps={register("worst", {
                required: "Required",
              })}
              error={errors.worst?.message}
            />
          </div>
        </div>

        <Button
          variant="primary"
          type="submit"
          className="w-full"
          isLoading={status === "updating"}
        >
          {status === "updated"
            ? "Updated"
            : status === "updating"
            ? "Updating..."
            : "Update"}
        </Button>
      </form>
    </section>
  );
}
