interface Props {
  rating: number;
}

const Rating = ({ rating }: Props) => {
  const r = Math.max(0, Math.min(5, rating));
  const rounded = Math.round(r * 10) / 10;

  return (
    <div
      className="inline-flex items-center gap-1.5 mt-1"
      style={{ color: "#f6c85f" }}
      aria-label={`Rated ${rounded} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = Math.max(0, Math.min(1, r - i));
        const fillPct = Math.round(starValue * 100);
        const gradId = `star-grad-${i}-${rating}`;
        return (
          <svg key={i} className="w-3 h-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id={gradId} x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset={`${fillPct}%`} stopColor="currentColor" />
                <stop offset={`${fillPct}%`} stopColor="#e6e6e6" />
              </linearGradient>
            </defs>
            <path fill={`url(#${gradId})`} d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.4 8.171L12 18.896l-7.334 3.873 1.4-8.171L.132 9.21l8.2-1.192z" />
          </svg>
        );
      })}
    </div>
  );
};

export default Rating;
