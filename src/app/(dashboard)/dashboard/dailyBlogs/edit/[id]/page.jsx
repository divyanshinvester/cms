"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useRouter, useParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { id } = useParams();
  const [status, setStatus] = useState("add");

  const MAX_CHARS = 150;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      description: "",
    },
  });

  const description = watch("description") || "";

  useEffect(() => {
    if (!id) return;

    fetch("/api/dailyBlogs")
      .then((r) => r.json())
      .then((blogs) => {
        const blog = blogs.find((b) => b._id === id);
        if (blog) reset({ description: blog.blog });
      });
  }, [id, reset]);

  const onSubmit = async ({ description }) => {
    setStatus("adding");

    await fetch("/api/dailyBlogs", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        id ? { id, blog: description } : { blog: description }
      ),
    });

    setStatus("added");
    setTimeout(() => router.push("/dashboard/dailyBlogs"), 600);
  };

  return (
    <section className="space-y-s24">
      <h2 className="heading-h3">
        {id ? "Edit Blog" : "Add New Blog"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-background rounded-r32 p-s32 min-h-[500px] flex flex-col justify-between"
      >
        <div className="relative">
          <Textarea
            label="Today’s Blog"
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

        <Button type="submit" isLoading={status === "adding"}>
          {status === "added"
            ? "Updated"
            : status === "adding"
            ? "Updating..."
            : id
            ? "Update"
            : "Add"}
        </Button>
      </form>
    </section>
  );
}