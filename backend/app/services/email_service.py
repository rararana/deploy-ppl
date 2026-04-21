"""
Email service for sending transactional emails.
"""

import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from urllib.parse import quote

from app.core.config import settings


async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: str | None = None,
) -> bool:
    """
    Send an email asynchronously using SMTP.

    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: HTML body content
        text_content: Plain text body content (optional)

    Returns:
        True if email sent successfully, False otherwise
    """
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        message["To"] = to_email

        # Attach plain text and HTML versions
        if text_content:
            message.attach(MIMEText(text_content, "plain"))
        message.attach(MIMEText(html_content, "html"))

        # Send email asynchronously
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            _send_smtp,
            settings.SMTP_HOST,
            settings.SMTP_PORT,
            settings.SMTP_USER,
            settings.SMTP_PASSWORD,
            settings.SMTP_FROM_EMAIL,
            to_email,
            message.as_string(),
        )

        return True
    except smtplib.SMTPAuthenticationError as e:
        print(
            "Failed to send email: SMTP authentication failed. "
            "If using Gmail, set SMTP_PASSWORD to a Google App Password (16 chars), "
            "not your regular account password."
        )
        print(f"SMTP error detail: {e}")
        return False
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")
        return False


def _send_smtp(
    host: str,
    port: int,
    user: str,
    password: str,
    from_email: str,
    to_email: str,
    message: str,
) -> None:
    """
    Internal function to send email via SMTP (runs in executor thread).
    """
    with smtplib.SMTP(host, port, timeout=10) as server:
        server.starttls()
        server.login(user, password)
        server.sendmail(from_email, to_email, message)


async def send_password_reset_email(
    to_email: str,
    reset_token: str,
) -> bool:
    """
    Send a password reset email with a link containing the reset token.

    Args:
        to_email: User's email address
        reset_token: Password reset token to include in the link

    Returns:
        True if email sent successfully, False otherwise
    """
    email_q = quote(to_email)
    token_q = quote(reset_token)
    reset_link = f"{settings.FRONTEND_URL}/forgot-password?email={email_q}&token={token_q}"

    text_content = f"""
    Password Reset Request

    You requested a password reset. Click the link below to create a new password:

    {reset_link}

    This link expires in 30 minutes.

    If you didn't request this, please ignore this email.
    """

    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50;">Password Reset Request</h2>
                <p>You requested a password reset for your AutoSix account.</p>
                <p style="margin: 30px 0;">
                    <a href="{reset_link}" 
                       style="display: inline-block; padding: 12px 30px; background-color: #007bff; 
                              color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Reset Password
                    </a>
                </p>
                <p style="font-size: 12px; color: #888;">
                    <strong>This link expires in 30 minutes.</strong>
                </p>
                <p style="color: #666; font-size: 14px;">
                    If you didn't request this, please ignore this email or contact support.
                </p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                <p style="font-size: 12px; color: #999;">
                    AutoSix
                </p>
            </div>
        </body>
    </html>
    """

    return await send_email(
        to_email=to_email,
        subject="Password Reset Request - AutoSix",
        html_content=html_content,
        text_content=text_content,
    )
