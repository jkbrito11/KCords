import type { JSX } from 'preact'
import { cn } from '../../lib/utils'

type SelectProps = JSX.IntrinsicElements['select']

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-9 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 outline-none ring-offset-zinc-950 focus-visible:ring-2 focus-visible:ring-amber-500',
        className,
      )}
      {...props}
    />
  )
}
