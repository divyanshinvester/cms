"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ImageUploadBox from "@/components/ui/ImageUploadBox";
import Button from "@/components/ui/Button";
import { uploadFile } from "@/utils/uploadFile";

export default function Page() {
  const router = useRouter();
  const MAX_CHARS = 200;
  const [status, setStatus] = useState("add"); 
  // add | adding | added

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      openImage: null,
      closeImage: null,
      brief: "",
      thumbnailType: "",
    },
  });

  const brief = watch("brief") || "";

  /* ======================
     SUBMIT
     ====================== */
 const onSubmit = async (data) => {
  try {
    setStatus("adding");

    // 🚀 PARALLEL uploads
    const [openUpload, closeUpload] = await Promise.all([
      uploadFile(data.openImage),
      uploadFile(data.closeImage),
    ]);
    console.log(openUpload);
    console.log(closeUpload);
    

    await fetch("/api/journeyLogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: data.brief,
        thumbnailType: data.thumbnailType,
        thumbnailOpen: openUpload.url,
        thumbnailClose: closeUpload.url,
        thumbnailOpenPublicId: openUpload.public_id,
        thumbnailClosePublicId: closeUpload.public_id,
      }),

    });

    setStatus("added");

    setTimeout(() => {
      router.push("/dashboard/journeyLogs");
    }, 400);
  } catch (err) {
    console.error(err);
    setStatus("add");
  }
};

  return (
    <section className="max-w-6xl mx-auto flex flex-col gap-s24">
      <h2 className="heading-h3">Add New Trade</h2>

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
        <div className="flex flex-col gap-s32">
          {/* Screenshots */}
          <div className="flex flex-col gap-s16">
            <h3 className="heading-h6">Add Screenshots</h3>

            <div className="grid grid-cols-2 gap-s24">
              {/* Open */}
              <div className="flex flex-col gap-s8">
                <ImageUploadBox
                  label="Open"
                  onChange={(file) => {
                    setValue("openImage", file, { shouldValidate: true });
                    trigger("openImage");
                  }}
                />
                {errors.openImage && (
                  <p className="text-red-600 caption">Required</p>
                )}
              </div>

              {/* Close */}
              <div className="flex flex-col gap-s8">
                <ImageUploadBox
                  label="Close"
                  onChange={(file) => {
                    setValue("closeImage", file, { shouldValidate: true });
                    trigger("closeImage");
                  }}
                />
                {errors.closeImage && (
                  <p className="text-red-600 caption">Required</p>
                )}
              </div>
            </div>

            {/* 🔹 Thumbnail selector */}
            <div className="flex gap-s24 mt-s8">
              <label className="flex items-center gap-s8">
                <input
                  type="radio"
                  value="open"
  style={{ accentColor: "#16a34a" }} // your primary color

                  {...register("thumbnailType", { required: true })}
                />
                Use Open as Thumbnail
              </label>

              <label className="flex items-center gap-s8">
                <input
                  type="radio"
                  value="close"
  style={{ accentColor: "#16a34a" }} // your primary color

                  {...register("thumbnailType", { required: true })}
                />
                Use Close as Thumbnail
              </label>
            </div>

            {errors.thumbnailType && (
              <p className="text-red-600 caption">
                Select a thumbnail image
              </p>
            )}
          </div>

          {/* Short Brief */}
          <div className="flex flex-col gap-s8">
            <label className="heading-h6">
              Short brief about trade
            </label>

            <div className="relative">
              <textarea
                {...register("brief", {
                  required: "This field is required",
                })}
                maxLength={MAX_CHARS}
                placeholder="Write here"
                className={`
                  w-full
                  bg-secondary-main
                  rounded-r24
                  p-s24
                  resize-none
                  outline-none
                  ${errors.brief ? "border border-primary-main" : ""}
                `}
              />

              <span className="absolute right-s16 bottom-s8 text-secondary body-small">
                {brief.length} / {MAX_CHARS}
              </span>
            </div>

            {errors.brief && (
              <p className="text-red-600 caption">
                {errors.brief.message}
              </p>
            )}
          </div>
        </div>

        {/* Hidden inputs for RHF validation */}
        <input type="hidden" {...register("openImage", { required: true })} />
        <input type="hidden" {...register("closeImage", { required: true })} />

        <Button
          variant="primary"
          type="submit"
          className="w-full mt-s40"
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
