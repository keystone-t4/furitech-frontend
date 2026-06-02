import MarkdownIt from 'markdown-it'
import DOMPurify from 'isomorphic-dompurify'

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
  html: false,
})

export function renderMarkdown(content: string) {
  return DOMPurify.sanitize(md.render(content))
}
