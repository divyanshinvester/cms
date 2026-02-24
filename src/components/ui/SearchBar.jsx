"use client";
import { useEffect, useState, useRef } from "react";
import Button from "./Button";

export default function SearchBar({
  items = [],
  onSearch,
  placeholder = " Search logs..",
}) {
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const inputRef = useRef(null);

  /* =====================================
     BUILD SUGGESTIONS (DESCRIPTION + DATE)
     ===================================== */
  useEffect(() => {
    const q = term.trim().toLowerCase();

    if (!q || items.length === 0) {
      setSuggestions([]);
      setOpen(false);
      setActive(-1);
      return;
    }

    const scored = [];

    items.forEach((item) => {
      const desc = item.description?.toLowerCase() || "";

      const dateStr = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString().toLowerCase()
        : "";

      let score = 0;

      if (desc === q) score = 100;
      else if (desc.startsWith(q)) score = 90;
      else if (desc.includes(q)) score = 70;
      else if (dateStr.includes(q)) score = 60;

      if (score > 0) {
        scored.push({ item, score });
      }
    });

    const result = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((r) => r.item);

    setSuggestions(result);
    setOpen(result.length > 0);
    setActive(-1);
  }, [term, items]);

  /* ======================
     CLOSE DROPDOWN
     ====================== */
  const closeSuggestions = () => {
    setOpen(false);
    setSuggestions([]);
    setActive(-1);
  };

  /* ======================
     EXECUTE SEARCH
     ====================== */
  const executeSearch = (value) => {
    const q = value.trim();
    closeSuggestions();
    onSearch?.(q);
    inputRef.current?.blur();
  };

  /* ======================
     KEYBOARD HANDLING
     ====================== */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (active >= 0 && suggestions[active]) {
        executeSearch(suggestions[active].description);
        setTerm(suggestions[active].description);
      } else {
        executeSearch(term);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    }

    if (e.key === "Escape") {
      closeSuggestions();
      inputRef.current?.blur();
    }
  };

  /* ======================
     HIGHLIGHT MATCH
     ====================== */
  const highlight = (text) => {
    if (!term || !text) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  /* ======================
     CLICK OUTSIDE TO CLOSE
     ====================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      const parent = inputRef.current?.closest(".relative");
      if (parent && !parent.contains(e.target)) {
        closeSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ======================
     RENDER
     ====================== */
  return (
    <div className="relative w-full flex justify-center border-2 border-primary-light bg-secondary-main rounded-r40 ">
      <div className="relative w-full max-w-7xl">
        {/* INPUT */}
        <div className="flex items-center gap-s16   px-s16 py-s8">
          <input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none "
          />

          <Button onClick={() => executeSearch(term)}>
            Search
          </Button>
        </div>

        {/* SUGGESTIONS */}
        {open && suggestions.length > 0 && (
          <div className="absolute z-30 w-full mt-2 bg-background border border-primary-light rounded-r16 shadow-xl max-h-96 overflow-y-auto no-scrollbar ">
            {suggestions.map((item, index) => (
              <div
                key={item._id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTerm(item.description);
                  executeSearch(item.description);
                }}
                onMouseEnter={() => setActive(index)}
                className={`p-s16  cursor-pointer border-b  border-primary-light transition-colors ${
                  index === active
                    ? "bg-primary-light/70"
                    : "hover:bg-primary-light/50"
                }`}
              >
                <p className="body-default line-clamp-1">
                  {highlight(item.description)}
                </p>

                <p className="caption text-secondary mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
