import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import { slug } from 'github-slugger'
import { sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

const POSTS_PER_PAGE = 15

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const publishedPosts = sortPosts(allBlogs.filter((post) => !post.draft))
  const latestPostDate = publishedPosts[0]?.lastmod || publishedPosts[0]?.date

  const articleRoutes = publishedPosts.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const mainRoutes = ['', 'blog', 'projects', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: latestPostDate,
  }))

  const totalBlogPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE)
  const blogPaginationRoutes = Array.from(
    { length: Math.max(totalBlogPages - 1, 0) },
    (_, index) => {
      const page = index + 2
      const firstPostOnPage = publishedPosts[(page - 1) * POSTS_PER_PAGE]
      return {
        url: `${siteUrl}/blog/page/${page}`,
        lastModified: firstPostOnPage?.lastmod || firstPostOnPage?.date || latestPostDate,
      }
    }
  )

  const tagCounts = tagData as Record<string, { count: number; lastmod: string }>
  const tagRoutes = Object.entries(tagCounts).flatMap(([tag, data]) => {
    const encodedTag = encodeURIComponent(tag)
    const totalPages = Math.ceil(data.count / POSTS_PER_PAGE)
    const routes: MetadataRoute.Sitemap = [
      {
        url: `${siteUrl}/tags/${encodedTag}`,
        lastModified: data.lastmod,
      },
    ]

    for (let page = 2; page <= totalPages; page += 1) {
      const tagPosts = publishedPosts.filter((post) =>
        post.tags?.some((item) => slug(item) === tag)
      )
      const firstPostOnPage = tagPosts[(page - 1) * POSTS_PER_PAGE]
      routes.push({
        url: `${siteUrl}/tags/${encodedTag}/page/${page}`,
        lastModified: firstPostOnPage?.lastmod || firstPostOnPage?.date || data.lastmod,
      })
    }

    return routes
  })

  return [...mainRoutes, ...blogPaginationRoutes, ...tagRoutes, ...articleRoutes]
}
