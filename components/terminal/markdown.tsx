// Renders Markdown that was converted to HTML at build time from our own content/ files.
// Internal links (href="/work") are intercepted by the terminal so they run as commands.
export function Markdown({ html }: { html: string }) {
  return <div className="md" dangerouslySetInnerHTML={{ __html: html }} />
}
