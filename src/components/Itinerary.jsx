import React, { useState } from 'react'

const DAYS = [
  ['Arrival & Welcome','Settle in, sip warm tea, and meet fellow travelers.'],
  ['Mountain Trails & Melodies','Gentle trek by day, acoustic jam by night.'],
  ['Serene Lakes & Stargazing','Picnic by turquoise waters and telescopes after dusk.'],
  ['Cultural Immersion & Local Delights','Handicrafts, folk stories, and farm-to-table dinner.'],
  ['Adventure & Adrenaline (Optional)','Ziplining, river-rafting, or a scenic bike loop.'],
  ['Photography Workshop & Reflection','Capture the magic and share travel tales.'],
  ['Farewell & Memories','Group breakfast & photo exchange.']
]

export default function Itinerary(){
  const [open, setOpen] = useState(null)
  return (
    <section className="section relative">
      <div className="absolute inset-0 -z-10">
        <img src="https://junglecamp.in/uploads/2025/05/most-peaceful-place-in-north-india-where-serenity-feels-effortless.webp" className="w-full h-full object-cover opacity-40" />
      </div>
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-forest">A Week of Pure Bliss: Itinerary Highlights</h2>
        <div className="mt-6 bg-white/80 backdrop-blur rounded-2xl p-4 md:p-6 shadow-soft">
          {DAYS.map(([title,body],i)=>(
            <details key={i} open={open===i} onToggle={(e)=> setOpen(e.target.open?i:null)} className="group border-b last:border-b-0">
              <summary className="cursor-pointer flex items-center justify-between py-3 font-medium">
                <span>Day {i+1}: {title}</span>
                <span className="text-xl group-open:rotate-45 transition">+</span>
              </summary>
              <div className="pb-4 text-slate-600">{body}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
