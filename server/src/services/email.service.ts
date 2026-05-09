import { sendMailSafe } from '../config/mailer';

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export class EmailService {
  async sendComplaintSubmitted(to: string, ticketId: string, departmentName: string): Promise<void> {
    const deptLabel = escapeHtml(departmentName);
    const assignmentLine = `Your complaint has been received and assigned to the ${departmentName} Department.`;
    const assignmentLineHtml = `Your complaint has been received and assigned to the ${deptLabel} Department.`;

    const text = [
      'Dear Patient,',
      '',
      assignmentLine,
      `Ticket ID: ${ticketId}`,
      '',
      'We will resolve this within 24 hours.',
      '',
      'Thank you.',
    ].join('\n');

    const html = `<p>Dear Patient,</p>
<p>${assignmentLineHtml}<br/>
Ticket ID: <strong>${escapeHtml(ticketId)}</strong></p>
<p>We will resolve this within 24 hours.</p>
<p>Thank you.</p>`;

    await sendMailSafe({
      to,
      subject: `Complaint received — ${ticketId}`,
      text,
      html,
    });
  }

  async sendStatusUpdate(to: string, ticketId: string, status: string): Promise<void> {
    await sendMailSafe({
      to,
      subject: `Complaint update — ${ticketId}`,
      text: `Your complaint ${ticketId} status is now: ${status}.`,
      html: `<p>Your complaint <strong>${ticketId}</strong> status is now: <strong>${status}</strong>.</p>`,
    });
  }

  async sendWelcomeStaff(to: string, name: string): Promise<void> {
    await sendMailSafe({
      to,
      subject: 'Your hospital staff account',
      text: `Hello ${name},\n\nAn administrator created your SmartCare staff account. You can sign in with this email address.\n`,
    });
  }
}

export const emailService = new EmailService();
