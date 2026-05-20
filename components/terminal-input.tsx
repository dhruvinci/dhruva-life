"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { getMobileCommandGroups, type DiscoveryState } from "@/lib/commands"
import type { TerminalAction } from "@/lib/terminal-config"

interface TerminalInputProps {
  input: string
  setInput: (value: string) => void
  executeCommand: (command: string) => void
  history: string[]
  historyIndex: number
  setHistoryIndex: (index: number) => void
  suggestions: string[]
  mobileActions: TerminalAction[]
  discoveryState: DiscoveryState
}

const actionToneClasses: Record<NonNullable<TerminalAction["tone"]>, string> = {
  primary: "border-accent/30 bg-accent/15 text-accent",
  accent: "border-olive/30 bg-olive/15 text-olive",
  muted: "border-border bg-muted/20 text-muted-foreground",
}

function ActionChip({
  action,
  onRun,
}: {
  action: TerminalAction
  onRun: (command: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onRun(action.command)}
      className={`shrink-0 rounded border px-2.5 py-1.5 text-xs leading-none ${
        actionToneClasses[action.tone || "muted"]
      }`}
    >
      {action.label}
    </button>
  )
}

export function TerminalInput({
  input,
  setInput,
  executeCommand,
  history,
  historyIndex,
  setHistoryIndex,
  suggestions,
  mobileActions,
  discoveryState,
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [ghostText, setGhostText] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileInputOpen, setMobileInputOpen] = useState(false)

  useEffect(() => {
    // Only auto-focus on desktop to avoid mobile viewport issues
    if (inputRef.current && window.innerWidth > 768) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (input && suggestions.length > 0) {
      const bestMatch = suggestions[0]
      if (bestMatch.toLowerCase().startsWith(input.toLowerCase())) {
        setGhostText(bestMatch.slice(input.length))
      } else {
        setGhostText("")
      }
    } else {
      setGhostText("")
    }
  }, [input, suggestions])

  useEffect(() => {
    const inputIsFocused = document.activeElement === inputRef.current

    if (inputIsFocused && input.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true)
    } else if (!input || suggestions.length === 0) {
      setShowSuggestions(false)
    }
  }, [input, suggestions])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input)
      setInput("")
      setHistoryIndex(-1)
      setShowSuggestions(false)
      setGhostText("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= history.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(newIndex)
          setInput(history[newIndex])
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      if (ghostText) {
        setInput(input + ghostText)
        setGhostText("")
      } else if (suggestions.length > 0) {
        setInput(suggestions[0])
      }
      setShowSuggestions(false)
    } else if (e.key === "Escape" || (e.ctrlKey && e.key === "l")) {
      e.preventDefault()
      setInput("")
      setHistoryIndex(-1)
      setShowSuggestions(false)
      setGhostText("")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    setShowSuggestions(value.length > 0 && suggestions.length > 0)
  }

  const runMobileCommand = (command: string) => {
    executeCommand(command)
    setInput("")
    setHistoryIndex(-1)
    setShowSuggestions(false)
    setGhostText("")
    setMenuOpen(false)
    setMobileInputOpen(false)
  }

  const openMobileInput = () => {
    setMobileInputOpen(true)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const commandGroups = getMobileCommandGroups(discoveryState)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border pb-safe">
      <div className="hidden md:block max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <span className="text-sage text-sm">$</span>
          <div className="flex-1 relative">
            {ghostText && (
              <div className="absolute inset-0 pointer-events-none text-muted-foreground/30 whitespace-pre">
                <span className="invisible">{input}</span>
                {ghostText}
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(input.length > 0 && suggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="w-full bg-transparent border-none outline-none text-foreground text-sm placeholder-muted-foreground"
              placeholder="Type 'help' to get started..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="mt-2 p-2 bg-card border border-border rounded">
            <div className="text-xs text-muted-foreground mb-1">Press Tab to complete:</div>
            {suggestions.slice(0, 3).map((suggestion) => (
              <div
                key={suggestion}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer py-1 px-2 rounded hover:bg-muted/20"
                onClick={() => {
                  setInput(suggestion)
                  setShowSuggestions(false)
                  setGhostText("")
                  inputRef.current?.focus()
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="md:hidden px-3 py-3 space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="shrink-0 rounded border border-border bg-card px-2.5 py-1.5 text-xs text-foreground"
            aria-label="Open command menu"
          >
            menu
          </button>
          {mobileActions.slice(0, 5).map((action) => (
            <ActionChip key={`${action.label}-${action.command}`} action={action} onRun={runMobileCommand} />
          ))}
        </div>

        {mobileInputOpen ? (
          <div className="rounded border border-border bg-card px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sage text-sm">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(input.length > 0 && suggestions.length > 0)}
                onBlur={() => {
                  window.setTimeout(() => {
                    setShowSuggestions(false)
                    if (!input) setMobileInputOpen(false)
                  }, 150)
                }}
                className="w-full bg-transparent border-none outline-none text-foreground text-sm placeholder-muted-foreground"
                placeholder="type command..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openMobileInput}
            className="flex w-full items-center gap-2 rounded border border-border bg-card px-3 py-2 text-left"
          >
            <span className="text-sage text-sm">$</span>
            <span className="text-sm text-muted-foreground">type command...</span>
          </button>
        )}

        {mobileInputOpen && showSuggestions && suggestions.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {suggestions.slice(0, 5).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="shrink-0 rounded border border-border bg-muted/20 px-2.5 py-1.5 text-xs text-muted-foreground"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => runMobileCommand(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/70"
            onClick={() => setMenuOpen(false)}
            aria-label="Close command menu"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[75vh] overflow-y-auto rounded-t border border-border bg-background px-4 pb-safe pt-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-foreground">commands</h2>
                <p className="text-xs text-muted-foreground">tap to run</p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded border border-border px-2 py-1 text-xs text-muted-foreground"
              >
                close
              </button>
            </div>
            <div className="space-y-5 pb-5">
              {commandGroups.map((group) => (
                <section key={group.label} className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground">{group.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.commands.map((command) => (
                      <button
                        key={`${group.label}-${command}`}
                        type="button"
                        onClick={() => runMobileCommand(command)}
                        className="rounded border border-border bg-muted/20 px-2.5 py-1.5 text-xs text-foreground"
                      >
                        {command}
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
