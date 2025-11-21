import Link from 'next/link'

import { getAllPosts } from '@/lib/posts'

export default function PostsIndexPage() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10 flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            所有文章
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            安静、有条理的阅读体验
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center text-slate-500 shadow">
            目前还没有内容，稍后再来看看吧。
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="group block rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm shadow-slate-900/5 backdrop-blur transition hover:-translate-y-1 hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-900/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-slate-900 group-hover:text-slate-700">
                      {post.title}
                    </h2>
                    <p className="line-clamp-2 text-sm leading-7 text-slate-600">
                      {post.content.slice(0, 140)}...
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm shadow-slate-900/10">
                    {post.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
