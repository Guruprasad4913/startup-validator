const test = require('node:test');
const assert = require('node:assert/strict');
const { buildReportSummaries } = require('../services/storageService');
const { generateIdeas } = require('../services/aiService');
const { validate, buildInputProfileSummary } = require('../services/validationService');

test('buildReportSummaries returns newest reports first with top idea', () => {
  const reports = [
    {
      id: 'older',
      input: { domain: 'health' },
      generatedAt: '2024-01-01T00:00:00.000Z',
      ideas: [{ title: 'Older idea' }],
    },
    {
      id: 'newer',
      input: { domain: 'fintech' },
      generatedAt: '2024-02-01T00:00:00.000Z',
      ideas: [{ title: 'New idea' }],
    },
  ];

  const summaries = buildReportSummaries(reports);

  assert.equal(summaries[0].id, 'newer');
  assert.equal(summaries[0].topIdea, 'New idea');
  assert.equal(summaries[1].id, 'older');
});

test('generateIdeas and validation use hospitality context from the user input', async () => {
  const ideas = await generateIdeas({ interests: 'food industry', skills: 'operations', domain: 'hotel', budget: '$5000' });
  const firstIdea = ideas[0];

  assert.match(firstIdea.title, /hotel|hospitality|dining|guest/i);
  assert.match(firstIdea.description, /hotel|hospitality|food|dining|guest/i);

  const validated = validate({
    ...firstIdea,
    marketData: { trendScore: 83, competitionLevel: 'Medium', estimatedMarketSizeUSD: 500000000 },
    inputContext: { interests: 'food industry', skills: 'operations', domain: 'hotel' },
  });

  assert.match(validated.businessSummary.opportunity, /hotel|hospitality|food|dining/i);
  assert.match(validated.targetAudience.primary, /hotel|hospitality|food|dining/i);
});

test('profile summary emphasizes entered data instead of generic website references', () => {
  const summary = buildInputProfileSummary({
    interests: 'food delivery',
    skills: 'marketing',
    domain: 'hospitality',
    budget: '$10,000',
  });

  assert.match(summary, /food delivery|marketing|hospitality|\$10,000/i);
  assert.doesNotMatch(summary, /google trends|search engine|website|www\./i);
});

test('generateIdeas creates service-oriented startup concepts, not websites', async () => {
  const ideas = await generateIdeas({ interests: 'food service', skills: 'marketing', domain: 'hospitality', budget: '$5000' });
  const combinedText = ideas.map((idea) => `${idea.title} ${idea.description}`).join(' ');

  assert.doesNotMatch(combinedText, /website|web app|platform|marketplace/i);
  assert.match(combinedText, /service|solution|hospitality|guest|food|operations|insight|assistant/i);
});
