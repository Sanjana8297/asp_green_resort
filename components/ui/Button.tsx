import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
};

export function Button({ className, variant = 'primary', href, children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forest-700 focus:ring-offset-2';
  const variants = {
    primary: 'bg-forest-700 text-white hover:bg-forest-800 shadow-soft',
    secondary: 'bg-gold text-white hover:opacity-90',
    ghost: 'bg-white/70 text-forest-800 hover:bg-white'
  } as const;

  if (href) {
    return (
      <Link href={href} className={cn(base, variants[variant], className)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}