import nodemailer from 'nodemailer';

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}
export async function sendResetEmail(email, resetUrl) {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    requireTLS: process.env.SMTP_SECURE !== 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000
  });
  await transport.sendMail({
    from: process.env.SMTP_FROM, to: email,
    subject: 'Đặt lại mật khẩu — Teddy Yêu Thương',
    text: `Bạn đã yêu cầu đặt lại mật khẩu. Mở liên kết sau trong 15 phút:\n${resetUrl}\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.`
  });
}
