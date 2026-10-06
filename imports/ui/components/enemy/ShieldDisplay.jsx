export default function ShieldLayers({ enemy }) {
  if (!enemy.debuffs.includes('shield')) return null;

  const threshold = enemy.health - enemy.shieldLayers;
  const remaining = Math.max(0, enemy.currentHealth - threshold);
  if (remaining === 0) return null;

  //placeholder squares for shield points
  return (
    <div className="pointer-events-none absolute left-1/2 -top-12 -translate-x-1/2 flex gap-2">
      {Array.from({ length: enemy.shieldLayers }, (_, i) => (
        <div
          key={i}
          className={`h-10 w-10 border-4 border-white transition-all duration-200 ${
            i < remaining ? 'bg-sky-400' : 'bg-transparent opacity-30 scale-75'
          }`}
        />
      ))}
    </div>
  );
}