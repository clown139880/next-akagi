import ArticlesArchive from './archive'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Articles',
  description: 'UniClown 博客中的文章、专题写作与 ChatGPT 严选旧文。',
  alternates: { canonical: '/articles' },
})

export default function ArticlesPage() {
  return <ArticlesArchive />
}
