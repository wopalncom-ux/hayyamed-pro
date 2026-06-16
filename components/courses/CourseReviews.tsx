"use client";

import { useState } from "react";

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hovered, setHovered] = useState(0);
  const dim = size === "sm" ? 14 : size === "lg" ? 24 : 18;
  const display = readonly ? value : (hovered || value);

  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onChange?.(s)}
          className={readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}
        >
          <svg
            width={dim}
            height={dim}
            viewBox="0 0 24 24"
            fill={s <= display ? "#f59e0b" : "none"}
            stroke={s <= display ? "#f59e0b" : "#d1d5db"}
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

type Review = {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  reviewer_name?: string | null;
  reviewer_profession?: string | null;
};

interface Props {
  courseId: string;
  reviews: Review[];
  averageRating: number;
  totalCount: number;
  completed: boolean;
  existingReview?: { rating: number; review_text: string | null } | null;
}

export default function CourseReviews({
  courseId,
  reviews,
  averageRating,
  totalCount,
  completed,
  existingReview,
}: Props) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [text, setText] = useState(existingReview?.review_text ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingReview);
  const [error, setError] = useState("");
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);
  const [localAvg, setLocalAvg] = useState(averageRating);
  const [localCount, setLocalCount] = useState(totalCount);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/marketplace/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, rating, reviewText: text }),
    });

    if (res.ok) {
      setSubmitted(true);
      // Optimistically update the list
      const newReview: Review = {
        id: crypto.randomUUID(),
        rating,
        review_text: text || null,
        created_at: new Date().toISOString(),
        reviewer_name: "You",
        reviewer_profession: null,
      };
      if (existingReview) {
        setLocalReviews((prev) => prev.map((r) => (r.reviewer_name === "You" ? newReview : r)));
      } else {
        setLocalReviews((prev) => [newReview, ...prev]);
        setLocalCount((c) => c + 1);
      }
      const newTotal = localCount + (existingReview ? 0 : 1);
      const oldSum = localAvg * (existingReview ? localCount : localCount);
      const newSum = existingReview ? oldSum - (existingReview.rating ?? 0) + rating : oldSum + rating;
      setLocalAvg(Math.round((newSum / newTotal) * 10) / 10);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to submit review. Try again.");
    }
    setSubmitting(false);
  }

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-4 mb-6">
        {localCount > 0 ? (
          <>
            <div className="text-center">
              <p className="text-4xl font-bold text-[#111]">{localAvg.toFixed(1)}</p>
              <StarRating value={Math.round(localAvg)} readonly size="sm" />
              <p className="text-xs text-[#64748b] mt-1">{localCount} {localCount === 1 ? "review" : "reviews"}</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((s) => {
                const count = localReviews.filter((r) => r.rating === s).length;
                const pct = localCount > 0 ? Math.round((count / localCount) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <span className="text-xs text-[#64748b] w-4 text-right">{s}</span>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                    <div className="flex-1 bg-[#f1f5f9] rounded-full h-1.5 overflow-hidden">
                      <div className="h-1.5 bg-[#f59e0b] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-[#64748b] w-8">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p className="text-sm text-[#64748b]">No reviews yet. Be the first to review this course.</p>
        )}
      </div>

      {/* Review form — only for completed users */}
      {completed && (
        <div className="bg-[#f8fafc] rounded-xl border border-[#e2e8f0] p-5 mb-6">
          {submitted ? (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <p className="text-sm font-medium text-[#16a34a]">Your review has been saved.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#1a56a0] hover:underline ml-auto"
              >
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="text-sm font-semibold text-[#111] mb-3">
                {existingReview ? "Update your review" : "Leave a review"}
              </h3>
              <div className="mb-3">
                <label className="block text-xs text-[#64748b] mb-1.5">Your rating</label>
                <StarRating value={rating} onChange={setRating} size="lg" />
              </div>
              <div className="mb-3">
                <label className="block text-xs text-[#64748b] mb-1.5">
                  Review <span className="text-[#94a3b8]">(optional)</span>
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="What did you find most valuable? Would you recommend this course?"
                  className="w-full text-sm border border-[#e2e8f0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1a56a0]/20 bg-white resize-none"
                />
                <p className="text-xs text-[#94a3b8] mt-1 text-right">{text.length}/1000</p>
              </div>
              {error && <p className="text-xs text-[#dc2626] mb-2">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="text-sm font-semibold bg-[#1a56a0] text-white px-4 py-2 rounded-lg hover:bg-[#1547a0] disabled:opacity-50 transition-colors"
              >
                {submitting ? "Saving…" : existingReview ? "Update review" : "Submit review"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Reviews list */}
      {localReviews.length > 0 && (
        <div className="space-y-4">
          {localReviews.map((review) => (
            <div key={review.id} className="border-b border-[#f1f5f9] pb-4 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <StarRating value={review.rating} readonly size="sm" />
                </div>
                <span className="text-xs text-[#94a3b8]">
                  {new Date(review.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {review.reviewer_name && (
                <p className="text-xs font-medium text-[#374151] mb-1">
                  {review.reviewer_name}
                  {review.reviewer_profession && (
                    <span className="text-[#94a3b8] font-normal"> · {review.reviewer_profession}</span>
                  )}
                </p>
              )}
              {review.review_text && (
                <p className="text-sm text-[#374151] leading-relaxed">{review.review_text}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { StarRating };
