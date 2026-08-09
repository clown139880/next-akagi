import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Image from 'next/image'
import { unstable_ViewTransition as ViewTransition } from 'react'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  const displayPosts = posts.slice(0, MAX_DISPLAY)

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary-500">
            UniClown / Notes & Stories
          </p>
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            最近写下的
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul>
          {!posts.length && 'No posts found.'}
          {displayPosts.map((post, index) => {
            const { postId, slug, date, title, summary, tags, images } = post
            const isShortPost = !title
            const followsShortPost = isShortPost && index > 0 && !displayPosts[index - 1].title
            const precedesShortPost =
              isShortPost && index < displayPosts.length - 1 && !displayPosts[index + 1].title
            return (
              <li key={postId + slug} className={isShortPost ? 'py-5' : 'py-10 sm:py-14'}>
                <article
                  className={`relative transition-colors ${
                    isShortPost
                      ? 'py-2 pl-6 sm:pl-8'
                      : 'border-t border-gray-200 pt-10 dark:border-gray-800'
                  }`}
                >
                  {isShortPost && (
                    <>
                      <span
                        className={`absolute left-0 w-px bg-primary-500/25 ${
                          followsShortPost ? '-top-5' : 'top-4'
                        } ${precedesShortPost ? '-bottom-5' : 'bottom-0'}`}
                        aria-hidden="true"
                      />
                      <span
                        className="absolute -left-[4px] top-4 h-[9px] w-[9px] rounded-full bg-primary-500 ring-4 ring-white dark:ring-gray-950"
                        aria-hidden="true"
                      />
                    </>
                  )}
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <Link
                          href={`/blog/${slug}`}
                          aria-label={`查看 ${formatDate(date, siteMetadata.locale)} 发布的内容`}
                          className="inline-flex items-center gap-2 hover:text-primary-500"
                        >
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        </Link>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          {title && (
                            <ViewTransition name={title}>
                              <h2 className="text-2xl font-bold leading-8 tracking-tight sm:text-3xl">
                                <Link
                                  href={`/blog/${slug}`}
                                  className="text-gray-900 hover:text-primary-500 dark:text-gray-100"
                                >
                                  {title}
                                </Link>
                              </h2>
                            </ViewTransition>
                          )}
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div
                          className={`prose whitespace-break-spaces dark:text-gray-300 ${
                            isShortPost
                              ? 'max-w-[68ch] text-[1.0625rem] leading-[1.95] tracking-[0.006em] text-gray-700 [line-break:strict] [text-wrap:pretty]'
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
                      {title && (
                        <div className="text-base font-medium leading-6">
                          <Link
                            href={`/blog/${slug}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label={`阅读全文：${title}`}
                          >
                            阅读全文 &rarr;
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            查看所有内容 &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
