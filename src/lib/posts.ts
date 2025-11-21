import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// All markdown content lives under src/content so keep the path explicit
const postsDirectory = path.join(process.cwd(), 'src', 'content')

// 获取所有文章的文件名
export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory)
}

// 根据 slug 获取文章内容
export function getPostBySlug(slug?: string | string[]) {
  // 正常化 slug，避免 undefined、空字符串或数组导致读取失败
  const rawSlug = Array.isArray(slug) ? slug[0] : slug
  if (!rawSlug) {
    return null
  }

  const realSlug = rawSlug.trim().replace(/\.md$/, '')
  const filePath = path.join(postsDirectory, `${realSlug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')

  const { data, content } = matter(fileContents)

  return {
    slug: realSlug,
    title: data.title as string,
    date: data.date as string,
    content,
  }
}

// 获取所有文章列表（按时间降序排序）
export function getAllPosts() {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => Boolean(post))
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}
