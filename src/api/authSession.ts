type SessionExpiredReason =
  | 'REFRESH_TOKEN_INVALID'
  | 'REFRESH_FAILED';

type SessionExpiredHandler = (reason: SessionExpiredReason) => Promise<void> | void;

let sessionExpiredHandler: SessionExpiredHandler | null = null;
let isSessionExpireHandling = false;

export const setSessionExpiredHandler = (handler: SessionExpiredHandler) => {
  sessionExpiredHandler = handler;
};

export const clearSessionExpiredHandler = () => {
  sessionExpiredHandler = null;
};

export const resetSessionExpiredState = () => {
  isSessionExpireHandling = false;
};

export const notifySessionExpired = async (
  reason: SessionExpiredReason
) => {
  // 핸들러 등록 전 호출은 무시한다.
  // 여기서 latch를 잠가 버리면 이후 정상 등록돼도 만료 알림이 영구 차단된다.
  if (isSessionExpireHandling || !sessionExpiredHandler) {
    return;
  }

  isSessionExpireHandling = true;
  try {
    await sessionExpiredHandler(reason);
  } catch (error) {
    // 핸들러 실패는 영구 잠금으로 이어지면 안 되므로 즉시 복구한다.
    isSessionExpireHandling = false;
    console.error('[AuthSession] 세션 만료 처리 실패', error);
  }
};
