import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayoutWithTags'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

const POSTS_PER_PAGE = 15

function getPostsForTag(tag: string, encodedTag: string) {
  return allCoreContent(
    sortPosts(
      allBlogs.filter(
        (post) =>
          post.tags &&
          (post.tags.includes(tag) ||
            post.tags.map((item) => slug(item)).includes(tag) ||
            post.tags.map((item) => encodeURI(item)).includes(encodedTag))
      )
    )
  )
}

export async function generateMetadata(props: {
  params: Promise<{ tag: string; page: string }>
}): Promise<Metadata> {
  const { tag: encodedTag, page } = await props.params
  const tag = decodeURI(decodeURI(encodedTag))
  return genPageMetadata({
    title: `${tag} 标签 - 第 ${page} 页`,
    description: `${siteMetadata.title} 中与 ${tag} 相关的文章与闲谈，第 ${page} 页。`,
    alternates: { canonical: `/tags/${encodedTag}/page/${page}` },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, { count: number }>

  return Object.entries(tagCounts).flatMap(([tag, data]) => {
    const totalPages = Math.ceil(data.count / POSTS_PER_PAGE)
    return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
      tag: encodeURI(tag),
      page: String(index + 2),
    }))
  })
}

export default async function TagPage(props: { params: Promise<{ tag: string; page: string }> }) {
  const params = await props.params
  const tag = decodeURI(decodeURI(params.tag))
  const pageNumber = Number.parseInt(params.page, 10)
  const posts = getPostsForTag(tag, params.tag)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) {
    notFound()
  }

  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )

  return (
    <ListLayout
      posts={initialDisplayPosts}
      pagination={{ currentPage: pageNumber, totalPages }}
      paginationBasePath={`/tags/${params.tag}`}
      title={title}
    />
  )
}
