import { cva, type VariantProps } from 'class-variance-authority'
import type { JSX } from 'preact'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-amber-500 text-zinc-950 hover:bg-amber-400 focus-visible:ring-amber-500',
        secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus-visible:ring-zinc-500',
        outline: 'border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 focus-visible:ring-zinc-500',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = JSX.IntrinsicElements['button'] & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
