"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function Page() {
  const router = useRouter();
  const [status, setStatus] = useState("add"); 
  // add | adding | added
const MAX_CHARS = 200;
const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
} = useForm({
  mode: "onSubmit",
  reValidateMode: "onChange",
  defaultValues: {
    description: "",
  },
});
const description = watch("description") || "";
  const onSubmit = async ({ description }) => {
    try {
      setStatus("adding");

      const res = await fetch("/api/dailyBlogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blog: description }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("added");

      // smooth UX
      setTimeout(() => {
        router.push("/dashboard/dailyBlogs");
      }, 600);
    } catch (err) {
      console.error(err);
      setStatus("add");
    }
  };

  return (
    <section className="mx-auto flex flex-col gap-s24">
      <h2 className="heading-h3">Add New Blog</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          bg-background
          rounded-r32
          p-s32
          min-h-[600px]
          flex
          flex-col
          justify-between
        "
      >
<div className="relative">
  <Textarea
    label="Today’s Blog"
    placeholder="Write blog"
    rows={8}
    maxLength={MAX_CHARS}
    registerProps={register("description", {
      required: "This field is required",
      maxLength: {
        value: MAX_CHARS,
        message: `Maximum ${MAX_CHARS} characters allowed`,
      },
    })}
    error={errors.description?.message}
  />

  <span className="absolute right-s16 bottom-s8 text-secondary body-small">
    {description.length} / {MAX_CHARS}
  </span>
</div>

        <Button
          variant="primary"
          type="submit"
          className="w-full mt-s32"
          isLoading={status === "adding"}
        >
          {status === "added"
            ? "Added"
            : status === "adding"
            ? "Adding..."
            : "Add"}
        </Button>
      </form>
    </section>
  );
}
