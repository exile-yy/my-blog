import Link from 'next/link'

import { getAllPosts } from '@/lib/posts'

export default function Home() {
  const posts = getAllPosts()
  const featured = posts.slice(0, 3)

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-16 space-y-14">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 px-8 py-10 text-white shadow-2xl shadow-slate-900/20">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-200/80">
            前言
          </p>
          <h2 className="mt-4 text-2xl font-semibold leading-relaxed">
            如果你真有丰富的精神世界，那就让它变成直实可感的作品，去传播、去售卖、去帮助他人，让它成为你的语言，而不是执着于别人能否懂你的深度。等待理解，不过是廉价的安慰，即使有人懂了，又能怎样？真正值得做的，是用写作、创作、绘画、音乐、录制、摄影、表达等等你认为最适合你的方式，把内心世界解剖出来，然后把你的作品抛向这片喧嚣的现实，让它在碰撞中被感知、被铭记，成为你精神的烙印。这也是我做这个博客的原因之一。
          </h2>
        </section>

        <header className="flex flex-col gap-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            写作，分享，保持好奇
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
            轻盈的博客体验，灵感与思考在这里沉淀。
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/posts"
              className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              浏览全部文章
            </Link>
            <Link
              href="#latest"
              className="inline-flex items-center rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
            >
              查看最新
            </Link>
          </div>
        </header>

        <section
          id="latest"
          className="grid gap-6 rounded-3xl bg-white/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur md:grid-cols-3"
        >
          {featured.length === 0 ? (
            <div className="col-span-3 flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
              还没有文章，稍后再来探索。
            </div>
          ) : (
            featured.map((post) => (
              <article
                key={post.slug}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/60 p-6 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100/40 via-transparent to-slate-200/40 opacity-0 transition group-hover:opacity-100" />
                <div className="relative flex flex-col gap-4">
                  <span className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                    {post.date}
                  </span>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {post.title}
                  </h2>
                  <p className="line-clamp-3 text-sm leading-7 text-slate-600">
                    {post.content.slice(0, 120)}...
                  </p>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 transition group-hover:translate-x-1"
                  >
                    阅读全文
                    <span aria-hidden className="text-slate-400">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  )
}
