import type { Priority } from '@prisma/client';

/**
 * Local heuristic priority from complaint text (no ML download).
 * Escalates on safety / clinical urgency cues.
 */
export function inferPriorityFromText(text: string): Priority {
  const t = text.toLowerCase();

  const critical =
    /\b(life[\s-]?threatening|cardiac arrest|stopped breathing|cannot breathe|cant breathe|severe bleeding|unconscious|stroke|heart attack|anaphylaxis|code blue)\b/i;
  if (critical.test(t)) return 'CRITICAL';

  const high =
    /\b(urgent|emergency room|\bemergency\b|severe pain|dangerous|unsafe|fell and|fall risk|wrong medication|medication error|suicidal|self[\s-]?harm)\b/i;
  if (high.test(t)) return 'HIGH';

  const low =
    /\b(minor|small issue|suggestion|feedback only|cosmetic|not urgent|low priority|nice to have)\b/i;
  if (low.test(t)) return 'LOW';

  return 'MEDIUM';
}
