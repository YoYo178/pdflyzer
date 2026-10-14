def generate_error_message(
    code: int, fallback: str = 'Something went wrong, please try again later.'
):
    message = ''

    match code:
        case 429:
            message = 'You have exceeded your limits, please try again after some time.'
        case 503:
            message = 'This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.'

    return message or fallback
