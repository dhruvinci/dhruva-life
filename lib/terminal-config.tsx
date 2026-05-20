"use client"

import type React from "react"
import terminalConfigJson from "@/content/terminal-config.json"

export type CommandCategory = "Core" | "Utilities" | "Easter Eggs"
export type CommandTier = "basic" | "advanced" | "secret"
export type UnlockGroup = "basic" | "advanced" | "secret"
type Tone = "accent" | "olive" | "teal" | "muted" | "foreground" | "error"

export interface TerminalLink {
  label: string
  href?: string
  command?: string
}

export interface TerminalAction {
  label: string
  command: string
  tone?: "primary" | "muted" | "accent"
}

export interface ProjectItem {
  title: string
  slug: string
  cluster: string
  status: string
  year: string
  summary: string
  links: TerminalLink[]
}

export interface WritingPost {
  title: string
  slug: string
  date: string
  excerpt: string
  content: string
}

export interface LogEntry {
  date: string
  bullets: string[]
  links?: TerminalLink[]
}

export type RenderBlock =
  | { type: "heading"; text: string; tone?: Tone }
  | { type: "paragraph"; text: string; tone?: Tone }
  | { type: "muted"; text: string }
  | { type: "notice"; text: string; tone?: Tone }
  | { type: "linkList"; label?: string; links: TerminalLink[] }
  | { type: "keyValueList"; items: Array<{ label: string; value: string; href?: string }> }
  | { type: "projectList"; clusters?: string[] }
  | { type: "postList" }
  | { type: "logList" }
  | { type: "quoteList"; quotes: Array<{ quote: string; detail?: string }> }
  | { type: "directoryList"; items: string[] }

export interface ConfigCommand {
  name: string
  description: string
  category: CommandCategory
  tier: CommandTier
  aliases?: string[]
  unlockGroup?: UnlockGroup
  actions?: TerminalAction[]
  output: RenderBlock[]
}

interface TerminalConfig {
  site: {
    name: string
    tagline: string
    description: string
  }
  discovery: {
    basicUnlockThreshold: number
    advancedUnlockThreshold: number
    advancedUnlockNotice: string
    secretUnlockNotice: string
    lockedAdvancedTitle: string
    lockedAdvancedHint: string
    lockedAdvancedExamples: string
    lockedSecretTitle: string
    lockedSecretHint: string
    journeyPath: Array<{ command: string; label: string }>
    secretHints: Array<{ hint: string; command: string }>
  }
  collections: {
    projects: ProjectItem[]
    writingPosts: WritingPost[]
    logs: LogEntry[]
  }
  mobile: {
    defaultActions: TerminalAction[]
    menuGroups: Array<{ label: string; commands: string[] }>
  }
  commands: ConfigCommand[]
}

export const terminalConfig = terminalConfigJson as TerminalConfig
export const projects = terminalConfig.collections.projects
export const writingPosts = terminalConfig.collections.writingPosts
export const logs = terminalConfig.collections.logs
export const configuredCommands = terminalConfig.commands
export const defaultMobileActions = terminalConfig.mobile.defaultActions
export const mobileMenuGroups = terminalConfig.mobile.menuGroups

const toneClasses: Record<Tone, string> = {
  accent: "text-accent",
  olive: "text-olive",
  teal: "text-teal-stone",
  muted: "text-muted-foreground",
  foreground: "text-foreground",
  error: "text-destructive",
}

function dispatchTerminalCommand(command: string) {
  window.dispatchEvent(new CustomEvent("terminal-command", { detail: command }))
}

function renderLink(link: TerminalLink, className = "text-accent hover:underline") {
  const command = link.command

  if (command) {
    return (
      <button key={`${link.label}-${command}`} onClick={() => dispatchTerminalCommand(command)} className={className}>
        {link.label}
      </button>
    )
  }

  return (
    <a
      key={`${link.label}-${link.href || "#"}`}
      href={link.href || "#"}
      target={link.href?.startsWith("http") ? "_blank" : undefined}
      rel={link.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className={className}
    >
      {link.label}
    </a>
  )
}

function renderProjectLinks(links: TerminalLink[]) {
  if (links.length === 0) return null

  return (
    <div className="mt-1 space-x-2">
      {links.map((link) => (
        <span key={`${link.label}-${link.href || link.command}`}>
          [
          {renderLink(link, "text-accent text-xs hover:underline")}
          ]
        </span>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active" || status === "Concept"

  return (
    <span className={`text-xs px-2 py-1 rounded ${isActive ? "bg-accent/20 text-accent" : "bg-muted/20 text-muted-foreground"}`}>
      {status}
    </span>
  )
}

export function ProjectSummary({ project }: { project: ProjectItem }) {
  return (
    <div className="text-sm">
      <span className="text-foreground font-medium">{project.title}</span>
      <span className="text-muted-foreground mx-2">•</span>
      <span className="text-muted-foreground">{project.year}</span>
      <span className="ml-2">
        <StatusBadge status={project.status} />
      </span>
      <p className="text-muted-foreground/80 mt-1">{project.summary}</p>
      {renderProjectLinks(project.links)}
    </div>
  )
}

export function ProjectDetail({ project }: { project: ProjectItem }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-accent font-semibold text-lg">{project.title}</h3>
        <span className="text-xs bg-muted/20 text-muted-foreground px-2 py-1 rounded">{project.cluster}</span>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-muted-foreground">{project.year}</p>
      <p>{project.summary}</p>
      {project.links.length > 0 && <div className="space-x-3">{project.links.map((link) => renderLink(link))}</div>}
    </div>
  )
}

export function WritingPostDetail({ post }: { post: WritingPost }) {
  return (
    <div className="space-y-4">
      <h3 className="text-accent font-semibold text-lg">{post.title}</h3>
      <p className="text-muted-foreground text-sm">{post.date}</p>
      <div className="max-w-none whitespace-pre-line">
        <p>{post.content}</p>
      </div>
    </div>
  )
}

function renderBlock(block: RenderBlock, index: number): React.ReactNode {
  switch (block.type) {
    case "heading":
      return (
        <h3 key={index} className={`${toneClasses[block.tone || "accent"]} font-semibold text-lg`}>
          {block.text}
        </h3>
      )
    case "paragraph":
      return (
        <p key={index} className={`${block.tone ? toneClasses[block.tone] : ""} ${block.tone === "accent" ? "font-medium" : ""} whitespace-pre-line`}>
          {block.text}
        </p>
      )
    case "muted":
      return (
        <p key={index} className="text-muted-foreground/70 text-sm whitespace-pre-line">
          {block.text}
        </p>
      )
    case "notice":
      return (
        <div key={index} className={`${toneClasses[block.tone || "olive"]} text-sm font-medium bg-muted/10 px-3 py-2 rounded border border-border/30`}>
          {block.text}
        </div>
      )
    case "linkList":
      return (
        <div key={index} className="space-x-4 text-sm">
          {block.label && <span className="text-muted-foreground">{block.label}:</span>}
          {!block.label && <span className="text-muted-foreground">→</span>}
          {block.links.map((link) => renderLink(link))}
        </div>
      )
    case "keyValueList":
      return (
        <div key={index} className="space-y-2">
          {block.items.map((item) => (
            <p key={item.label}>
              <span className="text-muted-foreground">{item.label}:</span>{" "}
              {item.href ? renderLink({ label: item.value, href: item.href }) : item.value}
            </p>
          ))}
        </div>
      )
    case "projectList": {
      const clusters = block.clusters || [...new Set(projects.map((project) => project.cluster))]

      return (
        <div key={index} className="space-y-6">
          {clusters.map((cluster) => {
            const clusterProjects = projects.filter((project) => project.cluster === cluster)
            if (clusterProjects.length === 0) return null

            return (
              <div key={cluster}>
                <h4 className="text-accent font-medium mb-3">{cluster}</h4>
                <div className="space-y-2">
                  {clusterProjects.map((project) => (
                    <ProjectSummary key={project.slug} project={project} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )
    }
    case "postList":
      return (
        <div key={index} className="space-y-3">
          {writingPosts.map((post) => (
            <div key={post.slug} className="border-l-2 border-border/30 pl-4">
              <h4 className="text-foreground font-medium">{post.title}</h4>
              <p className="text-muted-foreground/80 text-sm mt-1">{post.excerpt}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                {renderLink({ label: "read more", command: `open ${post.slug}` }, "text-accent hover:underline")}
              </div>
            </div>
          ))}
        </div>
      )
    case "logList":
      return (
        <div key={index} className="space-y-4">
          {logs.map((log) => (
            <div key={log.date} className="border-l-2 border-border/30 pl-4">
              <h4 className="text-accent font-medium">{log.date}</h4>
              <ul className="mt-2 space-y-1">
                {log.bullets.map((bullet) => (
                  <li key={bullet} className="text-sm text-muted-foreground/80">
                    <span className="text-muted-foreground mr-2">•</span>
                    {bullet}
                  </li>
                ))}
              </ul>
              {log.links && renderProjectLinks(log.links)}
            </div>
          ))}
        </div>
      )
    case "quoteList":
      return (
        <div key={index} className="space-y-3">
          {block.quotes.map((item) => (
            <div key={item.quote} className="border-l-2 border-olive/30 pl-4">
              <p className="text-accent font-medium">&quot;{item.quote}&quot;</p>
              {item.detail && <p className="text-muted-foreground/80">{item.detail}</p>}
            </div>
          ))}
        </div>
      )
    case "directoryList":
      return (
        <div key={index} className="space-y-2">
          <p className="text-muted-foreground">Directories:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {block.items.map((item) => (
              <div key={item} className="text-accent">
                {item}
              </div>
            ))}
          </div>
        </div>
      )
    default:
      return null
  }
}

export function renderBlocks(blocks: RenderBlock[]) {
  return <div className="space-y-4">{blocks.map(renderBlock)}</div>
}

export function renderConfiguredCommand(command: ConfigCommand) {
  return renderBlocks(command.output)
}
