import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// function ensureMarkdownHeadingStructure(content: string, title: string): string {
//   const normalized = (content ?? "").trim()
//   if (!normalized) {
//     return `# ${title}\n\n## Introduction\n\nContent coming soon.`
//   }

//   let result = normalized

//   // Ensure content starts with an H1 so markdown renderers format the article title.
//   if (!result.startsWith("# ")) {
//     result = `# ${title}\n\n${result}`
//   }

//   // Ensure at least one H2 exists for sectioned markdown structure.
//   if (!/^##\s+/m.test(result)) {
//     result = `${result}\n\n## Key Takeaways\n\n- Practical guidance for homeowners and builders.\n- Local context relevant to Maharajganj and UP.`
//   }

//   return result
// }

export async function generateBlogContent(
  topic: string,
  hint: string
): Promise<{ title: string; description: string; content: string; tags: string[] }> {
  const systemPrompt = `You are an expert content writer for Shiva Design Associates — an architecture and interior design firm based in Maharajganj, Uttar Pradesh, India. 
You write informative, SEO-friendly blog articles that are helpful to homeowners, builders, and people interested in architecture, interior design, Vastu Shastra, and construction in Purvanchal and UP region.
Always write in a warm, professional tone. Naturally mention Maharajganj, UP, or Purvanchal where relevant.`

  const userPrompt = `Write a comprehensive blog article about the following topic:

Topic: "${topic}"
${hint ? `Additional context: ${hint}` : ""}

Return a valid JSON object with exactly these fields:
{
  "title": "A compelling, SEO-friendly article title (include location like Maharajganj or UP if natural)",
  "description": "A 1-2 sentence meta description summarising the article (max 160 characters)",
  "tags": ["tag1", "tag2", "tag3"],
  "content": "The full article body in Markdown format (minimum 600 words). Use markdown headings correctly: title must start with '# ', and section headings must use '## '. Include bullet points, bold text, and a clear conclusion."
}

Only return the raw JSON object. No markdown code fences, no extra text.`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  })

  const raw = response.choices[0]?.message?.content ?? ""

  try {
    const parsed = JSON.parse(raw)
    return {
      title: parsed.title ?? topic,
      description: parsed.description ?? "",
      content: parsed.content ?? "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    }
  } catch {
    // Fallback: use raw content as markdown body if JSON parsing fails
    return {
      title: topic,
      description: "",
      // content: ensureMarkdownHeadingStructure(raw, topic),
      content: raw,
      tags: [],
    }
  }
}
