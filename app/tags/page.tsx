import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: '标签与专题',
  description: '从专题和标签发现博客里的长期写作',
})

type TagStats = {
  count: number
  lastmod: string
  totalChars: number
  longPosts: number
}

const featuredTagNames = [
  '小市民',
  '败犬女主太多了',
  '命运石之门',
  '异度之刃2',
  '不知所措才是人生',
  '舞动青春',
  '3月的狮子',
]

export default async function Page() {
  const tagCounts = tagData as Record<string, TagStats>
  const tagKeys = Object.keys(tagCounts)
  const featuredTags = featuredTagNames.filter((tag) => tagCounts[tag])
  const allTags = [...tagKeys].sort(
    (a, b) =>
      tagCounts[b].count - tagCounts[a].count ||
      tagCounts[b].totalChars - tagCounts[a].totalChars ||
      a.localeCompare(b, 'zh-CN')
  )
  const popularTags = allTags.slice(0, 8)
  const recentTags = [...tagKeys]
    .sort((a, b) => tagCounts[b].lastmod.localeCompare(tagCounts[a].lastmod))
    .slice(0, 8)

  return (
    <div className="mx-auto max-w-5xl pb-16 pt-10 md:pt-24">
      <header className="mb-14 max-w-3xl">
        <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-primary-500">ARCHIVE</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-6xl">
          从一个主题，走进一段时间
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-500 dark:text-gray-400">
          有些内容只是一瞬间的念头，有些则在几年里反复出现。这里先陈列那些已经长成系列的写作。
        </p>
      </header>

      <section aria-labelledby="collections-heading">
        <div className="mb-6 flex items-end justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
          <div>
            <h2
              id="collections-heading"
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              专题与系列
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              近期仍在生长，也值得从第一篇慢慢读下去
            </p>
          </div>
          <span className="hidden text-sm text-gray-400 sm:block">
            {featuredTags.length} 个专题
          </span>
        </div>
        <div className="grid gap-x-12 md:grid-cols-2">
          {featuredTags.map((tag, index) => {
            const stats = tagCounts[tag]
            return (
              <Link
                key={tag}
                href={`/tags/${slug(tag)}`}
                className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-3 border-b border-gray-200 py-6 text-gray-900 transition-colors hover:border-primary-400 dark:border-gray-800 dark:text-gray-100"
              >
                <span className="font-mono text-sm text-gray-300 transition-colors group-hover:text-primary-400 dark:text-gray-700">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-lg font-semibold leading-7 group-hover:text-primary-500">
                  {tag}
                </span>
                <span className="whitespace-nowrap text-xs text-gray-400">
                  {stats.count} 篇 · {stats.totalChars.toLocaleString('zh-CN')} 字
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mt-16 grid gap-12 md:grid-cols-2" aria-label="标签榜单">
        {[
          { title: '文章最多', description: '长期反复写到的主题', tags: popularTags },
          { title: '最近更新', description: '近期仍在生长的话题', tags: recentTags },
        ].map((group) => (
          <div key={group.title}>
            <div className="mb-3 border-b border-gray-200 pb-4 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{group.title}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{group.description}</p>
            </div>
            <ol>
              {group.tags.map((tag, index) => (
                <li key={tag}>
                  <Link
                    href={`/tags/${slug(tag)}`}
                    className="group grid grid-cols-[2rem_1fr_auto] items-baseline gap-2 border-b border-gray-100 py-3 text-sm dark:border-gray-900"
                  >
                    <span className="font-mono text-xs text-gray-300 dark:text-gray-700">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-gray-700 transition-colors group-hover:text-primary-500 dark:text-gray-300">
                      {tag}
                    </span>
                    <span className="text-xs text-gray-400">{tagCounts[tag].count} 篇</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>

      <section className="mt-16" aria-labelledby="all-tags-heading">
        <details>
          <summary className="group flex cursor-pointer list-none items-center justify-between border-y border-gray-200 py-5 dark:border-gray-800">
            <div>
              <h2
                id="all-tags-heading"
                className="text-xl font-bold text-gray-900 dark:text-gray-100"
              >
                浏览全部标签
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                按文章数量排列，共 {allTags.length} 个
              </p>
            </div>
            <span className="text-2xl font-light text-gray-400 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="flex flex-wrap gap-x-3 gap-y-3 pt-8">
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${slug(tag)}`}
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-primary-950/40 dark:hover:text-primary-400"
              >
                <span>{tag}</span>
                <span className="text-xs text-gray-400">{tagCounts[tag].count}</span>
              </Link>
            ))}
          </div>
        </details>
      </section>
    </div>
  )
}
