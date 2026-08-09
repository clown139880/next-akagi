import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { allBlogs } from 'contentlayer/generated'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'

export const ARTICLES_PER_PAGE = 12

export const articles = allBlogs
  .filter(
    (post) =>
      !post.draft &&
      Boolean(post.title) &&
      Boolean(post.summary) &&
      post.title !== 'GooglePlus' &&
      !post.tags?.includes('歌词收录') &&
      post.contentChars >= 500
  )
  .map((post) => ({ post, length: post.contentChars }))
  .sort((a, b) => new Date(b.post.date).getTime() - new Date(a.post.date).getTime())

const curatedArticlePaths = [
  'blog/2025年9月-退休生活开启',
  'blog/黑神话：悟空',
  'blog/记录一下这个月发生的灾难',
  'blog/庆贺吧此刻正是Baby的诞生瞬间/写在2021年春',
  'blog/不知所措才是人生/不知所措才是人生-114',
  'blog/不知所措才是人生/不知所措才是人生-102',
  'blog/再见我去乐园了——异度之刃2-攻略记录/再见我去乐园了——异度之刃2-攻略记录-227',
  'blog/路人女主的养成方法/路人女主的养成方法-196',
]

const articlesByPath = new Map(articles.map((item) => [item.post.path, item]))
const curatedArticles = curatedArticlePaths.flatMap((path) => {
  const article = articlesByPath.get(path)
  return article ? [article] : []
})

function pageHref(page: number) {
  return page === 1 ? '/articles' : `/articles/page/${page}`
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  return (
    <nav
      aria-label="文章分页"
      className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6 text-sm dark:border-gray-800"
    >
      <div className="min-w-20">
        {currentPage > 1 && (
          <Link href={pageHref(currentPage - 1)} rel="prev">
            ← 上一页
          </Link>
        )}
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <Link
            key={page}
            href={pageHref(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 ${
              page === currentPage
                ? 'bg-primary-500 font-semibold text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-primary-500 dark:text-gray-400 dark:hover:bg-gray-900'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>
      <div className="min-w-20 text-right">
        {currentPage < totalPages && (
          <Link href={pageHref(currentPage + 1)} rel="next">
            下一页 →
          </Link>
        )}
      </div>
    </nav>
  )
}

function ArticleRow({
  item,
  index,
  numbered = true,
}: {
  item: (typeof articles)[number]
  index: number
  numbered?: boolean
}) {
  const { post, length } = item
  return (
    <article className="group grid gap-3 border-b border-gray-200 py-7 dark:border-gray-800 sm:grid-cols-[3rem_1fr_auto] sm:gap-5">
      <span className="hidden pt-1 font-mono text-sm text-gray-300 dark:text-gray-700 sm:block">
        {numbered ? String(index + 1).padStart(2, '0') : '—'}
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

export default function ArticlesArchive({ currentPage = 1 }: { currentPage?: number }) {
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE)
  const pageArticles = articles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  )

  return (
    <div className="mx-auto max-w-4xl pb-16 pt-10 md:pt-24">
      <header className="mb-14 max-w-3xl">
        <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-primary-500">ARTICLES</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 md:text-6xl">
          Articles
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-500 dark:text-gray-400">
          有标题、有摘要，也值得离开时间线单独阅读的文章。
        </p>
      </header>

      {currentPage === 1 && (
        <section className="mb-20" aria-labelledby="curated-articles">
          <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
            <h2
              id="curated-articles"
              className="text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
              ChatGPT 严选
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              八篇关于人生、游戏与写作的代表作，由 ChatGPT 阅读整理后选出
            </p>
          </div>
          {curatedArticles.map((item, index) => (
            <ArticleRow key={item.post.path} item={item} index={index} />
          ))}
        </section>
      )}

      <section aria-labelledby="all-articles">
        <div className="flex items-end justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
          <div>
            <h2 id="all-articles" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              全部文章
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              按发布时间倒序 · 第 {currentPage} / {totalPages} 页
            </p>
          </div>
          <span className="hidden text-sm text-gray-400 sm:block">共 {articles.length} 篇</span>
        </div>
        {pageArticles.map((item, index) => (
          <ArticleRow
            key={item.post.path}
            item={item}
            index={(currentPage - 1) * ARTICLES_PER_PAGE + index}
            numbered={false}
          />
        ))}
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </section>
    </div>
  )
}
