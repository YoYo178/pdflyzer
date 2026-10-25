def redis_pub_event(destination: str, payload: str | dict | list):
    return {'destination': destination, 'payload': payload}
