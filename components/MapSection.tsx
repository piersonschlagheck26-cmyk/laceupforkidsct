'use client'

const locations = [
  {
    name: 'First Congregational Church',
    address: '122 Broad Street, Guilford, CT',
    description: 'Drop your shoe donations inside the lobby collection box on the Green.',
  },
  {
    name: 'Guilford Racquet & Swim Club',
    address: '420 Church Street, Guilford, CT',
    description: 'Leave your donations with reception; volunteers collect them weekly.',
  },
]

export default function MapSection() {
  return (
    <section id="drop-off" className="section-padding bg-gradient-to-br from-white via-primary-50/60 to-accent-50/40">
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

        <div className="max-w-3xl mx-auto space-y-6">
          {locations.map((location) => (
            <div key={location.name} className="card text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{location.name}</h3>
              <p className="text-accent-600 font-semibold mb-2">{location.address}</p>
              <p className="text-gray-600 leading-relaxed">{location.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-600 italic">
          Want to host a donation bin at your business or school? Contact us and we’ll set one up together.
        </p>
      </div>
    </section>
  )
}
