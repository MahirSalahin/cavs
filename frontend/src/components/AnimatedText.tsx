import React from 'react'
import { cn } from "@/lib/utils"

const AnimatedText = ({ text, className = '' }: { text: string, className?: string }) => {
    return (
        <span className={cn('font-medium tracking-tight', className)}>
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    className="inline animate-pulse-left-to-right"
                    style={{
                        animationDelay: `${index * 0.1}s`,
                    }}
                >
                    {char}
                </span>
            ))}
        </span>
    )
}

export default AnimatedText