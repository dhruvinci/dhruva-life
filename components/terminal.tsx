"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import type { DiscoveryState } from "@/lib/commands"
import type { TerminalAction } from "@/lib/terminal-config"
import { OutputBlock } from "./output-block"
import { TerminalInput } from "./terminal-input"

interface TerminalProps {
  output: Array<{
    id: string
    timestamp: string
    command: string
    content: React.ReactNode
    type?: "command" | "error" | "success"
  }>
  input: string
  setInput: (value: string) => void
  executeCommand: (command: string) => void
  history: string[]
  historyIndex: number
  setHistoryIndex: (index: number) => void
  suggestions: string[]
  mobileActions: TerminalAction[]
  discoveryState: DiscoveryState
  bootCompleted: boolean
}

export function Terminal({
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
  bootCompleted,
}: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (output.length > 0) {
      // Small delay to ensure content is rendered before scrolling
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        })
      }, 100)
    }
  }, [output])

  return (
    <>
      {/* Terminal Content - Only renders if there's output */}
      {output.length > 0 && (
        <div className="flex flex-col min-h-screen">
          <div ref={terminalRef} className="flex-1 pb-44 md:pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
              <div className="space-y-8">
                {output.map((block) => (
                  <OutputBlock key={block.id} {...block} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Input - Always visible after boot */}
      {bootCompleted && (
        <TerminalInput
          input={input}
          setInput={setInput}
          executeCommand={executeCommand}
          history={history}
          historyIndex={historyIndex}
          setHistoryIndex={setHistoryIndex}
          suggestions={suggestions}
          mobileActions={mobileActions}
          discoveryState={discoveryState}
        />
      )}
    </>
  )
}
