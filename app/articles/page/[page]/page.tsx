import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticlesArchive, { ARTICLES_PER_PAGE, articles } from '../../archive'
import { genPageMetadata } from 'app/seo'

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE)
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
    page: String(index + 2),
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ page: string }>
}): Promise<Metadata> {
  const { page } = await props.params
  return genPageMetadata({
    title: `Articles - 第 ${page} 页`,
    description: `UniClown 博客文章归档，第 ${page} 页。`,
    alternates: { canonical: `/articles/page/${page}` },
  })
}

export default async function ArticlesPage(props: { params: Promise<{ page: string }> }) {
  const { page } = await props.params
  const pageNumber = Number.parseInt(page, 10)
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE)

  if (!Number.isInteger(pageNumber) || pageNumber < 2 || pageNumber > totalPages) notFound()

  return <ArticlesArchive currentPage={pageNumber} />
}
