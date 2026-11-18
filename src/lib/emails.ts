/**
 * Simple branded HTML email templates sent through Resend.
 * Kept as plain template strings so the project stays dependency-light.
 */

const brandHtml = (content: string) => `
  <div style="margin:0 auto;max-width:560px;padding:24px;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#FBF6EC;border-radius:16px;">
    <div style="background:#ffffff;border:1px solid #EDE3D5;border-radius:16px;overflow:hidden;">
      <div style="background:#3E8E67;padding:20px 28px;display:flex;align-items:center;gap:10px;">
        <div style="width:34px;height:34px;border-radius:10px;background:#ffffff;display:flex;align-items:center;justify-content:center;font-size:18px;">🐾</div>
        <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.02em;">PawCare</span>
      </div>
      <div style="padding:28px;color:#2B241E;line-height:1.6;font-size:15px;">
        ${content}
      </div>
      <div style="padding:18px 28px;background:#FDF0E4;color:#8A7F72;font-size:12px;">
        You are receiving this email because you created a PawCare account.
        If this was not you, you can safely ignore this message.
      </div>
    </div>
  </div>
`;

const buttonHtml = (url: string, label: string) => `
  <a href="${url}" style="display:inline-block;margin:18px 0;padding:13px 28px;background:#F97316;color:#ffffff;border-radius:999px;font-weight:700;text-decoration:none;font-size:15px;">${label}</a>
`;

export function verificationEmailHtml(name: string, url: string) {
  return brandHtml(`
    <h1 style="margin:0 0 8px;font-size:22px;color:#2B241E;">Verify your email address</h1>
    <p style="margin:0 0 6px;">Hi ${name || "there"},</p>
    <p style="margin:0;">Thanks for joining PawCare! Please confirm your email address so we can keep you updated about your pet's appointments and vaccination reminders.</p>
    ${buttonHtml(url, "Verify my email")}
    <p style="margin:0;color:#8A7F72;font-size:13px;">This link expires in 24 hours. If the button doesn't work, copy and paste this URL into your browser:</p>
    <p style="margin:4px 0 0;word-break:break-all;font-size:13px;color:#3E8E67;">${url}</p>
  `);
}

export function resetPasswordEmailHtml(name: string, url: string) {
  return brandHtml(`
    <h1 style="margin:0 0 8px;font-size:22px;color:#2B241E;">Reset your password</h1>
    <p style="margin:0 0 6px;">Hi ${name || "there"},</p>
    <p style="margin:0;">We received a request to reset your PawCare password. Click the button below to choose a new password.</p>
    ${buttonHtml(url, "Reset my password")}
    <p style="margin:0;color:#8A7F72;font-size:13px;">This link expires in 1 hour. If you didn't request a reset, you can ignore this email — your password will stay the same.</p>
  `);
}
