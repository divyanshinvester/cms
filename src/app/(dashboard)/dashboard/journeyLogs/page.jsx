"use client";
import React, { useEffect,useRef, useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import JourneyLogSkeleton from "@/components/ui/JourneyLogSkeleton";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();



  const [logs, setLogs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
console.log(logs);

  const fetchLogs = async () => {
    setPageLoading(true);
    const res = await fetch("/api/journeyLogs", { cache: "no-store" });
    setLogs(await res.json());
    setPageLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);
useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest("[data-menu]")) {
      setMenuOpen(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, []);

  const handleDelete = async () => {
    setLoading(true);
    setLogs((prev) => prev.filter((l) => l._id !== deleteId));

    await fetch("/api/journeyLogs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    });

    setLoading(false);
    setDeleteId(null);
    setMenuOpen(null);
  };

  return (
    <section className="space-y-s24 min-w-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-s16 ">
        <h2 className="heading-h3">Journey Logs</h2>
        <Button as="link" href="/dashboard/journeyLogs/add">
          + Add new
        </Button>
      </div>

      {/* Skeleton */}
      {pageLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <JourneyLogSkeleton key={i} />
        ))}

      {!pageLoading &&
        logs.map((log) => {
          const thumbnail =
            log.thumbnailType === "open"
              ? log.thumbnailOpen
              : log.thumbnailClose;

          return (
            <div
              key={log._id}
              className="
                bg-background rounded-r24 p-s16 md:p-s24
                flex justify-between
                gap-s16 md:gap-s24
              "
            >
             <div className="flex gap-s8 md:gap-s32 ">
               <img
                src={thumbnail}
                className="min-w-[200px] lg:min-w-[30vw] shrink-0 h-[100px] lg:h-[160px] rounded-r16 object-cover"
              />

               <div className="max-w-[30vw] md:max-w-[15vw] flex flex-col  lg:max-w-[25vw]">
              <p className="body-default flex-1 line-clamp-3 break-words">{log.description}</p>
              <p className="caption text-secondary mt-s8">
                {new Date(log.createdAt).toLocaleDateString()}
              </p>
            </div>
             </div>

            <div className="relative shrink-0" >

              <button
  data-menu
  onClick={() =>
    setMenuOpen(menuOpen === log._id ? null : log._id)
  }
  className="p-2 rounded-full hover:bg-secondary-main"
>
  <MoreVertical size={18} />
</button>


                {menuOpen === log._id && (
  <div
    data-menu
    onMouseDown={(e) => e.stopPropagation()}
    className="
      absolute right-5 top-0 p-s8 w-32
      bg-background rounded-r16
      border border-primary-light
      shadow-xl z-20
    "
  >

                    <button
                    
                      onClick={() =>{
                        setMenuOpen(null);
                        router.push(`/dashboard/journeyLogs/edit/${log._id}`)
                      }
                      }
                      className="w-full py-s8 hover:bg-primary-light rounded-r24"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(log._id)}
                      className="w-full py-s8 hover:bg-red-50 text-red-600 rounded-r24"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={loading}
        title="Delete Journey Log"
        message="This log will be permanently deleted."
      />
    </section>
  );
}
