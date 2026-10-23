"""Transactional email templates for account verification.

The HTML is intentionally table-based and uses inline styles so it renders
consistently across Gmail, Apple Mail, Outlook and mobile clients. Dark mode is
layered on with ``prefers-color-scheme`` where the client supports it.
"""

from dataclasses import dataclass
from datetime import UTC, datetime
from html import escape
from string import Template
from urllib.parse import urlsplit


@dataclass(frozen=True, slots=True)
class VerificationEmail:
    subject: str
    text: str
    html: str


SUBJECT = 'Verify your email — PDFlyzer'

TEXT_TEMPLATE = Template("""\
Hi ${first_name},

You're one step away from asking your PDFs anything. Confirm your email address to activate your PDFlyzer account.

Verify your email:
${verify_url}

Your 6-digit verification code:
${code}

This link and code expire in ${expiry} and can only be used once.

Didn't create a PDFlyzer account? You can safely ignore this email. Never share your verification code — the PDFlyzer team will never ask for it.

Sent to ${email}
PDFlyzer — Ask your PDFs anything.
""")


HTML_TEMPLATE = Template("""\
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Verify your email</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
    table { border-collapse: collapse !important; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a { text-decoration: none; }
    .preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      max-height: 0;
      max-width: 0;
      overflow: hidden;
      opacity: 0;
      color: transparent;
      font-size: 1px;
      line-height: 1px;
    }

    @media screen and (max-width: 620px) {
      .shell { padding: 24px 12px 28px !important; }
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .card { border-radius: 14px !important; }
      .hero-title { font-size: 26px !important; line-height: 32px !important; }
      .code { font-size: 30px !important; line-height: 36px !important; }
      .hide-mobile { display: none !important; }
      .footer { padding-left: 12px !important; padding-right: 12px !important; }
    }

    @media (prefers-color-scheme: dark) {
      .body-bg { background-color: #09090b !important; }
      .card { background-color: #18181b !important; border-color: #27272a !important; }
      .text { color: #fafafa !important; }
      .body-copy { color: #d4d4d8 !important; }
      .muted { color: #a1a1aa !important; }
      .subtle { color: #71717a !important; }
      .brand { color: #5eead4 !important; }
      .divider { background-color: #27272a !important; }
      .pill { background-color: #0c1f1e !important; border-color: #134e4a !important; color: #5eead4 !important; }
      .code-box { background-color: #0c1f1e !important; border-color: #134e4a !important; }
      .code { color: #5eead4 !important; }
      .note { background-color: #1c1c1f !important; border-color: #27272a !important; border-left-color: #2dd4bf !important; }
      .btn-cell { background-color: #5eead4 !important; }
      .btn-text { color: #09090b !important; }
      .link-fallback { color: #2dd4bf !important; }
      .footer-link { color: #a1a1aa !important; }
    }
  </style>
</head>
<body class="body-bg" style="margin: 0; padding: 0; width: 100%; background-color: #f4f4f5;">
  <div class="preheader">${preheader}</div>

  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f4f4f5" class="body-bg" style="background-color: #f4f4f5;">
    <tr>
      <td class="shell" align="center" style="padding: 44px 16px 36px 16px;">

        <!-- Card -->
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" class="card" style="width: 100%; max-width: 560px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 18px; box-shadow: 0 1px 2px rgba(9, 9, 11, 0.04), 0 18px 40px -16px rgba(9, 9, 11, 0.18);">
          <tr>
            <td height="4" bgcolor="#0d9488" style="height: 4px; line-height: 4px; font-size: 0; background-color: #0d9488; background-image: linear-gradient(90deg, #2dd4bf 0%, #22d3ee 100%); border-radius: 18px 18px 0 0;">&nbsp;</td>
          </tr>

          <!-- Brand bar -->
          <tr>
            <td class="px" style="padding: 26px 40px 0 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" valign="middle" width="36" style="width: 36px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="36" bgcolor="#0d9488" style="width: 36px; background-color: #0d9488; background-image: linear-gradient(135deg, #2dd4bf 0%, #22d3ee 100%); border-radius: 10px;">
                      <tr>
                        <td width="36" height="36" align="center" valign="middle" style="width: 36px; height: 36px;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="16" bgcolor="#ffffff" style="width: 16px; background-color: #ffffff; border-radius: 2px;">
                            <tr>
                              <td height="8" style="height: 8px; line-height: 8px; font-size: 0;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td style="padding: 0 3px 3px 3px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td height="2" bgcolor="#0d9488" style="height: 2px; line-height: 2px; font-size: 0; background-color: #0d9488;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td height="3" style="height: 3px; line-height: 3px; font-size: 0;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                    <td width="10" height="2" bgcolor="#0d9488" style="width: 10px; height: 2px; line-height: 2px; font-size: 0; background-color: #0d9488;">&nbsp;</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="left" valign="middle" style="padding-left: 10px;">
                    <span class="text" style="font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; line-height: 22px; font-weight: 700; letter-spacing: -0.3px; color: #18181b;">pdf<span class="brand" style="color: #0d9488;">lyzer</span></span>
                  </td>
                  <td align="right" valign="middle" class="hide-mobile">
                    <span class="pill" style="display: inline-block; padding: 6px 10px; background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 999px; color: #71717a; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; line-height: 14px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">Account security</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td class="px" style="padding: 34px 40px 0 40px;">
              <p class="brand" style="margin: 0 0 10px 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 16px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #0d9488;">One last step</p>
              <h1 class="hero-title text" style="margin: 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 30px; line-height: 36px; font-weight: 700; letter-spacing: -0.8px; color: #18181b;">Verify your email<span class="brand" style="color: #0d9488;">.</span></h1>
              <p class="body-copy" style="margin: 16px 0 0 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 24px; color: #3f3f46;">${greeting} You're one tap away from asking your PDFs anything. Confirm this address to activate your PDFlyzer account.</p>
            </td>
          </tr>

          <!-- Primary CTA -->
          <tr>
            <td class="px" style="padding: 26px 40px 0 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" bgcolor="#0d9488" class="btn-cell" style="background-color: #0d9488; border-radius: 12px; box-shadow: 0 2px 6px rgba(13, 148, 136, 0.22);">
                    <a href="${verify_url}" target="_blank" rel="noopener" class="btn-text" style="display: block; padding: 15px 22px; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 20px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 12px;">Verify my email&nbsp;&nbsp;&rarr;</a>
                  </td>
                </tr>
              </table>
              <p class="subtle" style="margin: 12px 0 0 0; text-align: center; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 18px; color: #71717a;">Single use &middot; expires in ${expiry}</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td class="px" style="padding: 30px 40px 0 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="42%" height="1" bgcolor="#e4e4e7" class="divider" style="width: 42%; height: 1px; line-height: 1px; font-size: 0; background-color: #e4e4e7;">&nbsp;</td>
                  <td align="center" class="muted" style="padding: 0 12px; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; line-height: 16px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #a1a1aa; white-space: nowrap;">or use the code</td>
                  <td width="42%" height="1" bgcolor="#e4e4e7" class="divider" style="width: 42%; height: 1px; line-height: 1px; font-size: 0; background-color: #e4e4e7;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Code -->
          <tr>
            <td class="px" style="padding: 18px 40px 0 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f0fdfa" class="code-box" style="background-color: #f0fdfa; border: 1px dashed #99f6e4; border-radius: 14px;">
                <tr>
                  <td align="center" style="padding: 18px 16px 20px 16px;">
                    <p class="muted" style="margin: 0 0 6px 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; line-height: 15px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #71717a;">Your verification code</p>
                    <p class="code" style="margin: 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 34px; line-height: 42px; font-weight: 700; color: #0f766e; white-space: nowrap;">${code_html}</p>
                    <p class="muted" style="margin: 6px 0 0 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 18px; color: #71717a;">Enter it in PDFlyzer if the button doesn't work.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security note -->
          <tr>
            <td class="px" style="padding: 24px 40px 0 40px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#fafafa" class="note" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-left: 3px solid #0d9488; border-radius: 10px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <p class="text" style="margin: 0 0 3px 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 20px; font-weight: 700; color: #18181b;">Didn't request this?</p>
                    <p class="muted" style="margin: 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 19px; color: #71717a;">If you didn't create a PDFlyzer account, you can safely ignore this email. Never share this code — our team will never ask for it.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Link fallback -->
          <tr>
            <td class="px" style="padding: 22px 40px 0 40px;">
              <p class="subtle" style="margin: 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 18px; color: #a1a1aa;">Button not working? Paste this link into your browser:</p>
              <p style="margin: 4px 0 0 0; word-break: break-all; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 11px; line-height: 17px;">
                <a href="${verify_url}" target="_blank" rel="noopener" class="link-fallback" style="color: #0d9488; text-decoration: underline;">${verify_url}</a>
              </p>
            </td>
          </tr>

          <!-- Card footer -->
          <tr>
            <td class="px" style="padding: 26px 40px 28px 40px;">
              <p class="subtle" style="margin: 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 18px; color: #a1a1aa;">Sent to ${email} because someone signed up for PDFlyzer.</p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" class="footer" style="width: 100%; max-width: 560px;">
          <tr>
            <td align="center" style="padding: 22px 12px 0 12px;">
              <p class="muted" style="margin: 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 18px; font-weight: 600; color: #71717a;">PDFlyzer — Ask your PDFs anything.</p>
              <p class="subtle" style="margin: 6px 0 0 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 17px; color: #a1a1aa;">${footer_links}</p>
              <p class="subtle" style="margin: 8px 0 0 0; font-family: 'Oxanium Variable', Oxanium, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 17px; color: #a1a1aa;">&copy; ${year} PDFlyzer. This is an automated message; replies aren't monitored.</p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
""")


def render_verification_email(
    *,
    code: str,
    verify_url: str,
    name: str | None = None,
    email: str | None = None,
    site_url: str | None = None,
    expires_in_minutes: int = 10,
    year: int | None = None,
) -> VerificationEmail:
    """Render the account verification email.

    Args:
        code: The six-digit verification code.
        verify_url: Tokenized link that verifies the account in one click.
        name: Recipient's full name, used for the greeting.
        email: Recipient's address, shown in the email footer.
        site_url: Frontend origin used for footer links. Derived from
            ``verify_url`` when omitted.
        expires_in_minutes: Lifetime shared by the code and the link.
        year: Copyright year. Defaults to the current year.

    Returns:
        The subject, plain-text body and HTML body ready for ``MailService``.
    """
    first_name = (name or '').strip().split(' ')[0] or 'there'
    minutes = max(1, int(expires_in_minutes))
    expiry = '1 minute' if minutes == 1 else f'{minutes} minutes'

    safe_code = escape(code)
    safe_url = escape(verify_url, quote=True)
    safe_email = escape(email) if email else 'this address'

    # Each digit is its own inline block so spacing stays even without relying
    # on letter-spacing, which is inconsistent across email clients.
    code_html = ''.join(
        f'<span style="display: inline-block; padding: 0 4px;">{escape(digit)}</span>'
        for digit in code
    )

    origin = site_url.rstrip('/') if site_url else _origin(verify_url)
    footer_links = _footer_links(origin)

    context = {
        'code': safe_code,
        'code_html': code_html,
        'verify_url': safe_url,
        'first_name': escape(first_name),
        'greeting': f'Hi {escape(first_name)},',
        'email': safe_email,
        'expiry': expiry,
        'preheader': (
            'Confirm your email to activate your PDFlyzer account. '
            f'Your code expires in {expiry}.'
        ),
        'footer_links': footer_links,
        'year': year or datetime.now(UTC).year,
    }

    return VerificationEmail(
        subject=SUBJECT,
        text=TEXT_TEMPLATE.substitute(
            first_name=first_name,
            verify_url=verify_url,
            code=code,
            expiry=expiry,
            email=email or 'this address',
        ),
        html=HTML_TEMPLATE.substitute(context),
    )


def _origin(url: str) -> str:
    parts = urlsplit(url)
    if parts.scheme and parts.netloc:
        return f'{parts.scheme}://{parts.netloc}'
    return ''


def _footer_links(origin: str) -> str:
    link_style = (
        'class="footer-link" style="color: #71717a; text-decoration: underline;"'
    )

    if not origin:
        return 'Secure accounts &middot; Private by default'

    security = f'{escape(origin)}/#security'
    faq = f'{escape(origin)}/#faq'

    return (
        f'<a href="{security}" target="_blank" rel="noopener" {link_style}>Security</a>'
        ' &nbsp;&middot;&nbsp; '
        f'<a href="{faq}" target="_blank" rel="noopener" {link_style}>FAQ</a>'
    )
