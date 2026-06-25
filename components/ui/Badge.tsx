import { cn } from '@/lib/utils';

export function Badge({ className, children }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('inline-flex items-center rounded-full border border-forest-200 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-forest-700', className)}>
      {children}
    </span>
  );
}