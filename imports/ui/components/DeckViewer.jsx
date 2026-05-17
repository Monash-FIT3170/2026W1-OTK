export function DeckViewer({ count }) {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-700/80 text-white rounded-xl px-4 py-3 min-w-20 min-h-70 shrink-0">
      <span className="text-2xl font-bold">{count}</span>
      <span className="text-xs text-slate-300 mt-1">Deck</span>
    </div>
  );
}
