import type { Department } from '@prisma/client';
import { TfIdf } from 'natural';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Pick the department whose name/description best matches the complaint text (local TF-IDF).
 */
export function matchDepartmentFromText(description: string, departments: Department[]): string {
  if (departments.length === 0) {
    throw new Error('No departments available');
  }
  if (departments.length === 1) {
    return departments[0]!.id;
  }

  const query = normalize(description);
  if (!query) {
    return departments[0]!.id;
  }

  const tfidf = new TfIdf();
  const ids: string[] = [];

  for (const d of departments) {
    const profile = normalize([d.name, d.description ?? '', d.head ?? ''].filter(Boolean).join(' '));
    tfidf.addDocument(profile || normalize(d.name));
    ids.push(d.id);
  }

  let bestIdx = 0;
  let bestScore = -Infinity as number;

  tfidf.tfidfs(query, (docIndex, measure) => {
    const m = typeof measure === 'number' ? measure : 0;
    if (m > bestScore) {
      bestScore = m;
      bestIdx = docIndex;
    }
  });

  return ids[bestIdx]!;
}
