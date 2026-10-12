import { cn } from '../../utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
}

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Cargando..."
      className={cn(
        'rounded-full border-primary-200 border-t-primary animate-spin',
        sizes[size],
        className
      )}
    />
  )
}
