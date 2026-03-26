"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function BlogMarkdown({ content }: { content: string }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="font-serif">{children}</h1>,
          h2: ({ children }) => <h2 className="font-serif">{children}</h2>,
          h3: ({ children }) => <h3 className="font-serif">{children}</h3>,
          // img: ({ src, alt }) => {
          //   if (!src) return null

          //   return (
          //     <figure className="my-8 overflow-hidden rounded-2xl border border-border/70 bg-muted/20 h-full">
          //       <div className="relative h-full">
          //         <Image
          //           src={optimizeCloudinaryImage(String(src), { width: 600 })}
          //           alt={alt ?? "Blog illustration"}
          //           fill
          //           className="h-full"
          //         />
          //       </div>
          //       {alt && <figcaption className="px-4 py-3 text-sm text-muted-foreground">{alt}</figcaption>}
          //     </figure>
          //   )
          // },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
