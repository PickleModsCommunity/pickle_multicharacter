import { useEffect, useState } from "react"

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

export default function LoadingScreen() {
    const [progress, setProgress] = useState(50);
    return (
        <div className="bg-background w-full h-full select-none">
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
            <div className="z-10 absolute p-4 bottom-0 left-0 w-full bg-background/95 text-primary">
                <div className="flex flex-col gap-2 relative">
                    <div className="text-2xl font-bold">Loading... {progress}%</div>
                    <div className="w-full h-4 rounded-md bg-zinc-300">
                        <div
                            className="h-full rounded-tl-md rounded-bl-md bg-green-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}