import React from 'react'
import Hero from '../components/Hero'
import Highlights from '../components/Highlights'
import Itinerary from '../components/Itinerary'
import PackagesShowcase from '../components/PackagesShowcase'

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="section py-16 md:py-24 bg-white">
        <div className="container mx-auto max-w-[980px] px-6">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-forest">
            Far Away from the Disturbances…
          </h2>

          <p className="mt-6 text-lg md:text-xl leading-8 text-slate-700">
            Imagine a place where time slows down, where the only sounds are the rustling leaves and melodies of
            distant birds. <span className="font-semibold">Highway to Heal</span> offers a unique week-long escape to
            the serene embrace of a spirit-soothing Himalayan valley.
          </p>

          <p className="mt-5 text-lg md:text-xl leading-8 text-slate-700">
            Leave behind the city’s chaos and immerse yourself in the tranquility of nature. Here, it’s just you,
            misty mountains, and the soothing rhythm of the wild. Discover, to truly reconnect with yourself and the
            natural world.
          </p>
        </div>
      </section>

      <Highlights />
      <Itinerary />
      <PackagesShowcase />
      <section id="contact" className="section bg-cream">
        <div className="container max-w-2xl">
          <h2 className="text-3xl font-bold text-forest mb-4">Questions? Get In Touch!</h2>
          <form className="card p-6 grid gap-3">
            <input className="input" placeholder="Your Name" />
            <input className="input" placeholder="Your Email" />
            <textarea className="input min-h-[120px]" placeholder="Your Message"></textarea>
            <button className="btn btn-primary self-start">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  )
}
// import React from "react";
// import Hero from "../components/Hero";
// import Highlights from "../components/Highlights";
// import Band from "../components/Band";
// import Itinerary from "../components/Itinerary";

// export default function Home() {
//   return (
//     <main className="min-h-screen">
//       <Hero />

//       {/* Fixed-size block: 962.4 × 620.25 on md+ screens */}
//       <section className="section">
//         <div className="container mx-auto">
//           <div
//             className="mx-auto w-full md:w-[962.4px] md:h-[620.25px] px-6 md:px-10 py-8 md:py-12
//                        flex flex-col justify-center bg-white rounded-2xl shadow-sm"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold text-forest">
//               Far Away from the Disturbances…
//             </h2>
//             <p className="mt-4 text-slate-700">
//               Imagine a place where time slows down, where the only sounds are the rustling leaves and melodies of
//               distant birds. Highway to Heal offers a unique week-long escape to the serene embrace of a spirit-
//               soothing Himalayan valley.
//             </p>
//             <p className="mt-3 text-slate-700">
//               Leave behind the city’s chaos and immerse yourself in the tranquility of nature. Here, it’s just you,
//               misty mountains, and the soothing rhythm of the wild. Discover, to truly reconnect with yourself and the
//               natural world.
//             </p>
//           </div>
//         </div>
//       </section>

//       <Highlights />
//       <Band />
//       <Itinerary />

//       {/* Contact */}
//       <section id="contact" className="section bg-cream">
//         <div className="container max-w-2xl">
//           <h2 className="text-3xl font-bold text-forest mb-4">Questions? Get In Touch!</h2>
//           <form className="card p-6 grid gap-3">
//             <input className="input" placeholder="Your Name" />
//             <input className="input" placeholder="Your Email" />
//             <textarea className="input min-h-[120px]" placeholder="Your Message" />
//             <button className="btn btn-primary self-start">Send Message</button>
//           </form>
//         </div>
//       </section>
//     </main>
//   );
// }
