'use client'

import Image from 'next/image'

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
  {
    name: 'Nathanael B. Greene Community Center',
    address: '32 Church Street, Guilford, CT',
    description: 'Available from December 1 - December 12.',
    comingSoon: true,
  },
]

export default function MapSection() {
  return (
    <section id="drop-off" className="section-padding relative">
      {/* Background with smooth gradient transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 via-white to-gray-50"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary-50/30 to-transparent"></div>
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 uppercase tracking-wider mb-6">
            Donation Drop-Off Points
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">Where to Bring Your Shoes</h2>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed px-2">
            These are our current Lace Up for Kids donation boxes in Guilford, Connecticut. Drop your gently used sneakers at either location anytime.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
          {locations.map((location, index) => {
            if (index === 0) {
              // Location 1: Image on left
              return (
                <div key={location.name} className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
                  {/* Left Image */}
                  <div className="hidden lg:block">
                    <div className="relative w-full h-full min-h-[200px] rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src="/images/Location2.jpeg"
                        alt={location.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Location Card */}
                  <div className={`card text-left ${location.comingSoon ? 'border-2 border-accent-400 bg-accent-50/30' : ''}`}>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-2xl font-bold text-gray-900">{location.name}</h3>
                      {location.comingSoon && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-400 text-ember-900 uppercase tracking-wide">
                          COMING SOON
                        </span>
                      )}
                    </div>
                    <p className="text-accent-600 font-semibold mb-2">{location.address}</p>
                    <p className="text-gray-800 leading-relaxed">{location.description}</p>
                  </div>
                </div>
              )
            } else if (index === 1) {
              // Location 2: Image on right
              return (
                <div key={location.name} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-stretch">
                  {/* Location Card */}
                  <div className={`card text-left ${location.comingSoon ? 'border-2 border-accent-400 bg-accent-50/30' : ''}`}>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-2xl font-bold text-gray-900">{location.name}</h3>
                      {location.comingSoon && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-400 text-ember-900 uppercase tracking-wide">
                          COMING SOON
                        </span>
                      )}
                    </div>
                    <p className="text-accent-600 font-semibold mb-2">{location.address}</p>
                    <p className="text-gray-800 leading-relaxed">{location.description}</p>
                  </div>

                  {/* Right Image */}
                  <div className="hidden lg:block">
                    <div className="relative w-full h-full min-h-[200px] rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src="/images/Location1.jpeg"
                        alt={location.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )
            } else {
              // For locations without images (3rd location), show normally
              return (
                <div key={location.name} className={`card text-left max-w-3xl mx-auto ${location.comingSoon ? 'border-2 border-accent-400 bg-accent-50/30' : ''}`}>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-2xl font-bold text-gray-900">{location.name}</h3>
                    {location.comingSoon && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-400 text-ember-900 uppercase tracking-wide">
                        COMING SOON
                      </span>
                    )}
                  </div>
                  <p className="text-accent-600 font-semibold mb-2">{location.address}</p>
                  <p className="text-gray-800 leading-relaxed">{location.description}</p>
                </div>
              )
            }
          })}
        </div>

        <p className="mt-8 text-center text-sm text-gray-800 italic">
          Want to host a donation bin at your business or school? Contact us and we’ll set one up together.
        </p>
      </div>
    </section>
  )
}
