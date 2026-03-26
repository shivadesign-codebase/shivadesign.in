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
  hint: string,
  placeholderCount = 0
): Promise<{ title: string; description: string; content: string; tags: string[] }> {
  const systemPrompt = `
You are a professional SEO content writer for Shiva Design Associates, an architecture and interior design firm based in Maharajganj, Uttar Pradesh, India.

Your goal is to write high-quality blog articles that help homeowners, property developers, and builders who are planning construction projects in Uttar Pradesh, especially in Maharajganj, Gorakhpur, Pharenda, Nichlaul, and the Purvanchal region.

The blog must:
- Be highly informative and useful
- Be optimized for search engines (SEO)
- Be written in clear and professional English
- Include natural references to Maharajganj, Gorakhpur, Purvanchal, and Uttar Pradesh when relevant
- Position Shiva Design Associates as a trusted architecture firm

The article should naturally mention services such as:
- architectural planning
- AutoCAD drafting
- 3D elevation design
- interior designing
- building map approval
- construction cost estimation
- Vastu based design

Use an authoritative but friendly tone suitable for homeowners planning construction.

Structure the article like a professional blog with clear sections and helpful advice.
`

  const userPrompt = `
Write a comprehensive SEO blog article about the following topic:

Topic: "${topic}"
${hint ? `Additional context: ${hint}` : ""}
${
  placeholderCount > 0
    ? `
Use these exact markdown placeholders inside the content where relevant visuals should appear:
${Array.from({ length: placeholderCount }, (_, idx) => `- {{img${idx + 1}}}`).join("\n")}
Each placeholder should appear once in a meaningful section after a related paragraph.
`
    : ""
}

Important SEO guidelines:

- Target readers in Maharajganj, Gorakhpur, and Uttar Pradesh.
- Naturally include location keywords such as Maharajganj, Gorakhpur, Purvanchal, and Uttar Pradesh.
- Mention Shiva Design Associates where appropriate as a professional architecture firm.
- Include practical advice for homeowners planning construction.
- Add a section explaining how professional architectural services can help.

The blog must include the following structure:

# Title (SEO optimized)

## Introduction
Explain the topic and why it is important for homeowners in Uttar Pradesh.

## Key Factors or Concepts
Explain the main topic in detail.

## Practical Tips for Homeowners
Provide actionable advice.

## Why Professional Architectural Planning Matters
Mention services such as:
AutoCAD drafting, 3D elevation design, interior design, map approval, Vastu consultation, and cost estimation.

## FAQs
Include 3-5 frequently asked questions related to the topic. 
Some FAQs should include local keywords like:
"Maharajganj", "Gorakhpur", "Purvanchal", or "Uttar Pradesh".

## Conclusion
Summarize the article and encourage readers to consult professional architects.

## Call to Action
Include a short paragraph encouraging readers to contact Shiva Design Associates for architectural services in Maharajganj and nearby areas.

Return a valid JSON object with exactly these fields:

{
  "title": "SEO optimized article title",
  "description": "1-2 sentence meta description under 160 characters",
  "tags": ["architecture", "house planning", "maharajganj", "construction", "interior design"],
  "content": "Full article body in Markdown format (minimum 800 words)"
}

Rules:
- The article must start with '# ' for the title.
- Use '## ' for section headings.
- Use bullet points where helpful.
- Include bold text for important ideas.
- If image placeholders were provided, keep them unchanged as plain tokens (for example: {{img1}}).
- Only return the raw JSON object.
- Do not include markdown code blocks or extra commentary.
`

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

type ProjectBlogInput = {
  title: string
  category: string
  type: string
  description: string
}

export async function generateProjectBlogContent(
  project: ProjectBlogInput
): Promise<{ title: string; description: string; content: string; tags: string[] }> {
  const systemPrompt = `
You are a senior SEO content writer for Shiva Design Associates, an architecture and interior design firm based in Maharajganj, Uttar Pradesh, India.

Your task is to convert project data into a high-quality blog article that is:
- Fact-based (no fabricated numbers or fake claims)
- Helpful for homeowners/builders
- SEO-friendly for Maharajganj, Gorakhpur, Purvanchal, and Uttar Pradesh
- Structured for readability and search visibility

The tone should be professional, practical, and trustworthy.
`

  const userPrompt = `
Create a complete SEO blog article from this real project dataset:

Project title: "${project.title}"
Project category: "${project.category}"
Project type: "${project.type}"
Project description: "${project.description}"

Requirements:
- Use only the provided project information and reasonable general guidance.
- Do not invent exact dimensions, budgets, or timelines.
- Naturally include keywords around architecture, interior design, home planning, and Uttar Pradesh locations.
- Mention Shiva Design Associates as the expert team behind the work.

Output structure in Markdown:
- # SEO title
- ## Introduction
- ## Project Overview
- ## Design Approach & Planning Insights
- ## Key Takeaways for Homeowners
- ## FAQs (3 to 5)
- ## Conclusion
- ## Call to Action

FAQ section should include location-aware user intent (Maharajganj, Gorakhpur, Purvanchal, Uttar Pradesh) where natural.

Return valid JSON only in this exact shape:
{
  "title": "SEO optimized title",
  "description": "Meta description under 160 characters",
  "tags": ["architecture", "interior design", "maharajganj"],
  "content": "Full markdown blog content, at least 700 words"
}

Rules:
- Return raw JSON only.
- Do not wrap in markdown code fences.
- Keep content factual to the provided project.
`

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.6,
    max_tokens: 1900,
  })

  const raw = response.choices[0]?.message?.content ?? ""

  try {
    const parsed = JSON.parse(raw)
    return {
      title: parsed.title ?? `${project.title} | Shiva Design Associates`,
      description: parsed.description ?? "",
      content: parsed.content ?? "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    }
  } catch {
    return {
      title: `${project.title} | Shiva Design Associates`,
      description: "",
      content: raw,
      tags: ["architecture", "interior design", "maharajganj"],
    }
  }
}
