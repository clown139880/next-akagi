import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

const POSTS_PER_PAGE = 15

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(decodeURI(params.tag))
  return genPageMetadata({
    title: `${tag} 标签`,
    description: `${siteMetadata.title} 中与 ${tag} 相关的文章与闲谈。`,
    alternates: {
      canonical: `/tags/${params.tag}`,
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData
  const tagKeys = Object.keys(tagCounts)
  const paths = tagKeys.map((tag) => ({
    tag: encodeURI(tag),
  }))
  return paths
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(decodeURI(params.tag))

  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter(
        (post) =>
          post.tags &&
          (post.tags.includes(tag) ||
            post.tags.map((t) => slug(t)).includes(tag) ||
            post.tags.map((t) => encodeURI(t)).includes(params.tag))
      )
    )
  )
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={initialDisplayPosts}
      pagination={pagination}
      paginationBasePath={`/tags/${params.tag}`}
      title={title}
    />
  )
}
