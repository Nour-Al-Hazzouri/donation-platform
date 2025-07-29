import { Button } from "@/components/ui/button"
import { COLORS } from "@/lib/constants"

export function CallToAction() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="text-center md:text-left w-full md:w-auto">
        <h2 className={`text-3xl md:text-4xl font-bold text-[${COLORS.text.primary}] leading-tight`}>
          "Hope grows when we give
          <br className="hidden sm:block" />
          <span className="sm:ml-16 block sm:inline">as one."</span>
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button className={`bg-[${COLORS.primary}] hover:bg-[${COLORS.primaryHover}] text-white rounded-full px-8 py-3 w-full sm:w-auto`}>
          Add Request
        </Button>
        <Button className={`bg-[${COLORS.primary}] hover:bg-[${COLORS.primaryHover}] text-white rounded-full px-8 py-3 w-full sm:w-auto`}>
          Donate Now
        </Button>
      </div>
    </div>
  )
}