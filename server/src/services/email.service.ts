import { sendMailSafe } from '../config/mailer';

export class EmailService {
  async sendComplaintSubmitted(to: string, ticketId: string, patientName: string): Promise<void> {
    await sendMailSafe({
      to,
      subject: `Complaint received — ${ticketId}`,
      text: `Hello ${patientName},\n\nWe received your complaint (${ticketId}). Our team will review it shortly.\n`,
      html: `<p>Hello ${patientName},</p><p>We received your complaint (<strong>${ticketId}</strong>). Our team will review it shortly.</p>`,
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
