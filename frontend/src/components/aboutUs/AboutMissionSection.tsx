import Image from "next/image"

export default function AboutMissionSection() {
  return (
    <section className="bg-white py-12 sm:py-14 md:py-16 px-4 xs:px-6 sm:px-8 lg:px-10 xl:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
          {/* Image - Increased height slightly */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg w-full max-w-md sm:max-w-lg md:w-4/5 lg:w-full h-[340px] sm:h-[380px] md:h-[400px]">
              <Image
                 src="/aboutUs.png"
                alt="Community volunteers helping those in need"
                width={600}
                height={400}
                className="w-full h-full object-cover object-center"
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2 flex flex-col justify-between h-full">
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <h2 className="text-2.5xl xs:text-3xl sm:text-3.5xl md:text-4xl font-bold text-gray-900 leading-tight">
                Make a Difference,
                <br />
                Support Those in Need.
              </h2>
              
              <p className="text-gray-600 text-sm sm:text-base md:text-[1.0625rem] leading-relaxed sm:leading-loose">
                At GiveLeb, your generosity—whether a donation, a shared post, or an hour of your time—becomes a lifeline for families in Lebanon. Together, we transform compassion into real change, ensuring no one struggles alone. Because in our darkest moments, it's the light we create together that guides us forward. Join the movement. Be the hope.
              </p>
            </div>

            {/* Signature - This will now align better with the image bottom */}
            <div className="pt-3 sm:pt-4 flex items-end gap-4">
              <div className="space-y-1">
                <p className="text-gray-600 text-sm font-medium">
                  GiveLeb
                </p>
                <p className="text-gray-600 text-sm">
                  Team
                </p>
              </div>
              <div className="relative w-24 sm:w-28 md:w-32 h-12 sm:h-14 md:h-16">
                <Image
                  src="/giveLeb_Signature.png"
                  alt="GiveLeb Signature"
                  fill
                  className="object-contain object-left"
                  sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}