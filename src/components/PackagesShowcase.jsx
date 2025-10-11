// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Link } from "react-router-dom";

// // Replace if you already export this in src/api.js
// const API_BASE = import.meta.env.VITE_API_BASE || "https://h2h-backend-vpk9.vercel.app/api";
// async function fetchPackages() {
//   const res = await fetch(`${API_BASE}/packages`);
//   if (!res.ok) throw new Error(`Failed to fetch packages: ${res.status}`);
//   return res.json();
// }

// // Optional: cover image to match the “poster” vibe
// const COVER =
//   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop";

// // Image suggestions per package (swap with your own if you have)
// const PKG_IMAGES = {
//   Tent: "https://images.unsplash.com/photo-1504280390368-3971f660c181?q=80&w=1200&auto=format&fit=crop",
//   Swiss: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
//   Room: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2101f?q=80&w=1200&auto=format&fit=crop",
// };

// export default function PackagesShowcase() {
//   const [items, setItems] = useState([]);
//   const [i, setI] = useState(0); // current center index
//   const [dragX, setDragX] = useState(0);
//   const startX = useRef(null);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const data = await fetchPackages();
//         const active = data.filter(p => p.active);
//         if (!alive) return;
//         // Keep only Tent/Swiss/Room order if available
//         const order = ["Tent", "Swiss", "Room"];
//         const sorted = [...active].sort(
//           (a, b) => order.indexOf(a.name) - order.indexOf(b.name)
//         );
//         setItems(sorted.slice(0, 3));
//         if (sorted.length) setI(1); // start with middle selected (nice effect)
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//     return () => { alive = false; };
//   }, []);

//   const next = () => setI(v => Math.min(v + 1, (items.length || 1) - 1));
//   const prev = () => setI(v => Math.max(v - 1, 0));

//   // Keyboard support
//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "ArrowRight") next();
//       if (e.key === "ArrowLeft") prev();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [items.length]);

//   // Drag/swipe
//   const onDown = (e) => {
//     e.currentTarget.setPointerCapture?.(e.pointerId);
//     startX.current = e.clientX;
//     setDragX(0);
//   };
//   const onMove = (e) => {
//     if (startX.current == null) return;
//     setDragX(e.clientX - startX.current);
//   };
//   const onUp = () => {
//     if (startX.current == null) return;
//     const threshold = 60; // px
//     if (dragX <= -threshold) next();
//     else if (dragX >= threshold) prev();
//     setDragX(0);
//     startX.current = null;
//   };

//   const dots = useMemo(() => Array.from({ length: items.length }), [items.length]);

//   return (
//     <section className="relative overflow-hidden">
//       {/* Background cover */}
//       <img src={COVER} alt="" className="absolute inset-0 w-full h-full object-cover" />
//       <div className="absolute inset-0 bg-black/40" />

//       <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-16">
//         {/* Header like poster */}
//         <div className="text-center text-white">
//           <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/30 text-sm tracking-wide mb-4">
//             CONTACT US
//           </div>
//           <h2
//             className="text-4xl md:text-6xl font-extrabold tracking-[0.2em] leading-none"
//             style={{ fontFamily: '"Permanent Marker", cursive' }}
//           >
//             PACKAGES
//           </h2>
//           <div className="text-lg md:text-xl mt-1 opacity-90 tracking-widest">
//             — LOVE AT FIRST SIGHT —
//           </div>

//           <div className="inline-block bg-white/90 text-slate-900 rounded-2xl px-5 py-2 mt-4">
//             Choose your escape—say yes to paradise!
//           </div>
//         </div>

//         {/* Carousel row */}
//         <div
//           className="mt-8 md:mt-10"
//           onPointerDown={onDown}
//           onPointerMove={onMove}
//           onPointerUp={onUp}
//           onPointerCancel={onUp}
//         >
//           <div className="flex items-end justify-center gap-4 md:gap-6">
//             {items.map((p, idx) => {
//               const selected = idx === i;
//               // style: center card larger & lifted; sides slightly smaller
//               const base =
//                 "rounded-2xl overflow-hidden bg-white/95 backdrop-blur border border-white/40 shadow-xl transition-all duration-300";
//               const scale = selected ? "scale-[1.06]" : "scale-[0.94]";
//               const lift = selected ? "-translate-y-2" : "translate-y-0 opacity-90";
//               const w = selected ? "w-[260px] md:w-[320px]" : "w-[200px] md:w-[240px]";

//               const PKG_IMAGES = {
//                 Tent: "https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg",
//                 Swiss: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
//                 Room: "https://pix8.agoda.net/hotelImages/34244526/-1/85086b7919064ea18c68a36220862031.jpg?ce=0&s=1024x",
//               };
//               return (
//                 <button
//                   key={p.id}
//                   type="button"
//                   onClick={() => setI(idx)}
//                   className={`${base} ${scale} ${lift} ${w} text-left`}
//                 >
//                   <div className="aspect-[4/5] w-full">
//                     <img src={img} alt={p.name} className="w-full h-full object-cover" />
//                   </div>
//                   <div className="p-3 md:p-4">
//                     <div className="flex items-center justify-between">
//                       <h3 className="text-lg md:text-xl font-semibold text-slate-900">{p.name}</h3>
//                       <span className="text-sm md:text-base font-semibold text-emerald-700">
//                         ₹{p.price_inr.toLocaleString("en-IN")}
//                       </span>
//                     </div>
//                     <p className="text-xs md:text-sm text-slate-600 mt-1">{p.description}</p>

//                     {selected && (
//                       <Link
//                         to="/booking"
//                         state={{ package_id: p.id, package: p.name }}
//                         className="inline-block mt-3 md:mt-4 px-4 py-2 rounded-full bg-black/80 text-white hover:bg-black"
//                       >
//                         Book Now
//                       </Link>
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Dots */}
//         <div className="mt-6 flex justify-center gap-2">
//           {dots.map((_, di) => (
//             <button
//               key={di}
//               aria-label={`Go to package ${di + 1}`}
//               onClick={() => setI(di)}
//               className={`h-2.5 w-2.5 rounded-full transition
//                 ${di === i ? "bg-white" : "bg-white/50 hover:bg-white/80"}`}
//             />
//           ))}
//         </div>

//         {/* Website footer line like poster */}
//         <div className="mt-6 text-center text-white/90 tracking-widest text-sm">
//           www.highwaytoheal.com
//         </div>
//       </div>
//     </section>
//   );
// }
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "https://h2h-backend-vpk9.vercel.app/api";
async function fetchPackages() {
  const res = await fetch(`${API_BASE}/packages`);
  if (!res.ok) throw new Error(`Failed to fetch packages: ${res.status}`);
  return res.json();
}

const COVER =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop";

// ✅ your provided images
const PKG_IMAGES = {
  Tent: "https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg",
  Swiss:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
  Room:
    "https://pix8.agoda.net/hotelImages/34244526/-1/85086b7919064ea18c68a36220862031.jpg?ce=0&s=1024x",
};

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop";

export default function PackagesShowcase() {
  const [items, setItems] = useState([]);
  const [i, setI] = useState(0);
  const [dragX, setDragX] = useState(0);
  const startX = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await fetchPackages();
        const active = (data || []).filter((p) => p.active);
        if (!alive) return;

        const order = ["Tent", "Swiss", "Room"];
        const sorted = [...active].sort(
          (a, b) => order.indexOf(a.name) - order.indexOf(b.name)
        );
        setItems(sorted.slice(0, 3));
        setI(sorted.length >= 2 ? 1 : 0); // start with middle if possible
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const next = () => setI((v) => Math.min(v + 1, (items.length || 1) - 1));
  const prev = () => setI((v) => Math.max(v - 1, 0));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length]);

  const onDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startX.current = e.clientX;
    setDragX(0);
  };
  const onMove = (e) => {
    if (startX.current == null) return;
    setDragX(e.clientX - startX.current);
  };
  const onUp = () => {
    if (startX.current == null) return;
    const threshold = 60;
    if (dragX <= -threshold) next();
    else if (dragX >= threshold) prev();
    setDragX(0);
    startX.current = null;
  };

  const dots = useMemo(() => Array.from({ length: items.length }), [items.length]);

  return (
    <section className="relative overflow-hidden">
      <img src={COVER} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center text-white">
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/30 text-sm tracking-wide mb-4">
            CONTACT US
          </div>
          <h2
            className="text-4xl md:text-6xl font-extrabold tracking-[0.2em] leading-none"
            style={{ fontFamily: '"Permanent Marker", cursive' }}
          >
            PACKAGES
          </h2>
          <div className="text-lg md:text-xl mt-1 opacity-90 tracking-widest">
            — LOVE AT FIRST SIGHT —
          </div>
          <div className="inline-block bg-white/90 text-slate-900 rounded-2xl px-5 py-2 mt-4">
            Choose your escape—say yes to paradise!
          </div>
        </div>

        <div
          className="mt-8 md:mt-10"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <div className="flex items-end justify-center gap-4 md:gap-6">
            {items.map((p, idx) => {
              const selected = idx === i;

              const base =
                "rounded-2xl overflow-hidden bg-white/95 backdrop-blur border border-white/40 shadow-xl transition-all duration-300";
              const scale = selected ? "scale-[1.06]" : "scale-[0.94]";
              const lift = selected ? "-translate-y-2" : "translate-y-0 opacity-90";
              const w = selected ? "w-[260px] md:w-[320px]" : "w-[200px] md:w-[240px]";

              // ✅ define the variable BEFORE JSX use
              const cardImg = PKG_IMAGES[p.name] || DEFAULT_IMG;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setI(idx)}
                  className={`${base} ${scale} ${lift} ${w} text-left`}
                >
                  <div className="aspect-[4/5] w-full">
                    <img src={cardImg} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg md:text-xl font-semibold text-slate-900">{p.name}</h3>
                      <span className="text-sm md:text-base font-semibold text-emerald-700">
                        ₹{p.price_inr.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 mt-1">{p.description}</p>

                    {selected && (
                      <Link
                        to="/booking"
                        state={{ package_id: p.id, package: p.name }}
                        className="inline-block mt-3 md:mt-4 px-4 py-2 rounded-full bg-black/80 text-white hover:bg-black"
                      >
                        Book Now
                      </Link>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {dots.map((_, di) => (
            <button
              key={di}
              aria-label={`Go to package ${di + 1}`}
              onClick={() => setI(di)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                di === i ? "bg-white" : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 text-center text-white/90 tracking-widest text-sm">
          www.highwaytoheal.com
        </div>
      </div>
    </section>
  );
}
