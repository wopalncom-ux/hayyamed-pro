"use client";

import { useState, useTransition } from "react";

type Review = {
  id: string;
  course_id: string;
  reviewer_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  course_title: string;
  reviewer_anon: string;
  profession: string | null;
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-[#f59e0b]" : "text-[#e2e8f0]"} aria-hidden>★</span>
      ))}
    </span>
  );
}

function ReviewRow({
  review,
  onRemove,
}: {
  review: Review;
  onRemove: (id: string, courseId: string) => Promise<void>;
}) {
  const [confirm, setConfirm] = useState(false);
  const [removing, start] = useTransition();

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#1a56a0] mb-0.5 truncate">{review.course_title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <StarDisplay rating={review.rating} />
            <span className="text-xs text-[#64748b]">
              {review.reviewer_anon}
              {review.profession && <span className="ml-1">· {review.profession}</span>}
            </span>
            <span className="text-xs text-[#64748b]">
              {new Date(review.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
        {!confirm ? (
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#fee2e2] text-[#dc2626] hover:bg-[#fef2f2] transition-colors"
          >
            Remove
          </button>
        ) : (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-[#dc2626] font-medium">Remove?</span>
            <button
              type="button"
              disabled={removing}
              onClick={() => start(() => onRemove(review.id, review.course_id))}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#dc2626] text-white hover:bg-[#b91c1c] disabled:opacity-50"
            >
              {removing ? "…" : "Yes"}
            </button>
            <button
              type="button"
              onClick={() => setConfirm(false)}
              className="text-xs text-[#64748b] hover:text-[#111]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      {review.review_text && (
        <p className="text-sm text-[#374151] mt-2 leading-relaxed">{review.review_text}</p>
      )}
      {!review.review_text && (
        <p className="text-xs italic text-[#64748b] mt-2">Rating only — no written review.</p>
      )}
    </div>
  );
}

export default function ReviewModerationClient({ reviews: initial }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState(initial);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const handleRemove = async (id: string, _courseId: string) => {
    await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = reviews.filter((r) => {
    if (ratingFilter !== "all" && r.rating !== parseInt(ratingFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.course_title.toLowerCase().includes(q) ||
        r.reviewer_anon.toLowerCase().includes(q) ||
        (r.review_text ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by course, reviewer, or review text…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
        />
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20"
        >
          <option value="all">All ratings</option>
          <option value="5">5★ only</option>
          <option value="4">4★ only</option>
          <option value="3">3★ only</option>
          <option value="2">2★ only</option>
          <option value="1">1★ only</option>
        </select>
      </div>

      <p className="text-xs text-[#64748b] mb-4">
        Showing {filtered.length} of {reviews.length} review{reviews.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-[#e2e8f0] px-6 py-10 text-center">
          <p className="text-sm text-[#64748b]">No reviews match your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <ReviewRow key={r.id} review={r} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
