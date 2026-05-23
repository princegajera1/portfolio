export default function SkeletonCard({ count = 3, type = 'card' }) {
  const cards = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className="bg-[#0d0d1a] border border-[#7C6FFF]/12 rounded-2xl overflow-hidden animate-pulse">
        <div className="h-12 bg-white/5 border-b border-white/5" />
        <div className="p-4 space-y-4">
          {cards.map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded bg-white/5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/5 rounded w-1/3" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
              <div className="w-20 h-6 bg-white/5 rounded" />
              <div className="w-12 h-6 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((_, i) => (
        <div key={i} className="bg-[#0d0d1a] border border-[#7C6FFF]/12 p-6 rounded-2xl space-y-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-white/5 rounded w-1/2" />
            <div className="h-4 bg-white/5 rounded w-1/4" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-4/5" />
          </div>
          <div className="pt-2 flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/5 rounded" />
            <div className="w-8 h-3 bg-white/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
