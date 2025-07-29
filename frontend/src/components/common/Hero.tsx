import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { COLORS } from "@/lib/constants"

export function Hero() {
  return (
    <div className="text-center mb-16">
      <h1 className={`text-4xl md:text-5xl font-bold text-[${COLORS.text.primary}] mb-8 leading-tight`}>
        Give What You Can, Take What You Need – Lebanon Rises
        <br />
        When We Stand Together{" "}
        <span className="inline-block">
          <div className={`w-12 h-12 bg-gradient-to-b from-[${COLORS.primary}] via-white to-green-500 rounded-full inline-flex items-center justify-center border-2 border-gray-200`}>
            <span className="text-green-600 text-xl">🌲</span>
          </div>
        </span>
      </h1>

      {/* Email Signup */}
      <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
        <div className="relative flex-1">
          <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-[${COLORS.text.secondary}] w-5 h-5`} />
          <Input
            type="email"
            placeholder="Enter email address"
            className={`pl-10 py-3 rounded-full border-[${COLORS.border}] focus:border-[${COLORS.primary}]`}
          />
        </div>
        <Button className={`bg-[${COLORS.primary}] hover:bg-[${COLORS.primaryHover}] text-white rounded-full px-8 py-3`}>
          Join Community
        </Button>
      </div>
    </div>
  )
}