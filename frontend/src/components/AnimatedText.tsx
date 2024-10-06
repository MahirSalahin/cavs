import React from 'react'
import { cn } from "@/lib/utils"

const AnimatedText = ({ text }: { text: string }) => {
    return (
        <h1 className="text-center text-[86px] font-[500] leading-[96px] tracking-tight">
            {text.split('').map((char, index) => (
                <span
                    key={index}
                    className={cn(
                        "inline-block animate-pulse-left-to-right",
                        "bg-gradient-to-r from-pink-500 via-indigo-500 to-purple-500",
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