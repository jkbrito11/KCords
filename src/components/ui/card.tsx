import type { JSX } from 'preact'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg', className)} {...props} />
}

export function CardTitle({ className, ...props }: JSX.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-sm font-semibold tracking-wide text-zinc-200', className)} {...props} />
}
