export function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
      <span className="text-5xl">{icon}</span>
      <p className="mt-4 text-lg font-medium text-zinc-600">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}
