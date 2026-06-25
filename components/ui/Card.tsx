import { cn } from '@/lib/utils';

export function Card({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur-sm', className)}>{children}</div>;
}