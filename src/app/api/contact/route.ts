import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, plan, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Send notification email to team
    const subject = `[ELVAIT Contact] ${plan ? `${plan} inquiry from` : 'Message from'} ${name}`;
    
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        ${company ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Company</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${company}</td>
        </tr>
        ` : ''}
        ${plan ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Plan Interest</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${plan}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${message.replace(/\n/g, '<br>')}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; color: #666;">
        Sent from ELVAIT contact form at ${new Date().toISOString()}
      </p>
    `;

    const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${company ? `Company: ${company}` : ''}
${plan ? `Plan Interest: ${plan}` : ''}

Message:
${message}

---
Sent from ELVAIT contact form at ${new Date().toISOString()}
    `.trim();

    // Send to team
    const teamEmail = process.env.CONTACT_EMAIL || 'hello@elvait.ai';
    
    await sendEmail({
      to: teamEmail,
      subject,
      html: htmlContent,
      text: textContent,
    });

    // Send confirmation to user (optional)
    try {
      await sendEmail({
        to: email,
        subject: 'We received your message — ELVAIT',
        html: `
          <p>Hi ${name},</p>
          <p>Thank you for reaching out! We've received your message and will get back to you within 24 hours.</p>
          <p>Best,<br>The ELVAIT Team</p>
        `,
        text: `Hi ${name},\n\nThank you for reaching out! We've received your message and will get back to you within 24 hours.\n\nBest,\nThe ELVAIT Team`,
      });
    } catch (e) {
      // Don't fail if confirmation email fails
      console.error('Failed to send confirmation email:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
