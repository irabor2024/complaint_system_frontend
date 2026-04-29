/** Normalize API status (e.g. "Under Review") for CSS map keys */
export function complaintStatusKey(status: string): string {
  return status.toLowerCase().replace(/\s+/g, '-');
}

export function complaintStatusBadgeClass(status: string): string {
  const k = complaintStatusKey(status);
  const map: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    'under-review': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    'in-progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    resolved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };
  return map[k] ?? 'bg-muted text-muted-foreground';
}

export function priorityBadgeClass(priority: string): string {
  const k = priority.toLowerCase();
  const map: Record<string, string> = {
    low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };
  return map[k] ?? 'bg-muted text-muted-foreground';
}
