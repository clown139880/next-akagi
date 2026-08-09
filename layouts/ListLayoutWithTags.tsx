/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import Image from 'next/image'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  pagination?: PaginationProps
  paginationBasePath?: string
}

function getPageItems(currentPage: number, totalPages: number) {
  const pages = new Set([1, totalPages])
  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page > 0 && page <= totalPages) pages.add(page)
  }

  const sortedPages = [...pages].sort((a, b) => a - b)
  return sortedPages.flatMap<number | 'ellipsis'>((page, index) => {
    const previousPage = sortedPages[index - 1]
    return previousPage && page - previousPage > 1 ? ['ellipsis', page] : [page]
  })
}

function Pagination({ totalPages, currentPage, basePath }: PaginationProps & { basePath: string }) {
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages
  const pageHref = (page: number) => (page === 1 ? basePath : `${basePath}/page/${page}`)
  const pageItems = getPageItems(currentPage, totalPages)

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav aria-label="分页导航" className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-16">
          {prevPage && (
            <Link href={pageHref(currentPage - 1)} rel="prev">
              上一页
            </Link>
          )}
        </div>
        <ol
          className="flex items-center gap-1"
          aria-label={`第 ${currentPage} 页，共 ${totalPages} 页`}
        >
          {pageItems.map((item, index) =>
            item === 'ellipsis' ? (
              <li key={`ellipsis-${index}`} className="px-2 text-gray-400" aria-hidden="true">
                …
              </li>
            ) : (
              <li key={item}>
                <Link
                  href={pageHref(item)}
                  aria-current={item === currentPage ? 'page' : undefined}
                  aria-label={`第 ${item} 页`}
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 ${
                    item === currentPage
                      ? 'bg-primary-500 font-semibold text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary-500 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {item}
                </Link>
              </li>
            )
          )}
        </ol>
        <div className="min-w-16 text-right">
          {nextPage && (
            <Link href={pageHref(currentPage + 1)} rel="next">
              下一页
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  pagination,
  paginationBasePath = '/blog',
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, { count: number; lastmod: string }>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) =>
    tagCounts[b].lastmod.localeCompare(tagCounts[a].lastmod)
  )
  const currentTagSegment = pathname.split('/tags/')[1]?.split('/')[0]
  const currentTag = currentTagSegment ? decodeURIComponent(currentTagSegment) : undefined
  const visibleTags = sortedTags.slice(0, 30)
  if (currentTag && !visibleTags.includes(currentTag) && tagCounts[currentTag]) {
    visibleTags.push(currentTag)
  }

  return (
    <>
      <div>
        <div className="pb-6 pt-6">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded bg-gray-50 pt-5 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40 sm:flex">
            <div className="px-6 py-4">
              {pathname.startsWith('/blog') ? (
                <h3 className="font-bold uppercase text-primary-500">All Posts</h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="font-bold uppercase text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                >
                  All Posts
                </Link>
              )}
              <ul>
                {visibleTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {currentTag === slug(t) ? (
                        <h3 className="inline px-3 py-2 text-sm font-bold uppercase text-primary-500">
                          {`${t} (${tagCounts[t].count})`}
                        </h3>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t].count})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
                <li className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-800">
                  <Link
                    href="/tags"
                    className="px-3 py-2 text-sm font-semibold text-primary-500 hover:text-primary-600"
                  >
                    查看全部标签 →
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <ul>
              {posts.map((post, index) => {
                const { path, date, title, summary, tags, images } = post
                const isShortPost = !title
                const followsShortPost = isShortPost && index > 0 && !posts[index - 1].title
                const precedesShortPost =
                  isShortPost && index < posts.length - 1 && !posts[index + 1].title
                return (
                  <li key={path} className={isShortPost ? 'py-4' : 'py-8'}>
                    <article
                      className={`relative flex flex-col space-y-3 ${
                        isShortPost
                          ? 'py-2 pl-6 sm:pl-8'
                          : 'border-t border-gray-200 pt-8 dark:border-gray-800'
                      }`}
                    >
                      {isShortPost && (
                        <>
                          <span
                            className={`absolute left-0 w-px bg-primary-500/25 ${
                              followsShortPost ? '-top-4' : 'top-4'
                            } ${precedesShortPost ? '-bottom-4' : 'bottom-0'}`}
                            aria-hidden="true"
                          />
                          <span
                            className="absolute -left-[4px] top-4 h-[9px] w-[9px] rounded-full bg-primary-500 ring-4 ring-white dark:ring-gray-950"
                            aria-hidden="true"
                          />
                        </>
                      )}
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <Link
                            href={`/${path}`}
                            aria-label={`查看 ${formatDate(date, siteMetadata.locale)} 发布的内容`}
                            className="inline-flex items-center gap-2 hover:text-primary-500"
                          >
                            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                          </Link>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          {title && (
                            <h2 className="text-2xl font-bold leading-8 tracking-tight">
                              <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                                {title}
                              </Link>
                            </h2>
                          )}
                          <div className="flex flex-wrap">
                            {tags?.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div
                          className={`prose whitespace-break-spaces [line-break:strict] [text-wrap:pretty] ${
                            isShortPost
                              ? 'max-w-[68ch] text-[1.0625rem] leading-[1.95] tracking-[0.006em] text-gray-700 dark:text-gray-300'
                              : 'max-w-none text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {summary}
                        </div>
                        {images?.[0] && (
                          <Image
                            src={images?.[0]}
                            alt={`Cover Image for ${title}`}
                            width={800}
                            height={400}
                            className="rounded-lg"
                          />
                        )}
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                basePath={paginationBasePath}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
