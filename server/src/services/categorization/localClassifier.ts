import { TfIdf } from 'natural';
import type { ComplaintCategoryLabel } from './constants';
import { CATEGORY_KEYWORDS, CATEGORY_SEEDS, COMPLAINT_CATEGORIES } from './constants';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function keywordScores(normText: string): Record<ComplaintCategoryLabel, number> {
  const tokens = new Set(normText.split(/\s+/).filter(Boolean));
  const scores = {} as Record<ComplaintCategoryLabel, number>;
  for (const lab of COMPLAINT_CATEGORIES) {
    let hits = 0;
    for (const kw of CATEGORY_KEYWORDS[lab]) {
      if (normText.includes(kw) || [...tokens].some(t => t.includes(kw) || kw.includes(t))) {
        hits += 1;
      }
    }
    const maxKw = Math.max(CATEGORY_KEYWORDS[lab].length, 1);
    scores[lab] = Math.min(1, hits / Math.max(3, maxKw * 0.35));
  }
  return scores;
}

export type LocalClassification = {
  category: ComplaintCategoryLabel;
  confidence: number;
  scores: Record<string, number>;
};

export function classifyLocal(text: string): LocalClassification {
  const raw = text.trim();
  if (!raw) {
    return { category: 'Other', confidence: 0, scores: {} };
  }

  const norm = normalize(raw);
  const kw = keywordScores(norm);

  const tfidf = new TfIdf();
  const docLabels: ComplaintCategoryLabel[] = [];

  for (const lab of COMPLAINT_CATEGORIES) {
    const seeds = CATEGORY_SEEDS[lab];
    for (const phrase of seeds) {
      tfidf.addDocument(normalize(phrase));
      docLabels.push(lab);
    }
  }

  const byLabel: Record<ComplaintCategoryLabel, number[]> = {
    Hygiene: [],
    Billing: [],
    'Staff Behavior': [],
    'Service Delay': [],
    Equipment: [],
    Other: [],
  };

  tfidf.tfidfs(norm, (docIndex, measure) => {
    const lab = docLabels[docIndex];
    if (lab) byLabel[lab].push(typeof measure === 'number' ? measure : 0);
  });

  const combined: Record<ComplaintCategoryLabel, number> = {
    Hygiene: 0,
    Billing: 0,
    'Staff Behavior': 0,
    'Service Delay': 0,
    Equipment: 0,
    Other: 0,
  };

  for (const lab of COMPLAINT_CATEGORIES) {
    const tfidfMax = byLabel[lab].length > 0 ? Math.max(...byLabel[lab]) : 0;
    combined[lab] = 0.55 * tfidfMax + 0.45 * kw[lab];
  }

  const ranked = COMPLAINT_CATEGORIES.map(lab => [lab, combined[lab]] as const).sort((a, b) => b[1] - a[1]);

  const [bestLab, bestS] = ranked[0]!;
  const secondS = ranked[1]?.[1] ?? 0;
  const margin = Math.max(0, bestS - secondS);
  const confidence = Math.min(1, Math.max(0, bestS * 0.65 + margin * 1.2));

  return {
    category: bestLab,
    confidence,
    scores: combined as Record<string, number>,
  };
}
