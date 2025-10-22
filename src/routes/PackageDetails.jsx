import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000/api/").replace(/\/+$/, "");

function fmt(n) { try { return Number(n || 0).toLocaleString("en-IN"); } catch { return n; } }
function dstr(d) {
  try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return d; }
}

export default function PackageDetails() {
  const { id } = useParams();
  const location = useLocation();
  const pkgId = Number(id || location.state?.package_id || 0);

  const [event, setEvent] = useState(null);
  const [pkg, setPkg] = useState(null);

  // Load cached
  useEffect(() => {
    const evt = JSON.parse(localStorage.getItem("event") || "null");
    const pkgs = JSON.parse(localStorage.getItem("packages") || "null");
    if (evt) setEvent(evt);
    if (Array.isArray(pkgs)) {
      const p = pkgs.find((x) => Number(x.id) === pkgId);
      if (p) setPkg(p);
    }
  }, [pkgId]);

  // Fallback fetch if needed
  useEffect(() => {
    let alive = true;
    (async () => {
      if (event && pkg) return;
      try {
        const res = await fetch(`${API_BASE}/packages`);
        const data = await res.json();
        const pkgs = Array.isArray(data) ? data : (data?.packages || []);
        const evt = Array.isArray(data) ? null : (data?.event || null);
        if (!alive) return;
        if (!event && evt) setEvent(evt);
        if (!pkg) {
          const p = pkgs.find((x) => Number(x.id) === pkgId);
          if (p) setPkg(p);
        }
      } catch (e) { console.error(e); }
    })();
    return () => { alive = false; };
  }, [pkgId, event, pkg]);

  if (!pkg) {
    return (
      <main className="section bg-cream">
        <div className="container max-w-4xl">
          <div className="card p-6">
            <div className="text-xl font-semibold">Package not found</div>
            <div className="mt-3">
              <Link className="btn bg-slate-100" to="/">Back to Packages</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section bg-cream">
      <div className="container max-w-5xl space-y-6">
        {event && (
          <div className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="text-slate-500 text-xs tracking-wider">EVENT</div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
                  {event.name} <span className="opacity-60">({event.year})</span>
                </h1>
                <div className="text-sm text-slate-600 mt-1">{event.location}</div>
              </div>
              <div className="text-sm md:text-base bg-black text-white rounded-xl px-4 py-2 inline-flex gap-2 items-center self-start md:self-auto">
                <span>{dstr(event.start_date)}</span>
                <span className="opacity-50">→</span>
                <span>{dstr(event.end_date)}</span>
              </div>
            </div>

            {event.description && <p className="mt-3 text-slate-700">{event.description}</p>}

            {Array.isArray(event.days) && event.days.length > 0 && (
              <div className="mt-4">
                <div className="text-slate-500 text-xs tracking-wider mb-2">SCHEDULE</div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {event.days
                    .slice()
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((d) => (
                      <div key={d.id} className="min-w-[220px] rounded-xl bg-slate-50 border border-slate-200 p-3">
                        <div className="text-xs text-slate-500">{dstr(d.date)}</div>
                        <div className="font-semibold">{d.title || "Day"}</div>
                        {d.subtitle && <div className="text-xs text-slate-600">{d.subtitle}</div>}
                        {d.description && (
                          <div className="mt-1 text-xs text-slate-500 line-clamp-3">{d.description}</div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{pkg.name}</h2>
            <div className="text-lg font-bold text-emerald-700">₹{fmt(pkg.price_inr)}</div>
          </div>
          <p className="mt-1 text-slate-700">{pkg.description}</p>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <div className="text-xs text-slate-500">Base Includes</div>
              <div className="font-semibold">{pkg.base_includes} person</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <div className="text-xs text-slate-500">Extra Adult</div>
              <div className="font-semibold">
                {pkg.extra_price_adult_inr ? `₹${fmt(pkg.extra_price_adult_inr)}` : "Base price"}
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <div className="text-xs text-slate-500">Kids</div>
              <div className="font-semibold">
                ≤{pkg.child_free_max_age}: Free · ≤{pkg.child_half_max_age}: {Math.round((pkg.child_half_multiplier || 0.5) * 100)}%
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <div className="text-xs text-slate-500">Status</div>
              <div className="font-semibold">{pkg.active ? "Active" : "Inactive"}</div>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <Link className="btn bg-slate-100" to="/">Back</Link>
            <Link
              className="btn btn-primary"
              to="/booking"
              state={{ package_id: pkg.id, package: pkg.name }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
