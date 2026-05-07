import type { ReactNode } from 'react'
import { getChartComponent } from '../charts/chartRegistry'
import storyMarkdown from '../data/story.md?raw'

type MarkdownBlock =
  | {
      type: 'heading'
      level: 1 | 2
      content: string
    }
  | {
      type: 'paragraph'
      content: string
    }
  | {
      type: 'list'
      items: string[]
    }
  | {
      type: 'chart'
      name: string
    }

function renderInlineMarkdown(text: string) {
  const parts: ReactNode[] = []
  const tokenPattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0

  text.replace(tokenPattern, (match, _token, offset: number) => {
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset))
    }

    if (match.startsWith('**')) {
      parts.push(<strong key={`${match}-${offset}`}>{match.slice(2, -2)}</strong>)
    } else if (match.startsWith('*')) {
      parts.push(<em key={`${match}-${offset}`}>{match.slice(1, -1)}</em>)
    } else {
      const linkMatch = match.match(/^\[([^\]]+)\]\(([^)]+)\)$/)

      if (linkMatch) {
        parts.push(
          <a href={linkMatch[2]} key={`${match}-${offset}`}>
            {linkMatch[1]}
          </a>,
        )
      }
    }

    lastIndex = offset + match.length
    return match
  })

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

function parseMarkdown(markdown: string) {
  const blocks: MarkdownBlock[] = []
  const lines = markdown.split(/\r?\n/)
  let paragraph: string[] = []
  let listItems: string[] = []

  function flushParagraph() {
    if (paragraph.length > 0) {
      blocks.push({
        type: 'paragraph',
        content: paragraph.join(' '),
      })
      paragraph = []
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({
        type: 'list',
        items: listItems,
      })
      listItems = []
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    const chartMatch = trimmed.match(/^chart\(([-a-zA-Z0-9_]+)\)$/)

    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    if (chartMatch) {
      flushParagraph()
      flushList()
      blocks.push({
        type: 'chart',
        name: chartMatch[1],
      })
      return
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph()
      flushList()
      blocks.push({
        type: 'heading',
        level: 2,
        content: trimmed.slice(3),
      })
      return
    }

    if (trimmed.startsWith('# ')) {
      flushParagraph()
      flushList()
      blocks.push({
        type: 'heading',
        level: 1,
        content: trimmed.slice(2),
      })
      return
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph()
      listItems.push(trimmed.slice(2))
      return
    }

    flushList()
    paragraph.push(trimmed)
  })

  flushParagraph()
  flushList()

  return blocks
}

function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <>
      {parseMarkdown(markdown).map((block, index) => {
        if (block.type === 'heading' && block.level === 1) {
          return <h2 key={`${block.content}-${index}`}>{block.content}</h2>
        }

        if (block.type === 'heading') {
          return <h3 key={`${block.content}-${index}`}>{block.content}</h3>
        }

        if (block.type === 'list') {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{renderInlineMarkdown(item)}</li>
              ))}
            </ul>
          )
        }

        if (block.type === 'chart') {
          const ChartComponent = getChartComponent(block.name)

          if (!ChartComponent) {
            return (
              <p className="chart-missing" key={`chart-${block.name}-${index}`}>
                Chart "{block.name}" is not registered.
              </p>
            )
          }

          return <ChartComponent key={`chart-${block.name}-${index}`} />
        }

        return (
          <p key={`${block.content}-${index}`}>
            {renderInlineMarkdown(block.content)}
          </p>
        )
      })}
    </>
  )
}

export function StorySection() {
  return (
    <section className="story-panel" aria-label="Country comparison story">
      <MarkdownContent markdown={storyMarkdown} />
    </section>
  )
}
