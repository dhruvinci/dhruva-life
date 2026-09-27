import type React from "react"
import { AnimatedASCII, CompileAnimation, DeployAnimation, MatrixRain, PulseBanner, ReplayButton } from "@/lib/animations"
import type { Command } from "./types"

// Hidden from help and autocomplete. Finding one counts toward the "Secrets" tally.

function Egg({ command, caption, captionClass = "text-teal-stone", children }: {
  command: string
  caption?: string
  captionClass?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      {children}
      {caption && <p className={`text-center ${captionClass}`}>{caption}</p>}
      <div className="text-center">
        <ReplayButton command={command} />
      </div>
    </div>
  )
}

function ascii(frames: string[], duration: number) {
  return (
    <div className="font-mono flex justify-center">
      <AnimatedASCII frames={frames} duration={duration} />
    </div>
  )
}

const VINYL_FRAMES = [
  "╭─────────╮\n│  ●───○  │\n│    ●    │\n│  ○───●  │\n╰─────────╯",
  "╭─────────╮\n│  ○───●  │\n│    ○    │\n│  ●───○  │\n╰─────────╯",
]

const LINKIN_PARK = `██╗     ██╗███╗   ██╗██╗  ██╗██╗███╗   ██╗    ██████╗  █████╗ ██████╗ ██╗  ██╗
██║     ██║████╗  ██║██║ ██╔╝██║████╗  ██║    ██╔══██╗██╔══██╗██╔══██╗██║ ██╔╝
██║     ██║██╔██╗ ██║█████╔╝ ██║██╔██╗ ██║    ██████╔╝███████║██████╔╝█████╔╝
██║     ██║██║╚██╗██║██╔═██╗ ██║██║╚██╗██║    ██╔═══╝ ██╔══██║██╔══██╗██╔═██╗
███████╗██║██║ ╚████║██║  ██╗██║██║ ╚████║    ██║     ██║  ██║██║  ██║██║  ██╗
╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝`

const OSS = ` ██████╗ ███████╗███████╗
██╔═══██╗██╔════╝██╔════╝
██║   ██║███████╗███████╗
╚██████╔╝███████║███████║
 ╚═════╝ ╚══════╝╚══════╝`

const egg = (name: string, description: string, render: () => React.ReactNode, aliases?: string[]): Command => ({
  name,
  description,
  aliases,
  section: "secret",
  run: () => ({ content: render() }),
})

export const easterEggCommands: Command[] = [
  egg(
    "jits",
    "Jiu-jitsu greeting",
    () => (
      <Egg command="jits" caption="Flow like water, adapt like bamboo">
        {ascii(["  o/     \\o  ", "  o|     |o  ", "  o\\     /o  ", "  o/\\   /\\o  ", "  o/\\o o/\\o  "], 2500)}
      </Egg>
    ),
    ["slapbump"],
  ),
  egg(
    "analog",
    "Spinning record",
    () => (
      <Egg command="analog" caption="Analog warmth in a digital world">
        {ascii(VINYL_FRAMES, 2000)}
      </Egg>
    ),
    ["turntable"],
  ),
  egg("matrix", "Digital rain", () => (
    <Egg command="matrix" caption="There is no spoon...">
      <div className="flex justify-center">
        <MatrixRain />
      </div>
    </Egg>
  )),
  egg("rangoli", "Sacred geometry bloom", () => (
    <Egg command="rangoli" caption="Sacred patterns emerge from intention">
      {ascii(["    ·    ", "   ·•·   ", "  ·•○•·  ", " ·•○●○•· ", "·•○●◆●○•·", "•○●◆◇◆●○•"], 3000)}
    </Egg>
  )),
  egg("play", "Infinite game", () => {
    const symbols = ["○", "◯", "⊙", "●", "⬤"]
    return (
      <Egg command="play" caption="The point of an infinite game is to keep playing">
        <div className="text-6xl text-center text-teal-stone animate-pulse">{symbols[Math.floor(Math.random() * symbols.length)]}</div>
      </Egg>
    )
  }),
  egg("linkinpark", "Banner pulse", () => (
    <Egg command="linkinpark" caption="In the end, it doesn't even matter..." captionClass="text-muted-foreground">
      <div className="font-mono text-[8px] sm:text-xs overflow-x-auto">
        <PulseBanner text={LINKIN_PARK} />
      </div>
    </Egg>
  )),
  egg("compile", "Fake build", () => (
    <Egg command="compile">
      <CompileAnimation />
    </Egg>
  )),
  egg("deploy", "Fake deploy", () => (
    <Egg command="deploy">
      <DeployAnimation />
    </Egg>
  )),
  egg("tapout", "Triangle submission", () => (
    <Egg command="tapout" caption="Respect the tap. Reset. Go again." captionClass="text-accent">
      {ascii(["    /\\    ", "   /  \\   ", "  /____\\  ", "  \\____/  ", "   \\  /   ", "    \\/    "], 2000)}
    </Egg>
  )),
  egg("oss", "OSS!", () => (
    <Egg command="oss" caption="Onegaishimasu!" captionClass="text-muted-foreground">
      <pre className="font-mono text-xs sm:text-sm text-center text-accent">{OSS}</pre>
    </Egg>
  )),
]
