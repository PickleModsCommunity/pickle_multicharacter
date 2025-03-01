import { cn } from "@/lib/utils";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, KeyboardIcon } from "lucide-react";
import { useEffect, useState } from "react"
import KeyboardLayout from "../keyboard/keyboard";

export type SlideshowImage = {
    background: string;
    foreground?: string;
    animation?: 'slide';
}

function SlideshowImage({ image, slideTime }: { image: SlideshowImage, slideTime: number }) {
    const [visible, setVisible] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
    const [scaleTarget, setScaleTarget] = useState(1.25);
    if (slideDirection == "right") {
        setTimeout(() => setSlideDirection('left'), 50);
        setTimeout(() => setScaleTarget(1), 50);
    }
    useEffect(() => {
        setTimeout(() => setVisible(true), 50);
        setTimeout(() => setVisible(false), (slideTime - 0.5) * 1000);
    }, []);
    return (
        <div className={`${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-500 w-full h-full`}>
            <div
                className={`absolute w-full h-full`}
                style={{ 
                    transition: `opacity 1s ease-in-out, scale ${slideTime + 1}s ease-in-out`, 
                    backgroundImage: `url(${image.background})`, 
                    backgroundSize: 'cover', 
                    scale: scaleTarget, 
                    backgroundPosition: 'center' 
                }}
            />
            {image.foreground && (
                <img
                    draggable={false}
                    className="min-w-md"
                    src={image.foreground}
                    style={{ 
                        position: 'absolute',
                        transition: `transform ${slideTime + 1}s ease-in-out`, 
                        right: 0,
                        bottom: 0,
                        transform: slideDirection == "left" ? `translateX(-100%)` : "unset",
                        zIndex: 1,
                    }}
                />
            )}
        </div>
    )
}

function Slideshow({ images }: { images: SlideshowImage[] }) {
    const [index, setIndex] = useState(0);
    const [slideTime, setSlideTime] = useState(7);
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Changing image");
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, slideTime * 1000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, [images.length]);
    return (
        <div className="relative w-full h-full overflow-hidden">
            <div className="z-2 absolute w-full h-full" style={{
                background: 'radial-gradient(ellipse at top, rgba(0, 0, 0, 0.0), rgba(0,0,0,0.2))',
            }}>
            </div>
            {images.map((image, i) => (i == index) && (
                <SlideshowImage slideTime={slideTime} image={images[index]}/>
            ))}
        </div>
    );
}

function BlurCard({ className, children, style, onClick }: { className?: string, children?: React.ReactNode, style?: React.CSSProperties, onClick?: () => void }) {
    return (
        <div className={cn("bg-background/20", "bg-clip-padding backdrop-filter backdrop-blur-sm shadow-xl border border-background/30", className)} style={style} onClick={onClick}>
            {children}
        </div>
    )
}

export default function LoadingScreen() {
    const [progress, setProgress] = useState(1);
    const [loadingDots, setLoadingDots] = useState(0);
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [keyboardTransition, setKeyboardTransition] = useState(false);
    const openKeyboard = () => {
        if (keyboardOpen) return;
        setKeyboardTransition(true);
        setKeyboardOpen(true);
        setTimeout(() => {
            setKeyboardTransition(false);
        }, 500);
    }
    const closeKeyboard = () => {
        if (!keyboardOpen) return;
        setKeyboardTransition(true);
        setTimeout(() => {
            setKeyboardTransition(false);
            setKeyboardOpen(false);
        }, 500);
    }
    const toolbar = [
        {
            icon: <KeyboardIcon/>,
            onClick: () => {openKeyboard()},
        },
    ]
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => (prevProgress + 1) % 101);
            setLoadingDots((prevDots) => (prevDots + 1) % 4);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="bg-background w-full h-full select-none relative">
            <Slideshow images={[
                {
                    background: "https://wallpapers.com/images/hd/gta-5-background-zq7za0vyqjg2o41m.jpg",
                    foreground: "https://static.wikia.nocookie.net/omniversal-battlefield/images/b/bc/Franklin_clinton_render_by_squizcat_d80pr3r.png",
                    animation: "slide",
                },
                {
                    background: "https://wallpapercat.com/w/full/5/1/7/2155875-2560x1414-desktop-hd-gta-background.jpg",
                },
            ]}/>
            <BlurCard className="z-10 absolute p-8 bottom-0 left-0 text-primary w-full border-none">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-red-50">Loading{".".repeat(loadingDots)}</div>
                        <div className="text-2xl font-bold">{progress}%</div>
                    </div>
                    <div className="h-4 rounded-md bg-background/50">
                        <div
                            className="h-full rounded-tl-md rounded-bl-md bg-red-50 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </BlurCard>
            <BlurCard className="z-10 absolute p-2 top-4 left-4 text-primary rounded-md flex items-center gap-2">
                <img src="https://picklemods.com/logo_1.png" className="h-12 w-auto" />
                <div className="flex flex-col items-start">
                    <div className="text-2xl font-bold">Pickle RP</div>
                    <div className="text-lg">The best roleplaying server you'll find on FiveM.</div>
                </div>
            </BlurCard>
            {keyboardOpen && (
                <div className="z-10 absolute p-2 text-primary rounded-md flex items-center gap-2" style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: keyboardTransition ? 0 : 1,
                    transition: 'opacity 0.5s ease-in-out',
                }}>
                    <KeyboardLayout onClose={() => {
                        closeKeyboard();
                    }}/>
                </div> 
            )}
            <div className="z-10 absolute p-2 top-4 right-4 text-primary rounded-md flex items-center gap-2">
                {toolbar.map((item, i) => (
                    <BlurCard className="p-2 text-primary rounded-md flex items-center gap-2 hover:scale-90 transition-transform duration-200 cursor-pointer" onClick={item.onClick}>
                        {item.icon}
                    </BlurCard>
                ))}
            </div>
        </div>
    )
}