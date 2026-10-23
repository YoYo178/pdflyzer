import aiosmtplib
from email.message import EmailMessage

from backend.settings import settings

class MailService:
    def __init__(self) -> None:
        self.host = settings.smtp_host
        self.port = settings.smtp_port
        self.username = settings.smtp_username
        self.password = settings.smtp_password
        self.sender = settings.smtp_from

    async def send(
        self,
        *,
        to: str,
        subject: str,
        text: str,
        html: str | None = None
    ) -> None:
        message = EmailMessage()
        message['from'] = self.sender
        message['to'] = to
        message['subject'] = subject
        
        message.set_content(text)
        
        if html is not None:
            message.add_alternative(html, subtype='html')
        
        await aiosmtplib.send(
            message,
            hostname=self.host,
            port=self.port,
            username=self.username,
            password=self.password,
            start_tls=True,
            timeout=15
        )