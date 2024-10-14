import React from 'react'
import { cn } from "@/lib/utils"

const AnimatedText = ({ text, className = '' }: { text: string, className?: string }) => {
    return (
        <h1 className={cn(
            'text-center font-[500] leading-[96px] tracking-tight',
            className
        )}>
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    className={cn(
                        "inline-block animate-pulse-left-to-right",
                        "bg-gradient-to-r from-white via-white to-white",
                        "text-transparent bg-clip-text"
                    )}
                    style={{
                        animationDelay: `${index * 0.1}s`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {char}
                </span>
            ))}
        </h1>
    )
}

export default AnimatedText