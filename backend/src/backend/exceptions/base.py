class AppException(Exception):
    status_code = 500  # Internal Server Error
    detail = 'Internal Server Error'

    def __init__(self, detail: str | None = None, data=None):
        super().__init__(detail or self.detail)
        if detail is not None:
            self.detail = detail
        self.data = data
