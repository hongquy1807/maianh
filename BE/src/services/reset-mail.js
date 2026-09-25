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
    subject: 'Hongquy Store | Đặt lại mật khẩu',
    text: `Bạn đã yêu cầu đặt lại mật khẩu. Mở liên kết sau trong 15 phút:\n${resetUrl}\n\nNếu bạn không yêu cầu, hãy bỏ qua email này.`
  });
}

export async function sendOtpEmail(email, code, purpose) {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE === 'true', requireTLS: process.env.SMTP_SECURE !== 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000
  });
  const isRegistration = purpose === 'register';
  const subject = isRegistration ? 'Hongquy Store | Xác thực đăng ký' : 'Hongquy Store | OTP đặt lại mật khẩu';
  const title = isRegistration ? 'Xác thực tài khoản' : 'Đặt lại mật khẩu';
  const text = `Mã OTP của bạn là: ${code}. Mã có hiệu lực 10 phút và chỉ dùng một lần. Không chia sẻ mã này với người khác. Nếu bạn không yêu cầu, hãy bỏ qua email này.`;
  const html = `
    <div style="margin:0;padding:32px 16px;background:#f3f6f4;font-family:Arial,Helvetica,sans-serif;color:#202923;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #dce5df;border-radius:12px;overflow:hidden;">
        <div style="padding:24px 32px;background:#173d32;color:#ffffff;">
          <div style="font-size:13px;font-weight:700;letter-spacing:1px;color:#c5d9c8;">HONGQUY STORE</div>
          <h1 style="margin:12px 0 0;font-size:24px;line-height:1.3;font-weight:600;">${title}</h1>
        </div>
        <div style="padding:28px 32px 32px;">
          <p style="margin:0 0 18px;font-size:15px;line-height:1.6;">Sử dụng mã bên dưới để tiếp tục. Mã chỉ có hiệu lực trong <strong>10 phút</strong>.</p>
          <div style="padding:18px;text-align:center;background:#f3f6f4;border:1px solid #dce5df;border-radius:8px;">
            <span style="font-size:32px;line-height:1.3;font-weight:700;letter-spacing:8px;color:#173d32;">${code}</span>
          </div>
          <p style="margin:20px 0 0;font-size:14px;line-height:1.6;color:#46534b;">Không chia sẻ mã này với bất kỳ ai. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.</p>
          <div style="margin-top:26px;padding-top:18px;border-top:1px solid #e7ece8;font-size:12px;line-height:1.6;color:#78837b;">Email tự động từ Hongquy Store. Vui lòng không trả lời thư này.</div>
        </div>
      </div>
    </div>`;
  await transport.sendMail({from: process.env.SMTP_FROM, to: email,
    subject, text, html});
}
