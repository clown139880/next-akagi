import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { allBlogs } from 'contentlayer/generated'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Articles',
  description: 'UniClown 博客中完整文章、专题写作与值得重读的旧文。',
  alternates: { canonical: '/essays' },
})

const longPosts = allBlogs
  .filter(
    (post) =>
      !post.draft &&
      Boolean(post.title) &&
      Boolean(post.summary) &&
      post.title !== 'GooglePlus' &&
      !post.tags?.includes('歌词收录')
  )
  .map((post) => ({ post, length: post.contentChars }))
  .filter(({ length }) => length >= 500)

const recentPosts = [...longPosts]
  .filter(({ post }) => new Date(post.date).getFullYear() >= 2021)
  .sort((a, b) => new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
  .slice(0, 8)

const rediscoveredPosts = [...longPosts]
  .filter(({ post }) => new Date(post.date).getFullYear() < 2021)
  .sort(
    (a, b) =>
      b.length - a.length || new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
  )
  .slice(0, 24)

function ArticleRow({ item, index }: { item: (typeof longPosts)[number]; index: number }) {
  const { post, length } = item
  return (
    <article className="group grid gap-3 border-b border-gray-200 py-7 dark:border-gray-800 sm:grid-cols-[3rem_1fr_auto] sm:gap-5">
      <span className="hidden pt-1 font-mono text-sm text-gray-300 dark:text-gray-700 sm:block">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
          <time dateTime={post.date}>{formatDate(post.date, siteMetadata.locale)}</time>
          <span>{length.toLocaleString('zh-CN')} 字</span>
        </div>
        <h3 className="text-xl font-bold leading-8 tracking-tight sm:text-2xl">
          <Link
            href={`/${post.path}`}
            className="text-gray-900 transition-colors group-hover:text-primary-500 dark:text-gray-100"
          >
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-2 leading-7 text-gray-500 dark:text-gray-400">
          {post.summary}
        </p>
        <div className="mt-3 flex flex-wrap">
          {post.tags?.slice(0, 3).map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
      </div>
      <span className="hidden pt-8 text-xl text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-400 dark:text-gray-700 sm:block">
        →
      </span>
    </article>
  )
}

export default function EssaysPage() {
  return (
    <div className="mx-auto max-w-4xl pb-16 pt-10 md:pt-24">
      <header className="mb-14 max-w-3xl">
        <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-primary-500">
          CURATED WRITING
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-6xl">
          Articles
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-500 dark:text-gray-400">
          文章与长篇。从时间线里暂时抽离出来，集中陈列拥有完整主题、值得重新被看见的写作。
        </p>
      </header>

      {recentPosts.length > 0 && (
        <section className="mb-20" aria-labelledby="recent-longreads">
          <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
            <h2
              id="recent-longreads"
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              最近文章
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">近几年写下的正式文章</p>
          </div>
          {recentPosts.map((item, index) => (
            <ArticleRow key={item.post.path} item={item} index={index} />
          ))}
        </section>
      )}

      <section aria-labelledby="rediscovered-longreads">
        <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
          <h2
            id="rediscovered-longreads"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          >
            旧文拾遗
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            从旧时间线里重新捞出的文章，优先展示内容更完整的写作
          </p>
        </div>
        {rediscoveredPosts.map((item, index) => (
          <ArticleRow key={item.post.path} item={item} index={index} />
        ))}
      </section>
    </div>
  )
}
