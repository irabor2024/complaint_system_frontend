import type {
  ComplaintCategory,
  ComplaintStatus,
  NotificationType,
  Priority,
  Role,
} from '@prisma/client';
import { AppError } from '../errors/AppError';

export function roleToApi(role: Role): 'patient' | 'staff' | 'admin' {
  const map: Record<Role, 'patient' | 'staff' | 'admin'> = {
    PATIENT: 'patient',
    STAFF: 'staff',
    ADMIN: 'admin',
  };
  return map[role];
}

export function roleFromApi(role: string): Role {
  const upper = role.toUpperCase();
  if (upper === 'PATIENT' || upper === 'STAFF' || upper === 'ADMIN') return upper as Role;
  const map: Record<string, Role> = {
    patient: 'PATIENT',
    staff: 'STAFF',
    admin: 'ADMIN',
  };
  const r = map[role.toLowerCase()];
  if (!r) {
    throw new AppError(400, 'INVALID_ROLE', `Invalid role: ${role}`, {
      details: { received: role, allowed: ['patient', 'staff', 'admin'] },
    });
  }
  return r;
}

export function complaintStatusToApi(s: ComplaintStatus): string {
  const map: Record<ComplaintStatus, string> = {
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under Review',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
  };
  return map[s];
}

export function complaintStatusFromApi(s: string): ComplaintStatus {
  const map: Record<string, ComplaintStatus> = {
    Submitted: 'SUBMITTED',
    'Under Review': 'UNDER_REVIEW',
    'In Progress': 'IN_PROGRESS',
    Resolved: 'RESOLVED',
    Closed: 'CLOSED',
    SUBMITTED: 'SUBMITTED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
    CLOSED: 'CLOSED',
  };
  const v = map[s];
  if (!v) {
    throw new AppError(400, 'INVALID_COMPLAINT_STATUS', `Invalid complaint status: ${s}`, {
      details: { received: s },
    });
  }
  return v;
}

export function categoryToApi(c: ComplaintCategory): string {
  const map: Record<ComplaintCategory, string> = {
    HYGIENE: 'Hygiene',
    BILLING: 'Billing',
    STAFF_BEHAVIOR: 'Staff Behavior',
    SERVICE_DELAY: 'Service Delay',
    EQUIPMENT: 'Equipment',
    OTHER: 'Other',
  };
  return map[c];
}

export function categoryFromApi(c: string): ComplaintCategory {
  const map: Record<string, ComplaintCategory> = {
    Hygiene: 'HYGIENE',
    Billing: 'BILLING',
    'Staff Behavior': 'STAFF_BEHAVIOR',
    'Service Delay': 'SERVICE_DELAY',
    Equipment: 'EQUIPMENT',
    Other: 'OTHER',
    HYGIENE: 'HYGIENE',
    BILLING: 'BILLING',
    STAFF_BEHAVIOR: 'STAFF_BEHAVIOR',
    SERVICE_DELAY: 'SERVICE_DELAY',
    EQUIPMENT: 'EQUIPMENT',
    OTHER: 'OTHER',
  };
  const v = map[c];
  if (!v) {
    throw new AppError(400, 'INVALID_COMPLAINT_CATEGORY', `Invalid complaint category: ${c}`, {
      details: { received: c },
    });
  }
  return v;
}

export function priorityToApi(p: Priority): string {
  const map: Record<Priority, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical',
  };
  return map[p];
}

export function priorityFromApi(p: string): Priority {
  const map: Record<string, Priority> = {
    Low: 'LOW',
    Medium: 'MEDIUM',
    High: 'HIGH',
    Critical: 'CRITICAL',
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL',
  };
  const v = map[p];
  if (!v) {
    throw new AppError(400, 'INVALID_PRIORITY', `Invalid priority: ${p}`, {
      details: { received: p },
    });
  }
  return v;
}

export function notificationTypeToApi(t: NotificationType): string {
  const map: Record<NotificationType, string> = {
    ASSIGNMENT: 'assignment',
    RESOLUTION: 'resolution',
    RESPONSE: 'response',
    NEW_COMPLAINT: 'new_complaint',
  };
  return map[t];
}
