import { cn } from "@/lib/utils";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, FastForward, KeyboardIcon, Paintbrush, PlayIcon, RewindIcon, Youtube } from "lucide-react";
import { useEffect, useRef, useState } from "react"
import KeyboardLayout from "../keyboard/keyboard";
import UpdatesList from "../updates/updates";
import "./loading.css";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { createContext, useContext } from "react";
import { SketchPicker } from 'react-color';

export type SlideshowImage = {
    background: string;
    foreground?: string;
    animation?: 'slide';
}

function SlideshowImage({ image, slideTime }: { image: SlideshowImage, slideTime: number }) {
    const time = slideTime + 1;
    const [direction, setDirection] = useState<'left' | 'right'>(Math.random() > 0.5 ? 'left' : 'right');
    const [visible, setVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [scaleTarget, setScaleTarget] = useState(1.25);
    useEffect(() => {
        setTimeout(() => setVisible(true), 50);
        setTimeout(() => setVisible(false), (slideTime - 0.5) * 1000);
        setTimeout(() => setScaleTarget(1), 50);
        setTimeout(() => setContentVisible(true), 50);
    }, []);
    return (
        <div className={`${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
            <div
                className={`absolute w-full h-full`}
                style={{ 
                    transition: `opacity 1s ease-in-out, scale ${time}s ease-in-out`, 
                    backgroundImage: `url(${image.background})`, 
                    backgroundSize: 'cover', 
                    scale: scaleTarget, 
                    backgroundPosition: 'center'
                }}
            />
            {image.foreground && (
                <motion.img
                    className=""
                    draggable={false}
                    src={image.foreground}
                    style={{ 
                        height: '100%',
                        maxHeight: "80%",
                        position: 'absolute',
                        transition: `transform ${time}s, left ${time}s, right ${time}s, scale ${time}s`, 
                        transformOrigin: `bottom ${direction}`,
                        // scale: scaleTarget == 1.25 ? 0.8 : 1.0,
                        left: direction == "right" ? (contentVisible ? "25%" : 0) : "unset",
                        right: direction == "left" ? (contentVisible ? "25%" : 0) : "unset",
                        transform: `translateX(${direction == "right" ? -25 : 25}%) scale(${scaleTarget == 1.25 ? 0.8 : 1.0})`,
                        bottom: 0,
                        zIndex: 1,
                    }}
                />
            )}
        </div>
    )
}

type UpdateInfo = {
    version: string;
    date: string;
    changes: string[];
}

type Member = {
    name: string;
    role: string;
    image: string;
}

function ServerRules({ rules }: { rules: string[] }) {
    return (
        <div className="bg-background/50 flex flex-col gap-2 p-4 rounded-md">
            {rules.map((rule, i) => (
                <div className="flex items-center gap-2">
                    <div className="text-lg font-semibold">{i + 1}.</div>
                    <div className="text-lg">{rule}</div>
                </div>
            ))}
        </div>
    )
}

function ServerTeam({ members }: { members: Member[] }) {
    return (
        <div className="flex flex-col gap-2">
            {members.map((member, i) => (
                <div className="flex items-center gap-2 bg-background/50 p-4 rounded-md" key={i}>
                    <img src={member.image} className="h-12 w-auto rounded-full" />
                    <div className="flex flex-col items-start">
                        <div className="text-lg font-semibold">{member.name}</div>
                        <div className="text-sm">{member.role}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function ServerInfo() {
    const tabs = [
        {
            id: "updates",
            name: "Updates",
        },
        {
            id: "team",
            name: "Server Team"
        },
        {
            id: "rules",
            name: "Rules"
        }
    ]
    const [viewing, setViewing] = useState(true);
    const [tab, setTab] = useState<string>(tabs[0].id);
    const [updates, setUpdates] = useState<UpdateInfo[]>([
        {
            version: "1.5.0",
            date: "2022-03-01",
            changes: [
                "Enhanced graphics and textures",
                "Fixed server crash issues",
                "Added new music tracks",
            ]
        },
        {
            version: "1.4.0",
            date: "2022-02-05",
            changes: [
                "Introduced new gang territories",
                "Improved NPC interactions",
                "Added new clothing items",
            ]
        },
        {
            version: "1.3.0",
            date: "2022-01-10",
            changes: [
                "Added new properties for purchase",
                "Implemented dynamic weather system",
                "Fixed minor bugs",
            ]
        },
        {
            version: "1.2.0",
            date: "2021-12-20",
            changes: [
                "Introduced new heist missions",
                "Enhanced vehicle handling",
                "Updated user interface",
            ]
        },
        {
            version: "1.1.0",
            date: "2021-11-15",
            changes: [
                "Improved server stability",
                "Fixed bugs in the job system",
                "Added new character customization options",
            ]
        },
        {
            version: "1.0.0",
            date: "2021-10-01",
            changes: [
                "Added new vehicles",
                "Added new jobs",
                "Added new weapons",
            ]
        }
    ])
    const [members, setMembers] = useState<Member[]>([
        {
            name: "John Doe",
            role: "Owner",
            image: "https://randomuser.me/api/portraits/men/75.jpg",
        },
    ])
    const [rules, setRules] = useState<string[]>([
        "No griefing or trolling",
        "No hacking or cheating",
        "No racism or hate speech",
        "Respect all players and staff",
        "No spamming in chat",
        "No advertising other servers",
        "No exploiting bugs",
        "No offensive language",
        "No impersonating staff",
        "No sharing personal information",
        "No inappropriate content",
        "No harassment or bullying",
        "No excessive swearing",
        "No real-world trading",
        "No AFK farming",
        "No bypassing bans",
        "No multi-accounting",
        "No unauthorized mods",
        "No griefing builds",
        "No abusing glitches",
        "No scamming other players",
        "No inappropriate usernames",
        "No excessive caps in chat",
        "No political or religious discussions"
    ])
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            if (ref.current.scrollHeight > 384) {
                ref.current.classList.add("pr-2");
            } else {
                ref.current.classList.remove("pr-2");
            }
        }
    }, [tab]);
    return (
        <>
            <div className="flex items-center relative w-100 gap-2">
            {tabs.map((t, i) => (
                <Badge key={i} className={`${t.id == tab ? "bg-background/50" : "bg-background/20"} px-4 py-1 text-primary cursor-pointer hover:bg-background/50 transition-colors duration-200 flex-1 text-center`} onClick={() => {
                    if (tab == t.id) return;
                    setViewing(false);
                    setTimeout(() => {
                        setTab(t.id);
                        setViewing(true);
                    }, 200);
                }}>
                {t.name}
                </Badge>
            ))}
            </div>
            <div ref={ref} className="flex flex-col gap-2 overflow-y-auto max-h-96" style={{
                opacity: viewing ? 1 : 0,
                transition: 'opacity 0.2s ease-in-out',
            }}>
                {tab == "updates" && (<UpdatesList updates={updates}/>)}
                {tab == "team" && (<ServerTeam members={members}/>)}
                {tab == "rules" && (<ServerRules rules={rules}/>)}
            </div>
        </>
    )
}

function YoutubePlayer({ videoUrl, size }: { videoUrl: string, size: number }) {
    const videoId = videoUrl.includes("youtu.be")
        ? videoUrl.split("youtu.be/")[1]
        : videoUrl.split("v=")[1]?.split("&")[0];
    return (
        <div className="absolute w-full h-full select-none overflow-hidden" style={{ zIndex: -1 }}>
            <iframe
                style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    position: "absolute",
                }}
                src={`https://www.youtube.com/embed/${videoId}?vq=hd1080&controls=0&showinfo=0&rel=0&autoplay=1&loop=1&mute=1&hd=1&playlist=${videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                width={(size || 100) + "%"}
                height={(size || 100) + "%"}
            />
        </div>
    )
}

export function BlurCard({ className, children, opacity, colorType, style, onClick }: { className?: string, children?: React.ReactNode, opacity?: number, colorType?: "primary" | "secondary", style?: React.CSSProperties, onClick?: () => void }) {
    const {color, setColor, blur} = useLoadingScreen();
    const themeColor = color[colorType || "primary"];
    return (
        <div className={cn(
            "shadow-xl border border-background/30",
            blur ? "backdrop-blur-md" : "backdrop-blur-none",
            className)} style={{
                willChange: "transform, opacity, background-color",
                backfaceVisibility: "hidden",
                perspective: 1000,
                transform: "translate3d(0,0,0)",
                backgroundColor: `rgba(${themeColor[0]}, ${themeColor[1]}, ${themeColor[2]}, ${opacity ?? (themeColor[3] * 100)}%)`,
                ...style
            }} onClick={onClick}>
            {children}
        </div>
    )
}

type LoadingScreenContextType = {
    blur: boolean;
    setBlur: React.Dispatch<React.SetStateAction<boolean>>;
    color: {
        primary: rgba;
        secondary: rgba;
    };
    setColor: React.Dispatch<React.SetStateAction<{
        primary: rgba;
        secondary: rgba;
    }>>;
    progress: number;
    setProgress: React.Dispatch<React.SetStateAction<number>>;
    loadingDots: number;
    setLoadingDots: React.Dispatch<React.SetStateAction<number>>;
    keyboardOpen: boolean;
    setKeyboardOpen: React.Dispatch<React.SetStateAction<boolean>>;
    keyboardTransition: boolean;
    setKeyboardTransition: React.Dispatch<React.SetStateAction<boolean>>;
};
type rgba = [number, number, number, number];
const LoadingScreenContext = createContext<LoadingScreenContextType | undefined>(undefined);

export const useLoadingScreen = () => {
    const context = useContext(LoadingScreenContext);
    if (!context) {
        throw new Error("useLoadingScreen must be used within a LoadingScreenProvider");
    }
    return context;
};

export const LoadingScreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [progress, setProgress] = useState(1);
    const [loadingDots, setLoadingDots] = useState(0);
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [keyboardTransition, setKeyboardTransition] = useState(false);
    const [color, setColor] = useState<LoadingScreenContextType["color"]>({
        primary: [127, 127, 127, 0.2],
        secondary: [255, 255, 255, 0.2],
    });
    const [blur, setBlur] = useState<boolean>(true);
    return (
        <LoadingScreenContext.Provider
            value={{
                blur,
                setBlur,
                color, 
                setColor,
                progress,
                setProgress,
                loadingDots,
                setLoadingDots,
                keyboardOpen,
                setKeyboardOpen,
                keyboardTransition,
                setKeyboardTransition,
            }}
        >
            {children}
        </LoadingScreenContext.Provider>
    );
};

function LoadingScreenContent() {
    const { blur, setBlur, color, setColor, progress, setProgress, loadingDots, setLoadingDots, keyboardOpen, keyboardTransition, setKeyboardOpen, setKeyboardTransition } = 
    useLoadingScreen();
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => (prevProgress + 1) % 101);
            setLoadingDots((prevDots) => (prevDots + 1) % 4);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const toolbar = [
        {
            icon: <KeyboardIcon/>,
            onClick: () => {openKeyboard()},
        },
        {
            icon: (
                <Paintbrush/>
            ),
            special: "color",
            onClick: () => {},
        }
    ]
    const openKeyboard = () => {
        if (keyboardOpen) return;
        setKeyboardTransition(true);
        setKeyboardOpen(true);
        setTimeout(() => {
            setKeyboardTransition(false);
        }, 0);
    }
    const closeKeyboard = () => {
        if (!keyboardOpen) return;
        setKeyboardTransition(true);
        setTimeout(() => {
            setKeyboardTransition(false);
            setKeyboardOpen(false);
        }, 200);
    }
    const primaryColor = color.primary;
    const secondaryColor = color.secondary
    return (
        <div className="w-full h-full select-none relative" style={{            
        }}>
            <YoutubePlayer size={105} videoUrl={"https://www.youtube.com/watch?v=FByBvNKpwAw"}/>
            <div className="z-10 absolute text-primary top-4 left-4 flex flex-col justify-between gap-2" style={{
                height: 'calc(100% - 90px)',
            }}>
                <BlurCard className="flex flex-col p-2 rounded-sm gap-2">
                    <ServerInfo/>
                </BlurCard>
            </div>
            {keyboardOpen && (
                <div className="z-10 absolute p-2 text-primary rounded-md flex items-center gap-2" style={{
                    bottom: '12.5%',
                    left: '50%',
                    transform: 'translate(-50%, -12.5%)',
                    opacity: keyboardTransition ? 0 : 1,
                    transition: 'opacity 0.2s ease-in-out',
                }}>
                    <KeyboardLayout onClose={() => {
                        closeKeyboard();
                    }}/>
                </div> 
            )}
            <div className="z-10 absolute p-2 top-4 right-4 text-primary rounded-md flex items-center gap-2">
                {toolbar.map((item, i) => {
                    const [open, setOpen] = useState(false);

                    useEffect(() => {
                        const handleClickOutside = (event: MouseEvent) => {
                            if (open && !event.composedPath().includes(ref.current as EventTarget)) {
                                setOpen(false);
                            }
                        };

                        document.addEventListener("mousedown", handleClickOutside);
                        return () => {
                            document.removeEventListener("mousedown", handleClickOutside);
                        };
                    }, [open]);

                    const ref = useRef<HTMLDivElement>(null);
                    return (
                        <div className="relative" key={i} ref={ref}>
                            <div key={i} className="p-2 text-primary rounded-md flex items-center gap-2 hover:scale-90 transition-transform duration-200 cursor-pointer" onClick={function() {
                                item.onClick();
                                setOpen(!open);
                            }} style={{
                                backgroundColor: `rgba(${primaryColor[0]}, ${primaryColor[1]}, ${primaryColor[2]}, ${primaryColor[3]})`,
                            }}>
                                {item.icon}
                            </div>
                            {(item.special == "color" && open) && (
                                <div className="flex flex-col absolute right-0 top-[100%] mt-2 px-2 pb-2 rounded-md gap-2" style={{
                                    backgroundColor: `rgba(${primaryColor[0]}, ${primaryColor[1]}, ${primaryColor[2]}, ${primaryColor[3]})`,
                                }}>
                                    <div className="flex flex-row gap-2">
                                        <div className="flex flex-col gap-2 pt-2">
                                            <div className="font-semibold text-lg">Primary Color</div>
                                            <SketchPicker
                                                styles={ {
                                                    default: {
                                                        picker: {
                                                            color: 'black',
                                                        }
                                                    }
                                                }}
                                                color={{ r: primaryColor[0], g: primaryColor[1], b: primaryColor[2], a: primaryColor[3] }}
                                                onChange={(newColor: any) => {
                                                    setColor({
                                                        ...color,
                                                        primary: [newColor.rgb.r, newColor.rgb.g, newColor.rgb.b, newColor.rgb.a]
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 pt-2">
                                            <div className="font-semibold text-lg">Secondary Color</div>
                                            <SketchPicker
                                                styles={ {
                                                    default: {
                                                        picker: {
                                                            color: 'black',
                                                        }
                                                    }
                                                }}
                                                color={{ r: secondaryColor[0], g: secondaryColor[1], b: secondaryColor[2], a: secondaryColor[3] }}
                                                onChange={(newColor: any) => {
                                                    setColor({
                                                        ...color,
                                                        secondary: [newColor.rgb.r, newColor.rgb.g, newColor.rgb.b, newColor.rgb.a]
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-row justify-between gap-2" onClick={() => setBlur(!blur)}>
                                            <div className="font-semibold text-lg">Blur (Turn off for FPS Boost)</div>
                                            <input type="checkbox" checked={blur} className="cursor-pointer"/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            <div className="z-10 absolute bottom-0 left-0 w-full p-4 text-primary"> 
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                        <BlurCard className="flex items-center gap-2 p-2 rounded-md">
                            <img src="https://forum.cfx.re/user_avatar/forum.cfx.re/picklemods/144/3250086_2.png" className="h-12 w-auto" />
                            <div className="flex flex-col items-start">
                                <div className="text-2xl font-bold">Pickle RP</div>
                                <div className="text-lg">The best roleplaying server you'll find on FiveM.</div>
                            </div>
                        </BlurCard>
                        <BlurCard className="flex items-center justify-between gap-4 p-4 rounded-md">
                            <div className="flex items-center gap-2">
                                <img src={"https://upload.wikimedia.org/wikipedia/en/c/c6/Die_Lit_by_Playboi_Carti.jpg"} alt={""} className="h-12 w-12" />
                                <div className="flex flex-col items-start">
                                    <div className="text-sm">Sean Combs</div>
                                    <div className="text-lg font-semibold">Shawty like a melody</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button >
                                    <RewindIcon />
                                </button>
                                <button >
                                    <PlayIcon />
                                </button>
                                <button >
                                    <FastForward />
                                </button>
                            </div>
                        </BlurCard>
                    </div>
                    <BlurCard className="h-10 rounded-md bg-background/75 relative">
                        <div className="flex justify-between items-center px-4" style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                        }}>
                            <div className="text-xl font-bold">Loading{".".repeat(loadingDots)}</div>
                            <div className="text-xl font-bold">{progress}%</div>
                        </div>
                        <div
                            className="will-change h-full rounded-tl-md rounded-bl-md transition-all duration-500"
                            style={{ 
                                width: `${progress}%`,
                                backgroundColor: `rgba(${secondaryColor[0]}, ${secondaryColor[1]}, ${secondaryColor[2]}, ${secondaryColor[3]})`,
                            }}
                        />
                    </BlurCard>
                </div>
            </div>
        </div>
    )
}

export default function LoadingScreen() {
    return (
        <LoadingScreenProvider>
            <LoadingScreenContent/>
        </LoadingScreenProvider>
    )
}