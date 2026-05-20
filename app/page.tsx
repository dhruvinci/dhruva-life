"use client"

import { useState, useRef } from "react"
import { Terminal } from "@/components/terminal"
import { BootScreen } from "@/components/boot-screen"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTerminal } from "@/hooks/use-terminal"

export default function HomePage() {
  const [bootCompleted, setBootCompleted] = useState(false)
  const [hasExecutedCommand, setHasExecutedCommand] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    output,
    input,
    setInput,
    executeCommand,
    history,
    historyIndex,
    setHistoryIndex,
    suggestions,
    mobileActions,
    discoveryState,
  } = useTerminal()

  const handleBootComplete = () => {
    setBootCompleted(true)
  }

  const handleExecuteCommand = (command: string) => {
    executeCommand(command)
    setHasExecutedCommand(true)
  }


  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-y-auto">
      <ThemeToggle />
      <BootScreen onComplete={handleBootComplete} hasExecutedCommand={hasExecutedCommand} />

      <Terminal
        output={output}
        input={input}
        setInput={setInput}
        executeCommand={handleExecuteCommand}
        history={history}
        historyIndex={historyIndex}
        setHistoryIndex={setHistoryIndex}
        suggestions={suggestions}
        mobileActions={mobileActions}
        discoveryState={discoveryState}
        bootCompleted={bootCompleted}
      />


    </div>
  )
}
