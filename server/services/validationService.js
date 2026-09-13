/**
 * Step 3: Market Validation
 * Combines the AI-generated idea with collected market data to produce
 * a feasibility score, risk level, target audience, revenue models,
 * and a recommended tech stack.
 */
function validate(idea) {
  const { marketData } = idea;
  const contextTheme = getContextTheme(idea);

  const competitionPenalty = { Low: 0, Medium: 10, High: 20 }[marketData.competitionLevel];
  const feasibilityScore = Math.max(
    0,
    Math.min(100, Math.round(marketData.trendScore - competitionPenalty + 10))
  );

  const riskLevel = feasibilityScore >= 70 ? 'Low' : feasibilityScore >= 45 ? 'Medium' : 'High';
  const profitabilityOutlook = feasibilityScore >= 75 ? 'High' : feasibilityScore >= 55 ? 'Medium' : 'Low';
  const businessSignals = {
    profitabilityOutlook,
    competitionLevel: marketData.competitionLevel || 'Medium',
    marketMomentum: marketData.trendScore >= 70 ? 'Strong' : marketData.trendScore >= 50 ? 'Growing' : 'Needs validation',
    riskLevel,
  };

  return {
    ...idea,
    feasibilityScore,
    riskLevel,
    businessSignals,
    businessSummary: buildBusinessSummary(idea, businessSignals, contextTheme),
    businessModel: idea.businessModel || 'Define a simple paid service or product offer for the target customer.',
    launchPlan: Array.isArray(idea.launchPlan) ? idea.launchPlan : [],
    targetAudience: buildTargetAudience(idea, contextTheme),
    revenueModels: buildRevenueModels(contextTheme),
    recommendedTechStack: buildTechStack(idea),
    inputProfileSummary: buildInputProfileSummary(idea.inputContext || {}),
  };
}

function buildInputProfileSummary(inputContext = {}) {
  const sections = [
    inputContext.interests,
    inputContext.skills,
    inputContext.domain,
    inputContext.budget,
  ].filter(Boolean);

  if (!sections.length) return 'Profile summary unavailable.';

  return `Based on the entered profile — ${sections.join(' • ')} — this opportunity is tailored to the user’s stated interests, skills, domain, and budget.`;
}

function getContextTheme(idea) {
  const contextText = [
    idea?.inputContext?.interests,
    idea?.inputContext?.skills,
    idea?.inputContext?.domain,
    idea?.title,
    idea?.description,
  ].filter(Boolean).join(' ');

  if (/(hotel|hospitality|restaurant|food|dining|guest|travel|tourism|catering)/i.test(contextText)) {
    return 'hospitality';
  }

  return 'general';
}

function buildBusinessSummary(idea, businessSignals, contextTheme) {
  const hospitalitySummary = contextTheme === 'hospitality'
    ? `The idea is tailored for the hotel, hospitality, and food service market with ${businessSignals.marketMomentum.toLowerCase()} momentum and ${businessSignals.competitionLevel.toLowerCase()} competition.`
    : `The idea targets a market with ${businessSignals.marketMomentum.toLowerCase()} momentum and ${businessSignals.competitionLevel.toLowerCase()} competition.`;

  return {
    ideaName: idea.title || 'Untitled idea',
    problem: idea.problemSolved || 'No problem statement provided.',
    opportunity: hospitalitySummary,
    profitability: `Profitability outlook is ${businessSignals.profitabilityOutlook.toLowerCase()} with a ${businessSignals.riskLevel.toLowerCase()} risk profile.`,
    recommendation: businessSignals.profitabilityOutlook === 'High' && businessSignals.riskLevel === 'Low'
      ? 'This idea looks promising and worth validating further.'
      : businessSignals.profitabilityOutlook === 'Medium'
        ? 'This idea has potential but should be refined before scaling.'
        : 'This idea needs stronger positioning and validation before investment.',
  };
}

function buildRevenueModels(contextTheme) {
  if (contextTheme === 'hospitality') {
    return ['Booking or reservation fees', 'Loyalty and membership plans', 'Premium guest services'];
  }

  return ['Subscription (SaaS)', 'Freemium with premium tier', 'Usage-based API pricing'];
}

function buildTargetAudience(idea, contextTheme) {
  if (contextTheme === 'hospitality') {
    return {
      primary: 'Hotel owners, restaurant operators, and hospitality teams',
      secondary: 'Guests, event planners, and food service partners',
    };
  }

  return {
    primary: 'Early-stage entrepreneurs and small business owners',
    secondary: 'Product managers and innovation teams at mid-size companies',
  };
}

function buildTechStack(idea) {
  const base = ['Node.js / Express backend', 'React frontend', 'PostgreSQL or MongoDB'];
  const suggestions = Array.isArray(idea.initialTechSuggestions) ? idea.initialTechSuggestions : [];
  const techStack = [...base];

  suggestions.forEach((suggestion) => {
    const normalizedSuggestion = suggestion.trim();
    if (!normalizedSuggestion) return;

    const isDuplicate = techStack.some((entry) => {
      const normalizedEntry = entry.toLowerCase();
      const normalizedValue = normalizedSuggestion.toLowerCase();
      return normalizedEntry === normalizedValue || normalizedEntry.includes(normalizedValue) || normalizedValue.includes(normalizedEntry);
    });

    if (!isDuplicate) {
      techStack.push(normalizedSuggestion);
    }
  });

  return techStack;
}

module.exports = { validate, buildInputProfileSummary };
