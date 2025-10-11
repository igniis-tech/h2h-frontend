import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-forest text-white">
      <div className="container py-10 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="text-xl font-heading font-semibold">Questions? Get In Touch!</div>
          <p className="opacity-80">Email: <a href="mailto:info@highwaytohill.com" className="underline">info@highwaytohill.com</a> • Phone: +91-98765-43210</p>
        </div>
        <div className="justify-self-end opacity-80 text-sm">
          © 2025 Highway to Heal. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
