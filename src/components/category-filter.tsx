"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { MotifCategory } from "@/lib/types";
import { MOTIF_CATEGORY_LABELS, MOTIF_CATEGORY_COLORS } from "@/lib/taxonomy";

interface CategoryFilterProps {
  categories: MotifCategory[];
  activeCategory?: MotifCategory;
}

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = useCallback(
    (category: MotifCategory) => {
      const params = new URLSearchParams(searchParams.toString());
      if (activeCategory === category) {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [activeCategory, pathname, router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        const color = MOTIF_CATEGORY_COLORS[category];

        return (
          <button
            key={category}
            type="button"
            onClick={() => handleSelect(category)}
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all"
            style={
              isActive
                ? {
                    backgroundColor: `${color}25`,
                    color: color,
                    border: `1px solid ${color}50`,
                  }
                : {
                    backgroundColor: "transparent",
                    color: "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }
            }
          >
            {MOTIF_CATEGORY_LABELS[category]}
          </button>
        );
      })}
    </div>
  );
}
