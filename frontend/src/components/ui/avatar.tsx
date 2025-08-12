'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

interface AvatarProps 
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ size, className }))}
        {...props}
      />
    )
  }
)
Avatar.displayName = 'Avatar'

const avatarImageVariants = cva('aspect-square h-full w-full', {
  variants: {
    fit: {
      cover: 'object-cover',
      contain: 'object-contain',
    },
  },
  defaultVariants: {
    fit: 'cover',
  },
})

interface AvatarImageProps 
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof avatarImageVariants> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, fit, ...props }, ref) => {
    return (
      <img
        ref={ref}
        className={cn(avatarImageVariants({ fit, className }))}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = 'AvatarImage'

const avatarFallbackVariants = cva(
  'flex h-full w-full items-center justify-center rounded-full bg-muted',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface AvatarFallbackProps 
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarFallbackVariants> {}

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(avatarFallbackVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback, avatarVariants }