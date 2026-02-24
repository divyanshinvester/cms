"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import ImageUploadBox from "@/components/ui/ImageUploadBox";
import Button from "@/components/ui/Button";
import { uploadFile } from "@/utils/uploadFile";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const MAX_CHARS = 200;

  const [status, setStatus] = useState("update"); // update | updating | updated
  const [existing, setExisting] = useState(null); // ✅ FIX

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
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
     AUTO FILL DATA (GET)
     ====================== */
  useEffect(() => {
    const fetchLog = async () => {
      const res = await fetch(`/api/journeyLogs?id=${id}`);
      if (!res.ok) return;

      const data = await res.json();

      setExisting(data); // ✅ store existing data

      reset({
        brief: data.description,
        thumbnailType: data.thumbnailType,
      });
    };

    fetchLog();
  }, [id, reset]);

  /* ======================
     SUBMIT UPDATE (PUT)
     ====================== */
  const onSubmit = async (data) => {
    try {
      setStatus("updating");

      let openUpload, closeUpload;

      // upload only if user selected new image
      if (data.openImage) {
        openUpload = await uploadFile(data.openImage);
      }
      if (data.closeImage) {
        closeUpload = await uploadFile(data.closeImage);
      }

      await fetch("/api/journeyLogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          description: data.brief,
          thumbnailType: data.thumbnailType,
          ...(openUpload && {
            thumbnailOpen: openUpload.url,
            thumbnailOpenPublicId: openUpload.public_id,
          }),
          ...(closeUpload && {
            thumbnailClose: closeUpload.url,
            thumbnailClosePublicId: closeUpload.public_id,
          }),
        }),
      });

      setStatus("updated");

      setTimeout(() => {
        router.push("/dashboard/journeyLogs");
      }, 600);
    } catch (err) {
      console.error(err);
      setStatus("update");
    }
  };

  return (
    <section className="max-w-6xl mx-auto flex flex-col gap-s24">
      <h2 className="heading-h3">Edit Journey Log</h2>

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
            <h3 className="heading-h6">Update Screenshots</h3>

            <div className="grid grid-cols-2 gap-s24">
              <ImageUploadBox
                label="Open"
                initialUrl={existing?.thumbnailOpen} // ✅ now works
                onChange={(file) => setValue("openImage", file)}
              />

              <ImageUploadBox
                label="Close"
                initialUrl={existing?.thumbnailClose} // ✅ now works
                onChange={(file) => setValue("closeImage", file)}
              />
            </div>
          </div>

          {/* Thumbnail selector */}
          <div className="flex gap-s24">
            <label className="flex items-center gap-s8">
              <input
                type="radio"
                value="open"
  style={{ accentColor: "#16a34a" }} // your primary color

                {...register("thumbnailType", { required: true })}
              />
              Use Open as Thumbnail
            </label>

            <label className="flex  items-center gap-s8">
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

          {/* Description */}
          <div className="flex flex-col gap-s8">
            <label className="heading-h6">
              Short brief about trade
            </label>

            <div className="relative">
              <textarea
                {...register("brief", { required: true })}
                maxLength={MAX_CHARS}
                className=" w-full
                  bg-secondary-main
                  rounded-r24
                  p-s24
                  resize-none
                  outline-none"
              />
              <span className="absolute right-s16 bottom-s8 text-secondary body-small">
                {brief.length} / {MAX_CHARS}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          type="submit"
          className="w-full mt-s40"
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
