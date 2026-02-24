"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import BlogSkeleton from "@/components/ui/BlogSkeleton";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchBlogs = async () => {
    setPageLoading(true);
    const res = await fetch("/api/dailyBlogs", { cache: "no-store" });
    setBlogs(await res.json());
    setPageLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ✅ outside click
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest("[data-menu]")) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleDelete = async () => {
    setLoading(true);
    setBlogs((prev) => prev.filter((b) => b._id !== deleteId));

    await fetch("/api/dailyBlogs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    });

    setLoading(false);
    setDeleteId(null);
    setMenuOpen(null);
  };

  return (
    <section className="space-y-s24">
      <div className="flex justify-between items-center">
        <h2 className="heading-h3">Daily Blogs</h2>
        <Button as="link" href="/dashboard/dailyBlogs/add">
          + Add new
        </Button>
      </div>

      {pageLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <BlogSkeleton key={i} />
        ))}

      {!pageLoading &&
        blogs.map((b) => (
          <div
            key={b._id}
            className="bg-background rounded-r24 p-s24 flex justify-between gap-s6"
          >
            <div className="max-w-[70vw] md:max-w-[50vw] lg:max-w-[60vw]">
              <p className="body-default break-words">{b.blog}</p>
              <p className="caption text-secondary mt-s8">
                {new Date(b.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="relative shrink-0">
              <button
                data-menu
                onClick={() =>
                  setMenuOpen(menuOpen === b._id ? null : b._id)
                }
                className="p-2 rounded-full hover:bg-secondary-main"
              >
                <MoreVertical size={18} />
              </button>

              {menuOpen === b._id && (
                <div
                  data-menu
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute right-5 p-s8 w-32 bg-background border border-primary-light rounded-r16 shadow-xl z-20"
                >
                  <button
                    onClick={() => {
                      setMenuOpen(null);
                      router.push(`/dashboard/dailyBlogs/edit/${b._id}`);
                    }}
                    className="w-full py-s8 hover:bg-primary-light rounded-r24"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(b._id)}
                    className="w-full py-s8 hover:bg-red-50 text-red-600 rounded-r24"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={loading}
        title="Delete Blog"
        message="This blog will be permanently deleted."
      />
    </section>
  );
}
