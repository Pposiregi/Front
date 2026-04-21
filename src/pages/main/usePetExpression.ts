import { useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { PetType } from 'types/profile';
import {
  PET_EXPRESSION_ASSETS,
  type PetExpression,
} from './petExpressionAssets';

const PET_EXPRESSION_RESET_MS = 1200;
const PET_RUN_COMPLETE_SMILE_MS = PET_EXPRESSION_RESET_MS + 500;
const PET_DRAG_RESET_MS = 700;
const PET_DRAG_TRIGGER_DISTANCE = 18;

const isSupportedPetType = (value: string): value is PetType =>
  value === 'CAT' || value === 'DOG';

/***
 * 펫 상호작용에 따른 표정 변화를 관리하는 커스텀 훅
 * - MainPage에서 펫과의 상호작용에 따른 표정 변화를 일관되게 관리한다.
 *
 */

export const usePetExpression = (selectedPetType: PetType | string) => {
  // neutral 이외의 값이 들어오면 해당 표정 오버레이를 렌더링
  const [petExpression, setPetExpression] = useState<PetExpression>('neutral');
  // 표정 자동 복귀 타이머를 한 곳에서 관리해 중복 setTimeout 누적 막기
  const petExpressionResetTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  // 새 표정 적용 전, 이전 복귀 타이머가 남아 있으면 선 정리
  const clearPetExpressionReset = useCallback(() => {
    if (petExpressionResetTimeoutRef.current) {
      clearTimeout(petExpressionResetTimeoutRef.current);
      petExpressionResetTimeoutRef.current = null;
    }
  }, []);

  // 공용 reset 함수: 외부에서 즉시 기본 표정으로 되돌려야 할 때
  const resetPetExpression = useCallback(() => {
    clearPetExpressionReset();
    setPetExpression('neutral');
  }, [clearPetExpressionReset]);

  const schedulePetExpressionReset = useCallback(
    (delayMs: number) => {
      // 표정이 바뀔 때마다 마지막 요청만 유효하도록 타이머를 다시 건다.
      clearPetExpressionReset();
      petExpressionResetTimeoutRef.current = setTimeout(() => {
        setPetExpression('neutral');
        petExpressionResetTimeoutRef.current = null;
      }, delayMs);
    },
    [clearPetExpressionReset]
  );

  const showPetExpression = useCallback(
    (expression: Exclude<PetExpression, 'neutral'>, durationMs: number) => {
      // 특정 표정을 보여준 뒤 지정된 시간 후 자동으로 neutral 로 복귀시킨다.
      setPetExpression(expression);
      schedulePetExpressionReset(durationMs);
    },
    [schedulePetExpressionReset]
  );

  // 짧은 탭 상호작용은 놀란 표정으로 피드백한다.
  const showPetPressExpression = useCallback(() => {
    showPetExpression('amazed', PET_EXPRESSION_RESET_MS);
  }, [showPetExpression]);

  // 러닝 완료 연출은 웃는 표정을 조금 더 오래 유지한다.
  const showRunCompleteExpression = useCallback(() => {
    showPetExpression('smile', PET_RUN_COMPLETE_SMILE_MS);
  }, [showPetExpression]);

  // 아래로 끌어당기기 시작하면 즉시 슬픈 표정으로 바꾼다.
  const handlePetDragStart = useCallback(() => {
    clearPetExpressionReset();
    setPetExpression('sad');
  }, [clearPetExpressionReset]);

  // 드래그가 끝나면 바로 복귀하지 않고 짧게 여운을 준다.
  const handlePetDragEnd = useCallback(() => {
    schedulePetExpressionReset(PET_DRAG_RESET_MS);
  }, [schedulePetExpressionReset]);

  const petPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        // 수직 하향 드래그만 펫 상호작용으로 처리해 일반 탭과 좌우 스와이프를 분리한다.
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy > PET_DRAG_TRIGGER_DISTANCE &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderGrant: handlePetDragStart,
        onPanResponderMove: (_, gestureState) => {
          // responder 획득 직후 외에도, 충분히 아래로 당겨졌으면 표정을 유지한다.
          if (gestureState.dy > PET_DRAG_TRIGGER_DISTANCE) {
            handlePetDragStart();
          }
        },
        onPanResponderRelease: handlePetDragEnd,
        onPanResponderTerminate: handlePetDragEnd,
      }),
    [handlePetDragEnd, handlePetDragStart]
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        // 화면을 벗어나면 테스트/상호작용 표정을 남기지 않고 기본 얼굴로 복귀시킨다.
        resetPetExpression();
      };
    }, [resetPetExpression])
  );

  // 서버/스토리지에 오래된 petType이 남아도 표정 렌더링이 화면을 크래시시키지 않게 막는다.
  const expressionAssetsByType = isSupportedPetType(selectedPetType)
    ? PET_EXPRESSION_ASSETS[selectedPetType]
    : undefined;
  const expressionOverlays =
    petExpression === 'neutral'
      ? undefined
      : expressionAssetsByType?.[petExpression];

  // MainPage 에서는 실제 렌더링 오버레이와 연결용 핸들러만 받으면 되도록 인터페이스를 단순화한다.
  return {
    expressionOverlays,
    petPanHandlers: petPanResponder.panHandlers,
    resetPetExpression,
    showPetPressExpression,
    showRunCompleteExpression,
  };
};
