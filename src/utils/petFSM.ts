import { useState, useRef } from 'react';
import { PetState, PetStates } from '@utils/petState';

/**
 * 펫 상태 전환(FSM)을 관리하는 훅.
 * - 현재 상태 저장
 * - 상태 전환
 * - duration 기반 자동 복귀(HAPPY -> IDLE 등)
 * 를 한 곳에서 처리한다.
 */
export const usePetFSM = () => {
  const [state, setState] = useState<PetState>(PetStates.IDLE);
  const stateRef = useRef<PetState>(PetStates.IDLE);
  const timerRef = useRef<number | null>(null);

  type TransitionOptions = {
    duration?: number;
  };

  /**
   * 상태 전환 실행 함수.
   * duration이 있으면 해당 시간 후 IDLE로 자동 복귀시킨다.
   * 이전 타이머는 항상 정리해서 중복 복귀/레이스 컨디션을 방지한다.
   */
  const transition = (newState: PetState, options: TransitionOptions = {}) => {
    const { duration } = options;

    // 중복 상태로는 전환하지 않음
    if (stateRef.current === newState) return;

    // 기존 타이머 클리어
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setState(() => {
      stateRef.current = newState;
      return newState;
    });

    // duration 후 자동 복귀 (예: HAPPY -> IDLE)
    if (duration) {
      timerRef.current = setTimeout(() => {
        setState(() => {
          stateRef.current = PetStates.IDLE;
          return PetStates.IDLE;
        });
      }, duration);
    }
  };

  return {
    state,
    transition,
  };
};
