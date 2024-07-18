import * as fs from 'fs'
import * as path from 'path'

interface PostMetadata {
  postId: number
  title: string
  date: string
  lastmod: string
  tags: string[]
  draft: boolean
  summary: string
  images: string[]
  authors: string[]
  content: string
}

function parseYAML(yamlString: string): any {
  const lines = yamlString.split('\n')
  const result: any = {}
  let currentKey = ''

  lines.forEach((line) => {
    if (line.trim().startsWith('-')) {
      result[currentKey] = result[currentKey] || []
      result[currentKey].push(line.trim().slice(1).trim().replace(/['"]/g, ''))
    } else {
      const [key, ...value] = line.split(':')
      currentKey = key.trim()
      const keyValue = value.join(':').trim().replace(/['"]/g, '')
      if (keyValue.startsWith('[') && keyValue.endsWith(']')) {
        // tags: ['tag1', 'tag2', 'tag3']

        result[currentKey] = keyValue
          .slice(1, -1)
          .split(',')
          .map((tag) => tag.trim())
      } else {
        result[currentKey] = keyValue
      }
    }
  })

  return result
}

function readPost(filePath: string): PostMetadata {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const [yamlContent, ...contentParts] = fileContent.split('---').slice(1)
  const data = parseYAML(yamlContent.trim())
  const content = contentParts.join('---').trim()

  return {
    postId: parseInt(data.postId, 10),
    title: data.title,
    date: data.date,
    lastmod: data.lastmod,
    tags: data.tags ? data.tags.map((tag: string) => tag.trim()) : [],
    draft: data.draft === 'true',
    summary: data.summary,
    images: data.images ? data.images.map((image: string) => image.trim()) : [],
    authors: data.authors ? data.authors.map((author: string) => author.trim()) : [],
    content,
  }
}

function mergePosts(posts: PostMetadata[]): PostMetadata {
  const mergedPost: PostMetadata = {
    postId: Math.min(...posts.map((post) => post.postId)),
    title: 'GooglePlus',
    date: posts.reduce((prev, curr) => (prev < curr.date ? prev : curr.date), posts[0].date),
    lastmod: posts.reduce((prev, curr) => (prev > curr.date ? prev : curr.date), posts[0].date),
    tags: Array.from(new Set(posts.flatMap((post) => post.tags))),
    draft: false,
    summary: '',
    images: Array.from(new Set(posts.flatMap((post) => post.images))),
    authors: ['default'],
    content: posts.map((post) => `posted at ${post.date}\n${post.content}`).join('\n\n'),
  }

  return mergedPost
}

function saveMergedPost(filePath: string, post: PostMetadata): void {
  const yamlContent = [
    `postId: ${post.postId}`,
    `title: '${post.title}'`,
    `date: '${post.date}'`,
    `lastmod: '${post.lastmod}'`,
    `tags: [${post.tags.map((tag) => `'${tag}'`).join(', ')}]`,
    `draft: ${post.draft}`,
    `summary: '${post.summary}'`,
    `images: [${post.images.map((image) => `'${image}'`).join(', ')}]`,
    `authors: [${post.authors.map((author) => `'${author}'`).join(', ')}]`,
  ].join('\n')

  const fullContent = `---\n${yamlContent}\n---\n\n${post.content}`
  fs.writeFileSync(filePath, fullContent, 'utf8')
}

function main() {
  const directoryPath = path.resolve('./data/blog/GooglePlus') // 你需要处理的目录路径
  const outputFilePath = path.resolve('merged-post.mdx') // 输出文件路径

  const files = fs.readdirSync(directoryPath).filter((file) => file.endsWith('.mdx'))

  const posts = files.map((file) => readPost(path.join(directoryPath, file)))
  posts.sort((a, b) => (a.postId > b.postId ? -1 : 1))
  const mergedPost = mergePosts(posts)

  saveMergedPost(outputFilePath, mergedPost)

  console.log(`Merged post saved to ${outputFilePath}`)
}

main()
