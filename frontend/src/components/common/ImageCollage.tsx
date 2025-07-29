import Image from "next/image"

export function ImageCollage() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      <div className="transform rotate-[-8deg] hover:rotate-0 transition-transform duration-300">
        <Image
          src="/file.svg"
          alt="Community sharing books"
          width={250}
          height={300}
          className="rounded-lg shadow-lg object-cover bg-blue-100 p-8"
        />
      </div>
      <div className="transform rotate-[4deg] hover:rotate-0 transition-transform duration-300 mt-8">
        <Image
          src="/globe.svg"
          alt="Clothing donations"
          width={250}
          height={300}
          className="rounded-lg shadow-lg object-cover bg-green-100 p-8"
        />
      </div>
      <div className="transform rotate-[-6deg] hover:rotate-0 transition-transform duration-300">
        <Image
          src="/window.svg"
          alt="Food donations"
          width={250}
          height={300}
          className="rounded-lg shadow-lg object-cover bg-yellow-100 p-8"
        />
      </div>
      <div className="transform rotate-[8deg] hover:rotate-0 transition-transform duration-300 mt-4">
        <Image
          src="/vercel.svg"
          alt="Donation box"
          width={250}
          height={300}
          className="rounded-lg shadow-lg object-cover bg-purple-100 p-8"
        />
      </div>
    </div>
  )
}