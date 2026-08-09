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
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
  paginationBasePath?: string
}

function Pagination({ totalPages, currentPage, basePath }: PaginationProps & { basePath: string }) {
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages
  const pageHref = (page: number) => (page === 1 ? basePath : `${basePath}/page/${page}`)

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link href={pageHref(currentPage - 1)} rel="prev">
            上一页
          </Link>
        )}
        <span>
          {currentPage} / {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={pageHref(currentPage + 1)} rel="next">
            下一页
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  paginationBasePath = '/blog',
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, { count: number; lastmod: string }>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) =>
    tagCounts[b].lastmod.localeCompare(tagCounts[a].lastmod)
  )

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

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
                {sortedTags.map((t) => {
                  return (
                    <li key={t} className="my-3">
                      {pathname.split('/tags/')[1] === slug(t) ? (
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
              </ul>
            </div>
          </div>
          <div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags, images } = post
                const isShortPost = !title
                return (
                  <li key={path} className="py-5">
                    <article
                      className={`flex flex-col space-y-3 rounded-2xl px-4 py-5 sm:px-6 ${
                        isShortPost
                          ? 'bg-gray-50/80 ring-1 ring-gray-200/70 dark:bg-gray-900/40 dark:ring-gray-800'
                          : ''
                      }`}
                    >
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <Link
                            href={`/${path}`}
                            aria-label={`查看 ${formatDate(date, siteMetadata.locale)} 发布的内容`}
                            className="inline-flex items-center gap-2 hover:text-primary-500"
                          >
                            {isShortPost && (
                              <span
                                className="h-2 w-2 rounded-full bg-primary-500"
                                aria-hidden="true"
                              />
                            )}
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
                        <div className="prose max-w-none whitespace-break-spaces text-gray-500 dark:text-gray-400">
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
