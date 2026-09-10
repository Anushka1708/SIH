export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14">
      <div className="w-14 h-14 rounded-2xl bg-bg mb-4 flex items-center justify-center text-2xl">📭</div>
      <p className="text-sm font-semibold text-[#1E1B33]">{title}</p>
      <p className="text-xs text-muted mt-1 max-w-xs">{message}</p>
      {actionLabel && (
        <button onClick={onAction} className="btn-primary mt-4 !px-5 !py-2.5 text-xs">{actionLabel}</button>
      )}
    </div>
  );
}