import Link from "next/link";
import Image from "next/image";

const features = [
  {
    title: "Smart Budgeting",
    desc: "Set intelligent monthly limits per category and get real-time alerts before you overspend.",
    gradient: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    border: "rgba(22,163,74,0.15)",
    iconBg: "linear-gradient(135deg, #16a34a, #15803d)",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
  },
  {
    title: "Analytics & Reports",
    desc: "Beautiful visualizations and detailed reports to understand your spending at a glance.",
    gradient: "linear-gradient(135deg, #fff7ed, #ffedd5)",
    border: "rgba(249,115,22,0.15)",
    iconBg: "linear-gradient(135deg, #f97316, #ea580c)",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "AI-Powered Insights",
    desc: "Auto-categorization, spending predictions, and personalized financial recommendations.",
    gradient: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    border: "rgba(37,99,235,0.15)",
    iconBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Multi-Wallet Hub",
    desc: "Connect MTN, Orange, Paysika, Neero and more — all transactions in one dashboard.",
    gradient: "linear-gradient(135deg, #fefce8, #fef9c3)",
    border: "rgba(234,179,8,0.15)",
    iconBg: "linear-gradient(135deg, #eab308, #ca8a04)",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    title: "Instant Exports",
    desc: "Download CSV or PDF statements ready for tax, business, or personal records.",
    gradient: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    border: "rgba(34,197,94,0.12)",
    iconBg: "linear-gradient(135deg, #22c55e, #16a34a)",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
  {
    title: "Bank-Level Security",
    desc: "End-to-end encryption and zero-knowledge architecture keep your data private.",
    gradient: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
    border: "rgba(236,72,153,0.12)",
    iconBg: "linear-gradient(135deg, #ec4899, #be185d)",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const partners = [
  { src: "/mtn.jpg",      alt: "MTN Mobile Money" },
  { src: "/Orange.png",   alt: "Orange Money" },
  { src: "/paysika.jpg",  alt: "Paysika" },
  { src: "/neero.jpg",    alt: "Neero" },
  { src: "/depenses.jpg", alt: "Other Expenses" },
];

const stats = [
  { value: "50K+",  label: "Active users" },
  { value: "5",     label: "Mobile networks" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "XAF",   label: "Native currency" },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">

      {/* ── Hero ─────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #071a0e 0%, #0d2714 35%, #1a1a00 65%, #071020 100%)",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Ambient blobs — couleurs du logo */}
        <div className="absolute" style={{ top: "-10%", left: "-8%", width: "550px", height: "550px", borderRadius: "50%", background: "radial-gradient(circle, rgba(22,163,74,0.3) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="absolute" style={{ bottom: "-15%", right: "-5%", width: "480px", height: "480px", borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="absolute" style={{ top: "25%", right: "15%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)", filter: "blur(35px)" }} />

        {/* Grid subtile */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="text-center">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-sm font-medium text-green-200"
              style={{ background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.25)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Now supporting 5 African mobile money networks
            </div>

            {/* Logo + Title */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Image
                src="/logo.png"
                alt="AfriFlow"
                width={72}
                height={72}
                className="drop-shadow-2xl"
              />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.05]">
              Your African Finances,
              <br className="hidden sm:block" />
              <span
                style={{
                  background: "linear-gradient(135deg, #4ade80, #fb923c, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Finally Unified.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/55 mb-10 max-w-2xl mx-auto leading-relaxed">
              AfriFlow aggregates your mobile money wallets, automates budgets, and delivers AI-powered insights — all in one beautiful dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                  boxShadow: "0 8px 32px rgba(22,163,74,0.45), 0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                Start for free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base text-white/75 transition-all hover:text-white hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
              >
                Sign in
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-sm text-white/40 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 sm:h-20">
            <path d="M0,80 C360,0 1080,80 1440,20 L1440,80 Z" fill="#f8f9fc" />
          </svg>
        </div>
      </section>

      {/* ── Features ─────────────────────────────── */}
      <section className="py-24" style={{ background: "#f8f9fc" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#16a34a" }}
            >
              Features
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Everything you need to
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #15803d, #f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                master your money
              </span>
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Designed specifically for the African financial ecosystem — because your needs are unique.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: f.gradient, border: `1px solid ${f.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 shadow-lg" style={{ background: f.iconBg }}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ─────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "#f97316" }}>
              Integrations
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              Connect your favorite wallets
            </h2>
            <p className="text-slate-500">
              Import transactions automatically from all major African mobile money platforms.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {partners.map((p) => (
              <div
                key={p.alt}
                className="group relative bg-white p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                style={{ border: "1px solid rgba(15,23,42,0.07)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: "0 8px 24px rgba(22,163,74,0.15)" }} />
                <Image src={p.src} alt={p.alt} width={72} height={72} className="rounded-xl object-cover" />
                <p className="text-xs font-medium text-slate-500 text-center mt-3">{p.alt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #071a0e, #0d2714, #071020)" }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(22,163,74,0.2) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="AfriFlow" width={60} height={60} className="drop-shadow-xl opacity-90" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            Ready to take control
            <br />of your finances?
          </h2>
          <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
            Join thousands of Africans who trust AfriFlow to simplify their financial lives. Free to start, no credit card required.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl font-semibold text-base text-white transition-all"
            style={{ background: "linear-gradient(135deg, #16a34a, #f97316)", boxShadow: "0 8px 32px rgba(22,163,74,0.4)" }}
          >
            Get started — it's free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="py-8 text-center text-sm text-slate-400" style={{ borderTop: "1px solid rgba(15,23,42,0.07)", background: "#f8f9fc" }}>
        © {new Date().getFullYear()} AfriFlow — Built with ❤️ for Africa.
      </footer>
    </div>
  );
}
