import Concert from "../assets/concert.JPG";
import CampFire from "../assets/camp-fire.jpeg";
import React from 'react'

const FEATURES = [
  { title: 'Open Air Music Concerts', img: Concert , desc:'Groove beneath starlit skies with soulful live melodies.'},
  { title: 'Sunrise Treks', img: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop', desc:'Witness golden horizons on gentle, scenic trails.'},
  { title: 'Night Fun & Fire', img: CampFire, desc:'Cozy bonfires & storytelling under a million stars.'},
  { title: 'Pure Nature Immersion', img: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1000&auto=format&fit=crop', desc:'Lakes, forests & serene moments to recharge.'},
]

export default function Highlights(){
  return (
    <section id="journey" className="section bg-cream">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-forest mb-10">Your Unforgettable Journey Begins</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f,i)=>(
            <article key={i} className="card flex gap-4">
              <img src={f.img} alt={f.title} className="w-40 h-36 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{f.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
