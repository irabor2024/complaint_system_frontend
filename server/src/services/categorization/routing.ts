import type { Department, Priority } from '@prisma/client';
import { categorizeComplaintText } from './categorizeText';
import { matchDepartmentFromText } from './departmentMatcher';
import { inferPriorityFromText } from './priorityClassifier';

export type ComplaintRoutingResult = {
  category: string;
  priority: Priority;
  departmentId: string;
  categorizationMethod: 'local' | 'hf';
};

/**
 * AI routing step: category (NLP), priority (heuristic), department (TF-IDF vs dept profiles).
 * When `automaticCategory` is false, caller-supplied category and department are used instead.
 */
export async function resolveComplaintRouting(
  description: string,
  options: {
    automaticCategory: boolean;
    manualCategory?: string;
    manualDepartmentId?: string;
    departments: Department[];
  }
): Promise<ComplaintRoutingResult> {
  const text = description.trim();

  let category: string;
  let categorizationMethod: 'local' | 'hf' = 'local';

  if (options.automaticCategory) {
    const cat = await categorizeComplaintText(text);
    category = cat.category;
    categorizationMethod = cat.method;
  } else {
    category = options.manualCategory!;
  }

  const priority = inferPriorityFromText(text);

  let departmentId: string;
  if (options.automaticCategory) {
    departmentId = matchDepartmentFromText(text, options.departments);
  } else {
    departmentId = options.manualDepartmentId!;
  }

  return { category, priority, departmentId, categorizationMethod };
}
