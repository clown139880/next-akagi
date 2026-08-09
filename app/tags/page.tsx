import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: '标签与专题',
  description: '从专题、常用标签和最近更新发现博客内容',
})

type TagStats = {
  count: number
  lastmod: string
  totalChars: number
  longPosts: number
}

const genericTags = new Set([
  '闲谈',
  '动画',
  '随笔',
  '人生',
  '游戏',
  '视频',
  'theolddays',
  '开发',
  '更新',
])

function TagLink({ tag, stats, detail }: { tag: string; stats: TagStats; detail?: boolean }) {
  return (
    <Link
      href={`/tags/${slug(tag)}`}
      className="group flex items-baseline justify-between gap-4 border-b border-gray-200 py-3 text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-500 dark:border-gray-800 dark:text-gray-300"
    >
      <span className="font-medium">{tag}</span>
      <span className="shrink-0 text-xs text-gray-400 group-hover:text-primary-400">
        {detail && stats.longPosts > 0 ? `${stats.longPosts} 篇长文 · ` : ''}
        {stats.count} 篇
      </span>
    </Link>
  )
}

export default async function Page() {
  const tagCounts = tagData as Record<string, TagStats>
  const tagKeys = Object.keys(tagCounts)
  const seriesTags = tagKeys
    .filter(
      (tag) => !genericTags.has(tag) && tagCounts[tag].count >= 2 && tagCounts[tag].longPosts >= 2
    )
    .sort(
      (a, b) =>
        tagCounts[b].longPosts - tagCounts[a].longPosts ||
        tagCounts[b].totalChars - tagCounts[a].totalChars ||
        tagCounts[b].count - tagCounts[a].count
    )
    .slice(0, 18)
  const popularTags = [...tagKeys]
    .sort(
      (a, b) =>
        tagCounts[b].count - tagCounts[a].count || tagCounts[b].totalChars - tagCounts[a].totalChars
    )
    .slice(0, 36)
  const recentTags = [...tagKeys]
    .sort((a, b) => tagCounts[b].lastmod.localeCompare(tagCounts[a].lastmod))
    .slice(0, 18)

  const sections = [
    {
      title: '系列与专题',
      description: '优先展示拥有多篇完整长文、内容积累较深的主题。',
      tags: seriesTags,
      detail: true,
    },
    {
      title: '常用标签',
      description: '按照文章数量排序，快速浏览博客里反复写到的内容。',
      tags: popularTags,
    },
    {
      title: '最近写到',
      description: '按照最近更新时间排序，看看近期出现过哪些话题。',
      tags: recentTags,
    },
  ]

  return (
    <div className="mx-auto max-w-5xl pb-12 pt-10 md:pt-24">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-6xl">
          标签与专题
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-500 dark:text-gray-400">
          标签不只是索引。这里把持续写过的系列、常见主题和最近关心的事情分开陈列。
        </p>
      </header>
      <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
        {sections.map((section, index) => (
          <section key={section.title} className={index === 0 ? 'md:col-span-2' : ''}>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {section.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                {section.description}
              </p>
            </div>
            <div className={index === 0 ? 'grid gap-x-10 md:grid-cols-3' : ''}>
              {section.tags.map((tag) => (
                <TagLink key={tag} tag={tag} stats={tagCounts[tag]} detail={section.detail} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
