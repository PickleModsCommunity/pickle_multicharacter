"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowLeft, CircleX } from "lucide-react"
import { useLoadingScreen } from "../loading/loading"

type KeyProps = {
  className?: string
  size?: "normal" | "wide" | "extrawide" | "space" | "enter" | "shift" | "small"
  children: React.ReactNode
  type?: "normal" | "function" | "modifier" | "macro" | "numpad" | "navigation"
  index: number;
}

const Key = ({ className, size = "normal", children, type = "normal", index }: KeyProps) => {
    const { color } = useLoadingScreen()
  const [hovering, setHovering] = useState(false)
  const sizeClasses = {
    normal: "w-12 h-12",
    small: "w-10 h-10",
    wide: "w-16 h-12",
    extrawide: "w-20 h-12",
    space: "w-64 h-12",
    enter: "w-16 h-24 -mt-12",
    shift: "w-[4.5rem] h-12",
  }

  const keyDefinitions = ((index % 5) == 1) ? [
    "Pause Game",
    "Quit Game"
  ] : [];
  return (
    <div className="relative">
        <div
            className={cn(
                "cursor-pointer rounded-md flex items-center justify-center font-medium shadow-sm transition-all duration-200 select-none hover:scale-90 transition-transform transform",
                sizeClasses[size],
                className,
                keyDefinitions.length > 0 ? "bg-foreground/40" : "bg-foreground/20"
            )}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => {setHovering(false)}}
            >
                {children}
        </div>
        {keyDefinitions.length > 0 && (
            <div className="absolute z-10 text-foreground/90 p-2 rounded-md min-w-[100px] transform transition-all duration-200 pointer-events-none" style={{
                backgroundColor: "rgba(" + color.primary[0] + ", " + color.primary[1] + ", " + color.primary[2] + ", 0.95)",
                marginTop: "0.25rem",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: hovering ? 1 : 0,
            }}>
                {keyDefinitions.map((definition, i) => (
                    <div key={i} className="text-sm">{definition}</div>
                ))}
            </div>
        )}
    </div>
  )
}

export default function KeyboardLayout({onClose}: {onClose?: () => void}) {
    const { color } = useLoadingScreen()
    let index = 0;
    return (
        <div className="p-4 rounded-xl max-w-[1200px] mx-auto" style={{ backgroundColor: "rgba(" + color.primary[0] + ", " + color.primary[1] + ", " + color.primary[2] + ", " + color.primary[3] + ")" }}>
            <div className="flex flex-col gap-2">
                {/* Macro and Function row */}
                <div className="flex gap-1.5 justify-between">
                    <div className="flex" style={{ gap: "0.74rem" }}>
                        <Key type="function" size="normal" index={index++}>
                            ESC
                        </Key>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Key key={i} type="function" size="normal" index={index++}>
                                F{i + 1}
                            </Key>
                        ))}
                    </div>
                </div>

                {/* Main keyboard area */}
                <div className="flex gap-4">
                    {/* Main keyboard section */}
                    <div className="flex flex-col gap-1.5">
                        {/* Number row */}
                        <div className="flex gap-1.5">
                            <Key type="normal" index={index++}>`</Key>
                            <Key type="normal" index={index++}>1</Key>
                            <Key type="normal" index={index++}>2</Key>
                            <Key type="normal" index={index++}>3</Key>
                            <Key type="normal" index={index++}>4</Key>
                            <Key type="normal" index={index++}>5</Key>
                            <Key type="normal" index={index++}>6</Key>
                            <Key type="normal" index={index++}>7</Key>
                            <Key type="normal" index={index++}>8</Key>
                            <Key type="normal" index={index++}>9</Key>
                            <Key type="normal" index={index++}>0</Key>
                            <Key type="normal" index={index++}>-</Key>
                            <Key type="normal" index={index++}>=</Key>
                            <Key type="modifier" size="wide" index={index++}>
                                ← Back
                            </Key>
                        </div>

                        {/* QWERTY row */}
                        <div className="flex gap-1.5">
                            <Key type="modifier" size="wide" index={index++}>
                                Tab
                            </Key>
                            <Key type="normal" index={index++}>Q</Key>
                            <Key type="normal" index={index++}>W</Key>
                            <Key type="normal" index={index++}>E</Key>
                            <Key type="normal" index={index++}>R</Key>
                            <Key type="normal" index={index++}>T</Key>
                            <Key type="normal" index={index++}>Y</Key>
                            <Key type="normal" index={index++}>U</Key>
                            <Key type="normal" index={index++}>I</Key>
                            <Key type="normal" index={index++}>O</Key>
                            <Key type="normal" index={index++}>P</Key>
                            <Key type="normal" index={index++}>[</Key>
                            <Key type="normal" index={index++}>]</Key>
                            <Key type="normal" index={index++}>\</Key>
                        </div>

                        {/* ASDF row */}
                        <div className="flex gap-1.5">
                            <Key type="modifier" size="wide" index={index++}>
                                Caps
                            </Key>
                            <Key type="normal" index={index++}>A</Key>
                            <Key type="normal" index={index++}>S</Key>
                            <Key type="normal" index={index++}>D</Key>
                            <Key type="normal" index={index++}>F</Key>
                            <Key type="normal" index={index++}>G</Key>
                            <Key type="normal" index={index++}>H</Key>
                            <Key type="normal" index={index++}>J</Key>
                            <Key type="normal" index={index++}>K</Key>
                            <Key type="normal" index={index++}>L</Key>
                            <Key type="normal" index={index++}>;</Key>
                            <Key type="normal" index={index++}>'</Key>
                            <Key type="modifier" size="wide" index={index++}>
                                Enter
                            </Key>
                        </div>

                        {/* ZXCV row */}
                        <div className="flex gap-1.5">
                            <Key type="modifier" size="shift" index={index++}>
                                ↑ Shift
                            </Key>
                            <Key type="normal" index={index++}>Z</Key>
                            <Key type="normal" index={index++}>X</Key>
                            <Key type="normal" index={index++}>C</Key>
                            <Key type="normal" index={index++}>V</Key>
                            <Key type="normal" index={index++}>B</Key>
                            <Key type="normal" index={index++}>N</Key>
                            <Key type="normal" index={index++}>M</Key>
                            <Key type="normal" index={index++}>,</Key>
                            <Key type="normal" index={index++}>.</Key>
                            <Key type="normal" index={index++}>/</Key>
                            <Key type="modifier" size="shift" index={index++}>
                                ↑ Shift
                            </Key>
                        </div>

                        {/* Bottom row */}
                        <div className="flex gap-1.5">
                            <Key type="modifier" index={index++}>Ctrl</Key>
                            <Key type="modifier" index={index++}>Win</Key>
                            <Key type="modifier" index={index++}>Alt</Key>
                            <Key type="normal" size="space" index={index++}>
                                Space
                            </Key>
                            <Key type="modifier" index={index++}>Alt</Key>
                            <Key type="modifier" index={index++}>Fn</Key>
                            <Key type="modifier" index={index++}>Menu</Key>
                            <Key type="modifier" index={index++}>Ctrl</Key>
                        </div>
                    </div>

                    {/* Navigation section */}
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="flex gap-1.5">
                            <Key type="navigation" size="normal" index={index++}>
                                PrtSc
                            </Key>
                            <Key type="navigation" size="normal" index={index++}>
                                ScrLk
                            </Key>
                            <Key type="navigation" size="normal" index={index++}>
                                Pause
                            </Key>
                        </div>
                        <div className="flex gap-1.5">
                            <Key type="navigation" size="normal" index={index++}>
                                Ins
                            </Key>
                            <Key type="navigation" size="normal" index={index++}>
                                Home
                            </Key>
                            <Key type="navigation" size="normal" index={index++}>
                                PgUp
                            </Key>
                        </div>
                        <div className="flex gap-1.5">
                            <Key type="navigation" size="normal" index={index++}>
                                Del
                            </Key>
                            <Key type="navigation" size="normal" index={index++}>
                                End
                            </Key>
                            <Key type="navigation" size="normal" index={index++}>
                                PgDn
                            </Key>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-center">
                                <Key type="navigation" index={index++}>↑</Key>
                            </div>
                            <div className="flex gap-1.5 justify-center">
                                <Key type="navigation" index={index++}>←</Key>
                                <Key type="navigation" index={index++}>↓</Key>
                                <Key type="navigation" index={index++}>→</Key>
                            </div>
                        </div>
                    </div>

                    {/* Numpad section */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex gap-1.5">
                            <Key type="numpad" size="normal" index={index++}>
                                Num
                            </Key>
                            <Key type="numpad" size="normal" index={index++}>
                                /
                            </Key>
                            <Key type="numpad" size="normal" index={index++}>
                                *
                            </Key>
                            <Key type="numpad" size="normal" index={index++}>
                                -
                            </Key>
                        </div>
                        <div className="flex gap-1.5">
                            <Key type="numpad" index={index++}>7</Key>
                            <Key type="numpad" index={index++}>8</Key>
                            <Key type="numpad" index={index++}>9</Key>
                            <Key type="numpad" className="h-24 -mb-12" index={index++}>
                                +
                            </Key>
                        </div>
                        <div className="flex gap-1.5">
                            <Key type="numpad" index={index++}>4</Key>
                            <Key type="numpad" index={index++}>5</Key>
                            <Key type="numpad" index={index++}>6</Key>
                        </div>
                        <div className="flex gap-1.5">
                            <Key type="numpad" index={index++}>1</Key>
                            <Key type="numpad" index={index++}>2</Key>
                            <Key type="numpad" index={index++}>3</Key>
                            <Key type="numpad" className="h-24 -mb-12" index={index++}>
                                Enter
                            </Key>
                        </div>
                        <div className="flex gap-1.5">
                            <Key type="numpad" size="wide" index={index++}>
                                0
                            </Key>
                            <Key type="numpad" index={index++}>.</Key>
                        </div>
                    </div>
                </div>
            </div>
            <CircleX className="absolute top-6 right-6 cursor-pointer text-foreground/90" size={30} onClick={onClose}/>
        </div>
    );
}

