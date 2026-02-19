/**
 * Email configuration from environment variables
 */
export const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  from: {
    address: process.env.SMTP_FROM || 'system@elvait.ai',
    name: process.env.SMTP_FROM_NAME || 'ELVAIT System',
  },
};

export function isEmailConfigured(): boolean {
  return !!(
    emailConfig.host &&
    emailConfig.auth.user &&
    emailConfig.auth.pass
  );
}
