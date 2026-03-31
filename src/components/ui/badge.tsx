import type { JSX } from 'preact'
import { cn } from '../../lib/utils'

export function Badge({ className, ...props }: JSX.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-200',
        className,
      )}
      {...props}
    />
  )
}
