const { GoogleGenAI } = require('@google/genai');

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

function buildFallbackIdeas({ interests, skills, domain, budget }) {
  const profileParts = [interests, skills, domain, budget].filter(Boolean);
  const context = profileParts.length ? profileParts.join(' • ') : 'general founder profile';

  const baseIdeas = [
    {
      title: `${domain || 'Hospitality'} ${interests || 'customer care'} service`,
      description: `A real-world ${domain || 'local'} business that provides ${interests || 'customer care'} services to local customers. The founder can start by serving a small area, using ${skills || 'hands-on operations skills'} to deliver reliable results and build repeat business.`,
      problemSolved: `Gives ${domain || 'local'} customers a convenient, trustworthy way to get help with ${interests || 'an everyday need'}.`,
      businessModel: `Launch as a small local ${domain || 'service'} business, charge per booking or job, and add recurring packages for loyal customers.`,
      launchPlan: ['Interview 10 potential customers', 'Offer the service manually to 3 pilot customers', 'Create repeatable packages and referral partnerships'],
      coreFeatures: ['Direct customer service', 'Simple booking and payment process', 'Repeat-service packages'],
      initialTechSuggestions: ['Node.js', 'React', 'MongoDB'],
    },
    {
      title: `${interests || 'Specialty'} products for ${domain || 'local customers'}`,
      description: `A focused business selling or producing ${interests || 'specialty products'} for people in the ${domain || 'local'} market. Begin with a small product range, validate demand through direct conversations and small orders, then expand what sells.`,
      problemSolved: `Makes it easier for ${domain || 'local'} customers to find useful, relevant products without sorting through unrelated options.`,
      businessModel: `Start with made-to-order or small-batch sales, then grow through bundles, subscriptions, and partnerships with complementary local businesses.`,
      launchPlan: ['Select 3 products based on customer interviews', 'Run a paid small-batch test', 'Keep the best-selling products and reinvest the first revenue'],
      coreFeatures: ['Focused product selection', 'Small-batch delivery or pickup', 'Bundles and repeat orders'],
      initialTechSuggestions: ['Express', 'Next.js', 'PostgreSQL'],
    },
    {
      title: `${skills || 'Practical'} consulting for ${domain || 'small businesses'}`,
      description: `A hands-on consulting and training business for ${domain || 'small businesses'} that applies the founder's ${skills || 'practical skills'} to improve results related to ${interests || 'growth and operations'}. Revenue comes from clearly defined sessions, packages, or monthly support.`,
      problemSolved: `Helps ${domain || 'small business'} owners improve a specific result without hiring a full-time specialist.`,
      businessModel: `Sell an initial assessment, a fixed implementation package, and an optional monthly support plan.`,
      launchPlan: ['Define one measurable customer outcome', 'Deliver a discounted pilot for 2 businesses', 'Turn the repeatable work into a fixed-price package'],
      coreFeatures: ['Customer assessment', 'Hands-on delivery or training', 'Measurable improvement plan'],
      initialTechSuggestions: ['Python', 'FastAPI', 'MongoDB'],
    },
  ];

  return baseIdeas.map((idea) => ({
    ...idea,
    description: `${idea.description} It is tailored to the profile: ${context}.`,
  }));
}

/**
 * Step 1: AI Idea Generation
 * Generates exactly 3 structured startup ideas.
 */
async function generateIdeas({ interests, skills, domain, budget }) {
  if (!ai) {
    return buildFallbackIdeas({ interests, skills, domain, budget });
  }

  const prompt = `
You are a professional startup idea generation engine.

Generate EXACTLY 3 innovative, realistic and practical startup ideas
based on the following user profile.

Interests: ${interests || 'not specified'}
Skills: ${skills || 'not specified'}
Domain: ${domain || 'not specified'}
Budget: ${budget || 'not specified'}

Requirements:
- Recommend 3 real businesses the founder could open or operate in the stated domain.
- Prioritize physical, local, professional, retail, food, hospitality, education, or other domain-specific services.
- Use the user's interests as the customer problem or offering, and use skills as an advantage in running the business.
- Explain how each business earns money, starts small, and gets its first customers within the stated budget.
- Ideas must solve real customer problems and be realistic for a student or first-time founder.
- Do not make the idea a website, web app, SaaS product, platform, marketplace, dashboard, or technology stack.
- Technology may support the business, but it must never be the business idea.
- Make the 3 businesses meaningfully different from each other.

Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.
Do not add explanations.

Return exactly this structure:

[
  {
    "title": "string",
    "description": "2-3 sentence description",
    "problemSolved": "string",
    "businessModel": "how the real business earns money",
    "launchPlan": [
      "string",
      "string",
      "string"
    ],
    "coreFeatures": [
      "string",
      "string",
      "string"
    ],
    "initialTechSuggestions": [
      "string",
      "string"
    ]
  }
]

Generate exactly 3 objects.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        maxOutputTokens: 2500,
      },
    });

    let text = response.text;

    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }

    text = text
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let ideas;

    try {
      ideas = JSON.parse(text);
    } catch (error) {
      throw new Error(
        'Gemini response could not be parsed as JSON: ' +
        text.substring(0, 500)
      );
    }

    if (!Array.isArray(ideas)) {
      throw new Error('Gemini response is not an array.');
    }

    if (ideas.length !== 3) {
      throw new Error(
        `Gemini returned ${ideas.length} ideas instead of exactly 3.`
      );
    }

    ideas.forEach((idea, index) => {
      if (
        !idea.title ||
        !idea.description ||
        !idea.problemSolved ||
        !idea.businessModel ||
        !Array.isArray(idea.launchPlan) ||
        !Array.isArray(idea.coreFeatures) ||
        !Array.isArray(idea.initialTechSuggestions)
      ) {
        throw new Error(
          `Idea ${index + 1} has an invalid structure.`
        );
      }
    });

    return ideas;
  } catch (error) {
    console.warn('Gemini AI generation failed, falling back to developer-generated ideas:', error.message);
    return buildFallbackIdeas({ interests, skills, domain, budget });
  }
}

module.exports = {
  generateIdeas,
};