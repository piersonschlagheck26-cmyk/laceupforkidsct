'use client'

import Image from 'next/image'

const locations = [
  {
    name: 'First Congregational Church',
    address: '122 Broad Street, Guilford, CT',
    description: 'Located in the heart of Guilford on the Green. Drop your shoe donations inside the main lobby collection box.',
  },
  {
    name: 'Guilford Racquet & Swim Club',
    address: '420 Church Street, Guilford, CT',
    description: 'Leave your donations at the reception area—our volunteers pick them up weekly.',
  },
]

export default function MapSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-white via-primary-50/60 to-accent-50/40">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-primary-200/80 text-ember-900 uppercase tracking-wider mb-4">
            Donation Drop-Off Points
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Where to Bring Your Shoes</h2>
          <p className="text-lg text-gray-700">
            These are our current Lace Up for Kids donation boxes in Guilford, Connecticut. Drop your gently used sneakers at either location anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="card h-full">
            <div className="overflow-hidden rounded-2xl border border-white/60 shadow-lg">
              <Image
                src="/images/guilford-map-placeholder.svg"
                alt="Map of Guilford, CT showing donation box locations"
                width={800}
                height={650}
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="mt-4 text-sm text-gray-600 italic">
              These collection boxes are open during each partner’s regular hours—drop your sneakers inside the clearly marked Lace Up for Kids bin.
            </p>
          </div>

          <div className="space-y-6">
            {locations.map((location) => (
              <div key={location.name} className="card text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{location.name}</h3>
                <p className="text-accent-600 font-semibold mb-2">{location.address}</p>
                <p className="text-gray-600 leading-relaxed">{location.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
