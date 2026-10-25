from urllib.parse import urlencode

from beanie import PydanticObjectId

from backend.repositories.user import UserRepository
from backend.services.mail import MailService
from backend.settings import settings
from templates.verification import render_verification_email


async def send_verification_email(
    ctx,  # noqa: ARG001
    user_id: str,
    code: str,
    token: str,
):
    mail_service = MailService()
    user_repository = UserRepository()

    user = await user_repository.find_by_id(PydanticObjectId(user_id))
    if not user:
        return

    verify_url = f'{settings.frontend_url.rstrip("/")}/verify-email?' + urlencode(
        {
            'user_id': str(user.id),
            'method': 'token',
            'data': token,
        }
    )

    email = render_verification_email(
        code=code,
        verify_url=verify_url,
        name=user.name,
        email=user.email,
        site_url=settings.frontend_url,
    )

    await mail_service.send(
        to=user.email,
        subject=email.subject,
        text=email.text,
        html=email.html,
    )
