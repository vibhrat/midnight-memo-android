
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        note: "border-transparent text-gray-700",
        medicine: "border-transparent text-gray-700",
        travel: "border-transparent text-gray-700",
        tech: "border-transparent text-gray-700",
        links: "border-transparent text-gray-700",
        contact: "border-transparent text-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  tag?: string;
}

const getTagStyle = (tag: string) => {
  const styles = {
    'Note': {
      background: 'linear-gradient(135deg, #E8F4FD 0%, #B8E6FF 100%)',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)'
    },
    'Medicine': {
      background: 'linear-gradient(135deg, #FFE8E8 0%, #FFB8B8 100%)',
      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)'
    },
    'Travel': {
      background: 'linear-gradient(135deg, #E8F5E8 0%, #B8E6B8 100%)',
      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.15)'
    },
    'Tech': {
      background: 'linear-gradient(135deg, #F3E8FF 0%, #D8B4FE 100%)',
      boxShadow: '0 2px 8px rgba(147, 51, 234, 0.15)'
    },
    'Links': {
      background: 'linear-gradient(135deg, #FFF3E0 0%, #FFCC80 100%)',
      boxShadow: '0 2px 8px rgba(245, 124, 0, 0.15)'
    },
    'Contact': {
      background: 'linear-gradient(135deg, #E0F2F1 0%, #80CBC4 100%)',
      boxShadow: '0 2px 8px rgba(0, 121, 107, 0.15)'
    }
  };
  return styles[tag as keyof typeof styles] || {};
};

const getTagEmoji = (tag: string) => {
  const emojis = {
    'Note': '📝',
    'Medicine': '💊',
    'Travel': '✈️',
    'Tech': '💻',
    'Links': '🔗',
    'Contact': '📱'
  };
  return emojis[tag as keyof typeof emojis] || '';
};

function Badge({ className, variant, tag, children, ...props }: BadgeProps) {
  const tagStyle = tag ? getTagStyle(tag) : {};
  const emoji = tag ? getTagEmoji(tag) : '';
  
  return (
    <div 
      className={cn(badgeVariants({ variant: tag ? variant : "default" }), className)} 
      style={tagStyle}
      {...props}
    >
      {emoji && <span className="mr-1">{emoji}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
