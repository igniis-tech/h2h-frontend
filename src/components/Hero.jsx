// import React from 'react'
// import { Link } from 'react-router-dom'

// export default function Hero() {
//   return (
//     <section id="about" className="relative h-[84vh] grid place-items-center overflow-hidden">
//       <img
//         src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop"
//         alt="mountain tents"
//         className="absolute inset-0 w-full h-full object-cover"
//       />
//       {/* subtle gradient to keep text readable but keep the bright feel */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/20" />

//       <div className="relative z-10 text-center text-white max-w-3xl px-4">
//         <h1
//           className="text-6xl md:text-7xl mb-2 tracking-widest"
//           style={{ fontFamily: '"Permanent Marker", cursive' }}
//         >
//           HIGHWAY TO HEAL
//         </h1>
//         <p className="text-base md:text-lg text-white/90">
//           Unwind. Reconnect. Discover. Your Week-Long Mountain Escape Awaits.
//         </p>

//         <Link to="/booking" className="btn-dark mt-4">
//           Book Your Hill Escape
//         </Link>

//         {/* dots under hero, center-aligned */}
//         <div className="dots">
//           <span className="active"></span>
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>
//       </div>
//     </section>
//   )
// }
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop",
    title: "HIGHWAY TO HEAL",
    blurb: "Unwind. Reconnect. Discover. Your Week-Long Mountain Escape Awaits.",
  },
  {
    img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1920&auto=format&fit=crop",
    title: "THE JOURNEY",
    blurb: "Mindful treks, bonfires, starry skies—curated for deep reset.",
  },
  {
    img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1920&auto=format&fit=crop",
    title: "EVENT DETAILS",
    blurb: "7 days • Guided sessions • Local stays • Limited slots.",
  },
  {
    img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1920&auto=format&fit=crop",
    title: "RECONNECT",
    blurb: "Step away from noise—step into your breath and the hills.",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const startX = useRef(null);
  const containerRef = useRef(null);

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const goTo = (i) => setIndex(clamp(i, 0, slides.length - 1));
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Arrow keys
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  // Pointer/drag handlers
  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startX.current = e.clientX;
    setDragX(0);
  };
  const onPointerMove = (e) => {
    if (startX.current == null) return;
    setDragX(e.clientX - startX.current);
  };
  const onPointerUp = () => {
    if (startX.current == null) return;
    const w = containerRef.current?.clientWidth || 300;
    const threshold = w * 0.15; // 15% swipe
    if (dragX <= -threshold) next();
    else if (dragX >= threshold) prev();
    setDragX(0);
    startX.current = null;
  };

  return (
    <section id="about" className="relative h-[84vh] overflow-hidden">
      {/* Slides track */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="h-full flex"
          style={{
            transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
            transition: startX.current ? "none" : "transform 400ms ease",
            willChange: "transform",
          }}
        >
          {slides.map((s, i) => (
            <div key={i} className="relative h-full w-full shrink-0 grid place-items-center">
              <img
                src={s.img}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
              <div className="relative z-10 text-center text-white max-w-3xl px-4">
                <h1
                  className="text-5xl md:text-7xl mb-2 tracking-widest"
                  style={{ fontFamily: '"Permanent Marker", cursive' }}
                >
                  {s.title}
                </h1>
                <p className="text-base md:text-lg text-white/90">{s.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar: CTA + dots */}
      <div className="absolute inset-x-0 bottom-6 sm:bottom-8 z-20 flex flex-col items-center gap-3">
        <Link to="/booking" className="btn-dark">
          Book Your Hill Escape
        </Link>

        <div className="flex items-center gap-2" aria-label="hero slides">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition
                ${i === index ? "bg-white/90" : "bg-white/50 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
