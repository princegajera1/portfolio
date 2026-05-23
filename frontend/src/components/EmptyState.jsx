export default function EmptyState({ icon = '📂', title = 'No items found', description = 'There are no records in the database.', children }) {
  return (
    <div className="bg-[#0d0d1a] border border-[#7C6FFF]/12 p-12 sm:p-16 text-center rounded-2xl flex flex-col items-center justify-center font-sans max-w-2xl mx-auto my-8 select-none">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-3xl mb-6 shadow-[0_0_20px_rgba(124,111,255,0.15)] animate-float">
        {icon}
      </div>
      <h3 className="text-white text-base sm:text-lg font-bold font-display tracking-wide mb-2">
        {title}
      </h3>
      <p className="text-muted text-xs sm:text-sm max-w-sm leading-relaxed mb-6 font-light">
        {description}
      </p>
      {children}
    </div>
  );
}
