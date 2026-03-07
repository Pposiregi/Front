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
  if (isSessionExpireHandling) {
    return;
  }

  isSessionExpireHandling = true;
  try {
    if (sessionExpiredHandler) {
      await sessionExpiredHandler(reason);
    }
  } catch (error) {
    console.error('[AuthSession] 세션 만료 처리 실패', error);
  }
};

