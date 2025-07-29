import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export default function Component() {
  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Header */}
      <header className="w-full px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#f90404] rounded-sm flex items-center justify-center">
              <span className="text-white text-lg font-bold">♥</span>
            </div>
            <span className="text-[#000000] text-xl font-semibold">GiveLeb</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-[#f90404] font-medium border-b-2 border-[#f90404] pb-1">
              Home
            </a>
            <a href="#" className="text-[#5a5a5a] hover:text-[#000000]">
              About us
            </a>
            <a href="#" className="text-[#5a5a5a] hover:text-[#000000]">
              Donations
            </a>
            <a href="#" className="text-[#5a5a5a] hover:text-[#000000]">
              Requests
            </a>
            <a href="#" className="text-[#5a5a5a] hover:text-[#000000]">
              Community
            </a>
            <a href="#" className="text-[#5a5a5a] hover:text-[#000000]">
              Blog
            </a>
            <a href="#" className="text-[#5a5a5a] hover:text-[#000000]">
              Contact Us
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-[#f90404] text-white border-[#f90404] hover:bg-[#d90404] rounded-full px-6"
            >
              Sign In
            </Button>
            <Button className="bg-[#f90404] hover:bg-[#d90404] text-white rounded-full px-6">Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#000000] mb-8 leading-tight">
            Give What You Can, Take What You Need – Lebanon Rises
            <br />
            When We Stand Together{" "}
            <span className="inline-block">
              <div className="w-12 h-12 bg-gradient-to-b from-[#f90404] via-white to-green-500 rounded-full inline-flex items-center justify-center border-2 border-gray-200">
                <span className="text-green-600 text-xl">🌲</span>
              </div>
            </span>
          </h1>

          {/* Email Signup */}
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5a5a5a] w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter email address"
                className="pl-10 py-3 rounded-full border-[#d9d9d9] focus:border-[#f90404]"
              />
            </div>
            <Button className="bg-[#f90404] hover:bg-[#d90404] text-white rounded-full px-8 py-3">
              Join Community
            </Button>
          </div>
        </div>

        {/* Images Collage */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="transform rotate-[-8deg] hover:rotate-0 transition-transform duration-300">
            <Image
              src="/placeholder.svg?height=300&width=250"
              alt="Community sharing books"
              width={250}
              height={300}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
          <div className="transform rotate-[4deg] hover:rotate-0 transition-transform duration-300 mt-8">
            <Image
              src="/placeholder.svg?height=300&width=250"
              alt="Clothing donations"
              width={250}
              height={300}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
          <div className="transform rotate-[-6deg] hover:rotate-0 transition-transform duration-300">
            <Image
              src="/placeholder.svg?height=300&width=250"
              alt="Food donations"
              width={250}
              height={300}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
          <div className="transform rotate-[8deg] hover:rotate-0 transition-transform duration-300 mt-4">
            <Image
              src="/placeholder.svg?height=300&width=250"
              alt="Donation box"
              width={250}
              height={300}
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000000] leading-tight">
              "Hope grows when we give
              <br />
              <span className="ml-16">as one."</span>
            </h2>
          </div>

          <div className="flex gap-4">
            <Button className="bg-[#f90404] hover:bg-[#d90404] text-white rounded-full px-8 py-3">Add Request</Button>
            <Button className="bg-[#f90404] hover:bg-[#d90404] text-white rounded-full px-8 py-3">Donate Now</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
