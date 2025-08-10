'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const indicatorVariants = cva(
  'rounded-full border-2 border-background',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        success: 'bg-green-500',
        destructive: 'bg-red-500',
      },
      size: {
        sm: 'h-2 w-2',
        md: 'h-3 w-3',
        lg: 'h-4 w-4',
      },
      pulse: {
        true: 'animate-pulse',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      pulse: false,
    },
  }
)

interface IndicatorProps 
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof indicatorVariants> {}

const Indicator = React.forwardRef<HTMLSpanElement, IndicatorProps>(
  ({ className, variant, size, pulse, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(indicatorVariants({ variant, size, pulse, className }))}
        {...props}
      />
    )
  }
)
Indicator.displayName = 'Indicator'

export { Indicator, indicatorVariants }