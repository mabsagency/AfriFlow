export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
      <div className="text-center">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--brand-50)" }}
        >
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--brand-600)", borderTopColor: "transparent" }} />
        </div>
        <p className="text-sm font-medium text-slate-500">Chargement...</p>
      </div>
    </div>
  );
}
