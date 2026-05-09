import { env } from '../../config/env';
import { logger } from '../../config/logger';
import type { ComplaintCategoryLabel } from './constants';
import { COMPLAINT_CATEGORIES } from './constants';

type ZeroShotPipeline = (
  text: string,
  labels: string[],
  options?: { multi_label?: boolean; hypothesis_template?: string }
) => Promise<{ labels: string[]; scores: number[] }>;

let pipelinePromise: Promise<ZeroShotPipeline> | null = null;

async function getPipeline(): Promise<ZeroShotPipeline> {
  if (!pipelinePromise) {
    pipelinePromise = (async () => {
      const { pipeline } = await import('@xenova/transformers');
      logger.info({ model: env.CATEGORIZATION_HF_MODEL }, 'Loading Transformers.js zero-shot model (first call may download weights)');
      const cls = await pipeline('zero-shot-classification', env.CATEGORIZATION_HF_MODEL);
      return cls as ZeroShotPipeline;
    })();
  }
  return pipelinePromise;
}

export async function classifyWithHf(
  text: string,
  labels: readonly string[] = COMPLAINT_CATEGORIES
): Promise<{ category: ComplaintCategoryLabel; confidence: number }> {
  const trimmed = text.trim();
  if (!trimmed) {
    return { category: 'Other', confidence: 0 };
  }

  const cls = await getPipeline();
  const labelList = [...labels];
  const out = await cls(trimmed, labelList, {
    multi_label: false,
    hypothesis_template: 'This hospital complaint is about {}.',
  });

  const top = out.labels[0];
  const score = out.scores[0];
  const category = labelList.includes(top) ? (top as ComplaintCategoryLabel) : 'Other';

  return { category, confidence: typeof score === 'number' ? score : 0 };
}
