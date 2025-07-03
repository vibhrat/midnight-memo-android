
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
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
        note: "border-transparent text-black",
        medicine: "border-transparent text-black",
        travel: "border-transparent text-black",
        tech: "border-transparent text-black",
        links: "border-transparent text-black",
        contact: "border-transparent text-black",
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
      backgroundColor: '#E3F2FD',
    },
    'Medicine': {
      backgroundColor: '#FFEBEE',
    },
    'Travel': {
      backgroundColor: '#E8F5E8',
    },
    'Tech': {
      backgroundColor: '#F3E5F5',
    },
    'Links': {
      backgroundColor: '#FFF3E0',
    },
    'Contact': {
      backgroundColor: '#E0F2F1',
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
