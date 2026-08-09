import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { genPageMetadata } from 'app/seo'

const POSTS_PER_PAGE = 15

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    page: (i + 2).toString(),
  }))

  return paths
}

export async function generateMetadata(props: {
  params: Promise<{ page: string }>
}): Promise<Metadata> {
  const { page } = await props.params
  return genPageMetadata({
    title: `全部内容 - 第 ${page} 页`,
    description: `UniClown 的文章与闲谈，第 ${page} 页。`,
    alternates: { canonical: `/blog/page/${page}` },
  })
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const posts = allCoreContent(sortPosts(allBlogs))
  const pageNumber = Number.parseInt(params.page, 10)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) {
    notFound()
  }
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages,
  }

  return (
    <ListLayout
      posts={initialDisplayPosts}
      pagination={pagination}
      paginationBasePath="/blog"
      title="All Posts"
    />
  )
}
