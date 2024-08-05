from contextlib import contextmanager
from time import sleep

import redis

from django.conf import settings


redis_client = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)

@contextmanager
def distributed_lock(lock_name, timeout=10, retry_interval=0.1):
    """
    Redis 기반의 분산 락을 위한 컨텍스트 매니저.
    
    :param lock_name: 락의 이름
    :param timeout: 락 유지 시간 (초)
    :param retry_interval: 재시도 간격 (초)
    """
    lock_key = f"lock:{lock_name}"
    acquired = False

    try:
        while not acquired:
            # SETNX로 락 획득 시도
            acquired = redis_client.set(lock_key, "locked", ex=timeout, nx=True)
            if not acquired:
                sleep(retry_interval)  # 재시도 전 대기

        yield acquired
    finally:
        # 작업 완료 후 락 해제
        if acquired:
            redis_client.delete(lock_key)
