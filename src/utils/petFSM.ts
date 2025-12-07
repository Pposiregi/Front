import { useState, useRef } from 'react';
import { PetState, PetStates } from '@utils/petState';

// 상태관리
export const usePetFSM = () => {
  const [state, setState] = useState<PetState>(PetStates.IDLE);
  const timerRef = useRef<number | null>(null);

  type TransitionOptions = {
    duration?: number;
  };

  const transition = (newState: PetState, options: TransitionOptions = {}) => {
    const { duration } = options;

    // 중복 상태로는 전환하지 않음
    if (state === newState) return;

    // 기존 타이머 클리어
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setState(newState);

    // duration 후 자동 복귀 (예: HAPPY -> IDLE)
    if (duration) {
      timerRef.current = setTimeout(() => {
        setState(PetStates.IDLE);
      }, duration);
    }
  };

  return {
    state,
    transition,
  };
};
