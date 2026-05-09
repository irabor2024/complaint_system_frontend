import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { classifyWithHf } from './hfClassifier';
import { classifyLocal } from './localClassifier';

export type CategorizeResult = {
  category: string;
  confidence: number;
  method: 'local' | 'hf';
};

/**
 * Local NLP first (TF-IDF + keywords via `natural`). If confidence is below the threshold
 * and HF is enabled, runs Transformers.js (DistilBERT-MNLI-class) zero-shot in-process.
 */
export async function categorizeComplaintText(description: string): Promise<CategorizeResult> {
  const local = classifyLocal(description);

  if (local.confidence >= env.CATEGORIZATION_LOCAL_THRESHOLD || !env.CATEGORIZATION_HF_ENABLED) {
    return {
      category: local.category,
      confidence: local.confidence,
      method: 'local',
    };
  }

  try {
    const hf = await classifyWithHf(description.trim());
    return {
      category: hf.category,
      confidence: hf.confidence,
      method: 'hf',
    };
  } catch (e) {
    logger.warn({ err: e }, 'HF categorization failed; using local classifier output');
    return {
      category: local.category,
      confidence: local.confidence,
      method: 'local',
    };
  }
}
