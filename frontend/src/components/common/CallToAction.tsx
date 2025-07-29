import { Button } from "@/components/ui/button"
import { COLORS } from "@/lib/constants"

export function CallToAction() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="text-left">
        <h2 className={`text-3xl md:text-4xl font-bold text-[${COLORS.text.primary}] leading-tight`}>
          "Hope grows when we give
          <br />
          <span className="ml-16">as one."</span>
        </h2>
      </div>

      <div className="flex gap-4">
        <Button className={`bg-[${COLORS.primary}] hover:bg-[${COLORS.primaryHover}] text-white rounded-full px-8 py-3`}>
          Add Request
        </Button>
        <Button className={`bg-[${COLORS.primary}] hover:bg-[${COLORS.primaryHover}] text-white rounded-full px-8 py-3`}>
          Donate Now
        </Button>
      </div>
    </div>
  )
}