import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import GithubSlugger from 'github-slugger'
import React from 'react'

import { getPostBySlug, getPostSlugs } from '@/lib/posts'
import { ScrollActions } from '@/components/ScrollActions'

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({
    slug: slug.replace(/\.md$/, ''),
  }))
}

type PostParams = {
  slug: string
}

type PostPageProps = {
  params: PostParams | Promise<PostParams>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await Promise.resolve(params)
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const tocSlugger = new GithubSlugger()
  const headingSlugger = new GithubSlugger()
  const headings = extractHeadings(post.content, tocSlugger)

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="space-y-4 pb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {post.date}
          </p>
          <h1 className="text-4xl font-semibold leading-[1.1] text-slate-900">
            {post.title}
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="toc-scroll-container sticky top-24 max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white/90 p-0 shadow-sm shadow-slate-900/5">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
                <h3 className="text-sm font-semibold tracking-[0.2em] text-slate-600">
                  目录
                </h3>
                <ScrollActions variant="inline" showTop={false} />
              </div>
              <div className="space-y-4 px-6 py-4">
              {headings.length === 0 ? (
                <p className="text-sm text-slate-500">暂无目录</p>
              ) : (
                <nav className="space-y-2 text-sm text-slate-700">
                  {headings.map((heading) => (
                    <a
                      key={heading.slug}
                      href={`#${heading.slug}`}
                      className="block truncate rounded-md px-3 py-2 transition hover:bg-slate-100"
                      style={{ paddingLeft: `${(heading.depth - 1) * 12 + 12}px` }}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              )}
              </div>
            </div>
          </aside>

          <article className="relative rounded-3xl border border-slate-100 bg-white/90 p-10 shadow-lg shadow-slate-900/5 backdrop-blur">
            <ReactMarkdown
              className="markdown-body"
              remarkPlugins={[remarkGfm]}
              components={{
                img({ node, ...props }) {
                  return (
                    <img
                      {...props}
                      loading="lazy"
                      className="w-full max-h-[560px] object-contain rounded-xl border border-slate-100 shadow"
                    />
                  )
                },
                h1: (props) => renderHeading('h1', props, headingSlugger),
                h2: (props) => renderHeading('h2', props, headingSlugger),
                h3: (props) => renderHeading('h3', props, headingSlugger),
                h4: (props) => renderHeading('h4', props, headingSlugger),
                h5: (props) => renderHeading('h5', props, headingSlugger),
                h6: (props) => renderHeading('h6', props, headingSlugger),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
      <ScrollActions align="viewport" showBack={false} scrollSelector=".toc-scroll-container" />
    </main>
  )
}

type Heading = {
  depth: number
  text: string
  slug: string
}

function extractHeadings(markdown: string, slugger: GithubSlugger): Heading[] {
  slugger.reset()
  return markdown
    .split(/\r?\n/)
    .map((line) => {
      const match = /^(#{1,6})\s+(.+)$/.exec(line.trim())
      if (!match) return null
      const depth = match[1].length
      const text = match[2].trim()
      return {
        depth,
        text,
        slug: slugger.slug(text),
      }
    })
    .filter((item): item is Heading => Boolean(item))
}

function renderHeading(
  Tag: `h1` | `h2` | `h3` | `h4` | `h5` | `h6`,
  props: React.HTMLAttributes<HTMLHeadingElement>,
  slugger: GithubSlugger,
) {
  const text = getPlainText(props.children)
  const id = slugger.slug(text || Tag)

  return (
    <Tag id={id} {...props}>
      {props.children}
    </Tag>
  )
}

function getPlainText(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string') return child
      if (typeof child === 'number') return child.toString()
      if (React.isValidElement(child)) {
        const el = child as React.ReactElement<{ children?: React.ReactNode }>
        return getPlainText(el.props.children)
      }
      return ''
    })
    .join('')
}
