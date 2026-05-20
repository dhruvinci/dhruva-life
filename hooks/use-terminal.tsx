"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import {
  executeCommand as runCommand,
  getDefaultMobileActions,
  getCommandSuggestions,
  resolveCommandInput,
} from "@/lib/commands"
import { terminalConfig, type TerminalAction } from "@/lib/terminal-config"

export function useTerminal() {
  const [output, setOutput] = useState<
    Array<{
      id: string
      timestamp: string
      command: string
      content: React.ReactNode
      type?: "command" | "error" | "success"
    }>
  >([])

  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [mobileActions, setMobileActions] = useState<TerminalAction[]>(() => getDefaultMobileActions())
  const [discoveryState, setDiscoveryState] = useState({
    basicCommandsUsed: 0,
    advancedCommandsUsed: 0,
    advancedUnlocked: false,
    easterEggsFound: [] as string[],
    showingHints: false,
  })

  // Load history and discovery state from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("terminal-history")
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }

      const savedDiscovery = localStorage.getItem("terminal-discovery")
      if (savedDiscovery) {
        setDiscoveryState(JSON.parse(savedDiscovery))
      }
    } catch {
      localStorage.removeItem("terminal-history")
      localStorage.removeItem("terminal-discovery")
    }
  }, [])

  // Update suggestions based on input
  useEffect(() => {
    if (input.trim()) {
      setSuggestions(getCommandSuggestions(input, discoveryState))
    } else {
      setSuggestions([])
    }
  }, [input, discoveryState])

  const executeCommand = useCallback(
    (command: string) => {
      const trimmedCommand = command.trim()
      if (!trimmedCommand) return

      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

      // Add to history
      const newHistory = [...history.filter((h) => h !== trimmedCommand), trimmedCommand].slice(-50)
      setHistory(newHistory)
      localStorage.setItem("terminal-history", JSON.stringify(newHistory))

      const resolved = resolveCommandInput(trimmedCommand)
      const result = runCommand(trimmedCommand, discoveryState)

      if (result.action === "clear") {
        setOutput([])
        setMobileActions(getDefaultMobileActions())
        return
      }

      const newDiscoveryState = { ...discoveryState }
      const unlockNotifications: React.ReactNode[] = []

      if (result.type !== "error" && resolved.command?.unlockGroup === "basic") {
        newDiscoveryState.basicCommandsUsed++
        if (
          newDiscoveryState.basicCommandsUsed >= terminalConfig.discovery.basicUnlockThreshold &&
          !newDiscoveryState.advancedUnlocked
        ) {
          newDiscoveryState.advancedUnlocked = true
          unlockNotifications.push(
            <div key="advanced-unlock" className="text-olive text-sm font-medium bg-olive/10 px-3 py-2 rounded border border-olive/20">
              🔓 {terminalConfig.discovery.advancedUnlockNotice}
            </div>
          )
        }
      }

      if (result.type !== "error" && resolved.command?.unlockGroup === "advanced") {
        newDiscoveryState.advancedCommandsUsed++
        if (
          newDiscoveryState.advancedCommandsUsed >= terminalConfig.discovery.advancedUnlockThreshold &&
          !newDiscoveryState.showingHints
        ) {
          newDiscoveryState.showingHints = true
          unlockNotifications.push(
            <div key="hints-unlock" className="text-teal-stone text-sm font-medium bg-teal-stone/10 px-3 py-2 rounded border border-teal-stone/20">
              ✧ {terminalConfig.discovery.secretUnlockNotice}
            </div>
          )
        }
      }

      if (
        result.type !== "error" &&
        resolved.command?.unlockGroup === "secret" &&
        !newDiscoveryState.easterEggsFound.includes(resolved.canonicalName)
      ) {
        newDiscoveryState.easterEggsFound = [...newDiscoveryState.easterEggsFound, resolved.canonicalName]
      }

      setDiscoveryState(newDiscoveryState)
      localStorage.setItem("terminal-discovery", JSON.stringify(newDiscoveryState))
      if (result.actions && result.actions.length > 0) {
        setMobileActions(result.actions)
      }

      // Combine result content with unlock notifications
      let finalContent = result.content
      if (unlockNotifications.length > 0) {
        finalContent = (
          <div className="space-y-4">
            {result.content}
            {unlockNotifications}
          </div>
        )
      }

      // Add to output
      const newBlock = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp,
        command: trimmedCommand,
        content: finalContent,
        type: result.type || ("command" as const),
      }

      setOutput((prev) => [...prev, newBlock])
    },
    [history, discoveryState],
  )

  const clearOutput = useCallback(() => {
    setOutput([])
    setMobileActions(getDefaultMobileActions())
  }, [])

  useEffect(() => {
    const handleTerminalCommand = (event: Event) => {
      const command = (event as CustomEvent<string>).detail
      if (command) executeCommand(command)
    }

    const handleReplayCommand = (event: Event) => {
      const detail = (event as CustomEvent<{ command?: string } | string>).detail
      const command = typeof detail === "string" ? detail : detail?.command
      if (command) executeCommand(command)
    }

    window.addEventListener("terminal-command", handleTerminalCommand)
    window.addEventListener("replayCommand", handleReplayCommand)
    window.addEventListener("terminal-clear", clearOutput)

    return () => {
      window.removeEventListener("terminal-command", handleTerminalCommand)
      window.removeEventListener("replayCommand", handleReplayCommand)
      window.removeEventListener("terminal-clear", clearOutput)
    }
  }, [clearOutput, executeCommand])

  return {
    output,
    input,
    setInput,
    executeCommand,
    history,
    historyIndex,
    setHistoryIndex,
    suggestions,
    mobileActions,
    clearOutput,
    discoveryState,
  }
}
