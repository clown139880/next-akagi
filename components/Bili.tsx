'use client'

export default function Bili({
  bvid,
  page = 1,
  title,
  vertical = false,
}: {
  bvid: string
  page?: number
  title?: string
  vertical?: boolean
}) {
  return (
    <div className={`my-6 ${vertical ? 'mx-auto w-full max-w-[420px]' : ''}`}>
      <div
        className={`w-full overflow-hidden rounded-lg bg-black shadow-md ${
          vertical ? 'aspect-[9/16]' : 'aspect-video'
        }`}
      >
        <iframe
          src={`https://player.bilibili.com/player.html?isOutside=true&bvid=${bvid}&page=${page}`}
          title={title || 'Bilibili 视频'}
          className="h-full w-full"
          scrolling="no"
          frameBorder="no"
          allowFullScreen
        />
      </div>
    </div>
  )
}
