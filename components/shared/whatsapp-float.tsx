'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export function WhatsAppFloat() {
  const [isHovered, setIsHovered] = useState(false)

  const contacts = [
    { name: 'Admin', number: '6285813718988' },
    { name: 'Owner', number: '6282139659136' }
  ]

  const message = encodeURIComponent('Halo, saya tertarik dengan layanan sewa alat berat Anda.')

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-4 z-50"
    >
      {/* Contact Options - Show on Hover */}
      <div
        className={`mb-3 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        {contacts.map((contact) => (
          <Link
            key={contact.number}
            href={`https://wa.me/${contact.number}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
              <Image
                src="/whatsapp.svg"
                alt="WhatsApp"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </div>
            <div className="pr-2">
              <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
              <p className="text-xs text-slate-600">Chat via WhatsApp</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main WhatsApp Button */}
      <button
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition-all hover:scale-110 hover:bg-green-600 hover:shadow-xl"
        aria-label="Contact us on WhatsApp"
      >
        <Image
          src="/whatsapp.svg"
          alt="WhatsApp"
          width={32}
          height={32}
          className="h-8 w-8"
        />
      </button>
    </div>
  )
}
