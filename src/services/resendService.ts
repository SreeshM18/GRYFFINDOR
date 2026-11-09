/**
 * 🦁 GRYFFINDOR OS — RESEND TRANSACTIONAL EMAIL SERVICE
 * Handles system alerts, clock-in confirmations, task assignments, and daily briefs.
 */

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  tags?: Array<{ name: string; value: string }>;
}

class ResendEmailService {
  private apiKey: string;
  private defaultFrom: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_RESEND_API_KEY || '';
    this.defaultFrom = import.meta.env.VITE_NOTIFICATION_EMAIL_FROM || 'Gryffindor OS <notifications@gryffindor.app>';
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.startsWith('re_'));
  }

  /**
   * Send transactional email using Resend HTTP API
   */
  public async sendEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!this.isConfigured()) {
      console.warn('[ResendService] API key not configured. Mocking dispatch:', payload.subject);
      return { success: true, id: `mock-${Date.now()}` };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: payload.from || this.defaultFrom,
          to: Array.isArray(payload.to) ? payload.to : [payload.to],
          subject: payload.subject,
          html: payload.html,
          tags: payload.tags || [{ name: 'source', value: 'gryffindor-os' }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, error: `Resend HTTP ${response.status}: ${errorText}` };
      }

      const data = await response.json();
      return { success: true, id: data.id };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown network failure';
      return { success: false, error: message };
    }
  }

  /**
   * Quick Template: Daily Attendance & Clock-In Alert
   */
  public async sendAttendanceAlert(user: { name: string; email: string }, type: 'clock-in' | 'clock-out', time: string) {
    const subject = `🦁 Gryffindor OS: ${user.name} ${type === 'clock-in' ? 'Clocked In' : 'Clocked Out'}`;
    const html = `
      <div style="font-family: -apple-system, sans-serif; background: #0B0B0C; color: #F5F0E6; padding: 32px; border-radius: 16px;">
        <h1 style="color: #D3A625; margin-bottom: 8px;">🦁 Gryffindor OS Alert</h1>
        <p style="font-size: 16px; margin-bottom: 24px;"><strong>${user.name}</strong> has successfully ${type === 'clock-in' ? 'clocked in' : 'clocked out'}.</p>
        <div style="background: #151518; padding: 16px; border-radius: 12px; border-left: 4px solid #D3A625;">
          <p style="margin: 0; font-family: monospace;">Time: <strong>${time}</strong></p>
          <p style="margin: 4px 0 0; font-family: monospace;">Environment: Production</p>
        </div>
      </div>
    `;
    return this.sendEmail({ to: user.email, subject, html });
  }

  /**
   * Quick Template: Quest Assignment Notification
   */
  public async sendQuestAssignment(assignee: { name: string; email: string }, questTitle: string, priority: string) {
    const subject = `⚔️ Quest Assigned: ${questTitle} [${priority.toUpperCase()}]`;
    const html = `
      <div style="font-family: -apple-system, sans-serif; background: #0B0B0C; color: #F5F0E6; padding: 32px; border-radius: 16px;">
        <h1 style="color: #D3A625; margin-bottom: 8px;">⚔️ New Quest Assigned</h1>
        <p style="font-size: 16px;">Greetings <strong>${assignee.name}</strong>, a new quest has been added to your board:</p>
        <div style="background: #151518; padding: 20px; border-radius: 12px; border: 1px solid rgba(211,166,37,0.3); margin: 20px 0;">
          <h2 style="color: #FFF; margin: 0 0 8px;">${questTitle}</h2>
          <span style="display: inline-block; padding: 4px 10px; border-radius: 999px; background: #D3A625; color: #000; font-weight: bold; font-size: 12px;">Priority: ${priority}</span>
        </div>
        <p style="font-size: 12px; color: #8A8275;">Login to Gryffindor OS to track progress and sync telemetry.</p>
      </div>
    `;
    return this.sendEmail({ to: assignee.email, subject, html });
  }
}

export const resendService = new ResendEmailService();
export default resendService;
