import { useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { getPetTemplate } from '@utils/petAssetLoader';
import { getTorsoScaleByPbf } from '@utils/petMorphUtils';
import type { PartTransformInput } from '@utils/petTransformUtils';
import type { PetType } from 'types/profile';
import { FAT_MORPH_FOLLOW_RATIOS, PET_RUN_MOTION } from './petMotionConfig';

const IDLE_BREATH_LOOP_MS = 3000;
const RUN_LOOP_MS = 520;

/**
 * 머리 계열 파츠 목록.
 * - idle에서 호흡 시 얼굴 전체가 같이 들썩이도록 공통 transform을 적용할 때 사용한다.
 * - 키는 템플릿 part.key와 1:1로 맞아야 한다.
 */
const HEAD_PART_KEYS = [
  'face',
  'ear_left',
  'ear_right',
  'eye_left',
  'eye_right',
  'eyebrow_left',
  'eyebrow_right',
  'mouth',
  'flushing_left',
  'flushing_right',
  'beard_leftDown',
  'beard_leftUp',
  'beard_rightDown',
  'beard_rightUp',
  'neckRuff',
] as const;

/**
 * Animated.interpolate는 readonly tuple보다 mutable array를 더 잘 수용한다.
 * as const로 선언된 config 배열을 안전하게 복사해 전달하기 위한 헬퍼.
 */
const toMutableRange = <T extends string | number>(values: readonly T[]): T[] => [
  ...values,
];

type Params = {
  /** 현재 러닝 추적 상태. true면 run 루프, false면 idle 루프를 사용한다. */
  isTracking: boolean;
  /** UI에서 계산된 최종 PBF 값(프리뷰/실측/기본값 반영 결과). */
  effectivePbf: number;
  /** 현재 선택된 펫 타입(CAT/DOG). */
  selectedPetType: PetType;
  /** 선택 펫의 main 템플릿 ID. torso morph 기준 파츠 조회에 사용한다. */
  mainPetTemplateId: 'browncat_v1' | 'sibadog_v1';
  /** 렌더 기준 크기(px). follow offset과 미세 보정 계산의 기준 단위다. */
  petRenderSize: number;
};

/**
 * Main 화면의 펫 모션 계산 전용 훅.
 *
 * 책임:
 * 1) torso morph 계산(PBF -> scale)
 * 2) idle/run 애니메이션 루프 관리
 * 3) 파츠별 transform map 생성
 *
 * 비책임:
 * - 화면 상태/네트워크/유저 로딩은 다루지 않는다.
 * - 렌더링 자체는 PetRenderer가 담당한다.
 */
export const useMainPetMotion = ({
  isTracking,
  effectivePbf,
  selectedPetType,
  mainPetTemplateId,
  petRenderSize,
}: Params): {
  idlePartTransforms: Record<string, PartTransformInput>;
  runPartTransforms: Record<string, PartTransformInput>;
} => {
  // progress value는 컴포넌트 생명주기 동안 동일 인스턴스를 유지해야 한다.
  const idleBreathProgress = useRef(new Animated.Value(0)).current;
  const runCycleProgress = useRef(new Animated.Value(0)).current;

  /**
   * 현재 템플릿의 torso 파츠를 조회한다.
   * morph 정의(scale range)가 torso 파츠에 달려 있으므로 기준 파츠가 필요하다.
   */
  const torsoTemplatePart = useMemo(
    () =>
      getPetTemplate({ templateId: mainPetTemplateId }).parts.find(
        (part) => part.key === 'torso'
      ),
    [mainPetTemplateId]
  );

  const torsoMorph = useMemo(() => {
    const baseMorph = getTorsoScaleByPbf(torsoTemplatePart, effectivePbf);
    const t = baseMorph.t;
    // 후반 구간에서 시각 변화가 약해지는 문제를 완화하기 위해 고PBF 가중을 준다.
    const lateRangeBoost = 1 + Math.max(0, t - 0.45) * 0.8;
    // 종별 시각 체감 보정(시바견이 동일 PBF에서도 조금 더 커 보이게).
    const speciesBoostX = selectedPetType === 'DOG' ? 1.45 : 1.2;
    const speciesBoostY = selectedPetType === 'DOG' ? 1.28 : 1.12;
    const boostX = speciesBoostX * lateRangeBoost;
    const boostY = speciesBoostY * lateRangeBoost;

    return {
      ...baseMorph,
      scaleX: 1 + (baseMorph.scaleX - 1) * boostX,
      scaleY: 1 + (baseMorph.scaleY - 1) * boostY,
    };
  }, [effectivePbf, selectedPetType, torsoTemplatePart]);

  useEffect(() => {
    if (isTracking) {
      idleBreathProgress.stopAnimation();
      return;
    }

    // 숨쉬기: 천천히 커졌다가 돌아오는 왕복 루프.
    const idleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(idleBreathProgress, {
          toValue: 1,
          duration: IDLE_BREATH_LOOP_MS / 2,
          useNativeDriver: true,
        }),
        Animated.timing(idleBreathProgress, {
          toValue: 0,
          duration: IDLE_BREATH_LOOP_MS / 2,
          useNativeDriver: true,
        }),
      ])
    );

    idleLoop.start();
    return () => {
      idleLoop.stop();
    };
  }, [idleBreathProgress, isTracking]);

  useEffect(() => {
    if (!isTracking) {
      runCycleProgress.stopAnimation();
      runCycleProgress.setValue(0);
      return;
    }

    // 러닝: 좌우 스윙의 1사이클을 반복.
    const runLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(runCycleProgress, {
          toValue: 1,
          duration: RUN_LOOP_MS / 2,
          useNativeDriver: true,
        }),
        Animated.timing(runCycleProgress, {
          toValue: 0,
          duration: RUN_LOOP_MS / 2,
          useNativeDriver: true,
        }),
      ])
    );

    runLoop.start();
    return () => {
      runLoop.stop();
    };
  }, [isTracking, runCycleProgress]);

  const idlePartTransforms: Record<string, PartTransformInput> = useMemo(() => {
    const isHighPbf = effectivePbf >= 25;
    const legSpreadFactor = isHighPbf ? 0.9 : 1;
    const breathVisualFactor = selectedPetType === 'DOG' ? 1.45 : 1;
    // torso는 scale 중심, head는 translate 중심으로 분리해 과한 들뜸을 방지한다.
    const torsoScaleY = idleBreathProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1 + 0.02 * breathVisualFactor],
    });
    const headTranslateY = idleBreathProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -2 * breathVisualFactor],
    });
    const faceFatScaleX = 1 + torsoMorph.t * 0.14;
    const faceFatScaleY = 1 + torsoMorph.t * 0.11;
    const armFollowOffset =
      petRenderSize * FAT_MORPH_FOLLOW_RATIOS.arm * torsoMorph.t;
    const legFollowOffset =
      petRenderSize * FAT_MORPH_FOLLOW_RATIOS.leg * torsoMorph.t * legSpreadFactor;
    const legMorphOffsetY = petRenderSize * 0.0035 * torsoMorph.t;
    const armFatScaleX = 1 + torsoMorph.t * 0.09;
    const armFatScaleY = 1 + torsoMorph.t * 0.065;
    const tailFollowOffset =
      petRenderSize * FAT_MORPH_FOLLOW_RATIOS.tail * torsoMorph.t;

    const transforms: Record<string, PartTransformInput> = {
      torso: {
        scaleX: torsoMorph.scaleX,
        scaleY: torsoScaleY,
        useAnchorPivot: true,
      },
      arm_left: {
        translateX: -armFollowOffset,
        scaleX: armFatScaleX,
        scaleY: armFatScaleY,
      },
      arm_right: {
        translateX: armFollowOffset,
        scaleX: armFatScaleX,
        scaleY: armFatScaleY,
      },
      leg_left: {
        translateX: -legFollowOffset,
        translateY: legMorphOffsetY,
      },
      leg_right: {
        translateX: legFollowOffset,
        translateY: legMorphOffsetY,
      },
      tail: { translateX: tailFollowOffset },
    };

    HEAD_PART_KEYS.forEach((partKey) => {
      // 얼굴 계열은 호흡과 체지방 스케일을 같이 받아 "몸과 분리된 느낌"을 줄인다.
      transforms[partKey] = {
        translateY: headTranslateY,
        scaleX: faceFatScaleX,
        scaleY: faceFatScaleY,
      };
    });

    return transforms;
  }, [
    effectivePbf,
    idleBreathProgress,
    petRenderSize,
    selectedPetType,
    torsoMorph.scaleX,
    torsoMorph.t,
  ]);

  const runPartTransforms: Record<string, PartTransformInput> = useMemo(() => {
    const isHighPbf = effectivePbf >= 25;
    const legSpreadFactor = isHighPbf ? 0.84 : 1;
    // 고PBF 구간에서 팔 체형 변화가 덜 보이는 문제를 보정한다.
    const runArmFatBoost = isHighPbf ? 1.25 : 1;
    const runTorsoScaleX = 1 + (torsoMorph.scaleX - 1) * 1.35;
    const runTorsoScaleY = 1 + (torsoMorph.scaleY - 1) * 1.2;
    const armFatScaleX = 1 + torsoMorph.t * 0.18 * runArmFatBoost;
    const armFatScaleY = 1 + torsoMorph.t * 0.13 * runArmFatBoost;
    const legFatScaleX = 1 + torsoMorph.t * 0.05;
    const legFatScaleY = 1 + torsoMorph.t * 0.035;
    const faceFatScaleX = 1 + torsoMorph.t * 0.12;
    const faceFatScaleY = 1 + torsoMorph.t * 0.1;
    const runLegMorphOffsetY = petRenderSize * 0.0025 * torsoMorph.t;

    // readonly tuple -> mutable array 변환 후 interpolate에 전달한다.
    const runPhase = toMutableRange(PET_RUN_MOTION.phase);
    const limbLeftX = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.limbLeftX),
    });
    const limbRightX = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.limbRightX),
    });
    const torsoX = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.torsoX),
    });
    const torsoY = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.torsoY),
    });
    const faceX = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.faceX),
    });
    const faceY = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.faceY),
    });
    const armLeftRotate = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.armLeftRotate),
    });
    const armRightRotate = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.armRightRotate),
    });
    const legLeftRotate = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.legLeftRotate),
    });
    const legRightRotate = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.legRightRotate),
    });
    // 꼬리는 다리와 위상이 같으면 로봇처럼 보여 별도 파형을 사용한다.
    const tailRotate = runCycleProgress.interpolate({
      inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
      outputRange: [
        '-7deg',
        '-2deg',
        '6deg',
        '11deg',
        '7deg',
        '1deg',
        '-6deg',
        '-10deg',
        '-7deg',
      ],
    });
    const tailX = runCycleProgress.interpolate({
      inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
      outputRange: [-0.6, -0.2, 0.7, 1.1, 0.6, 0.1, -0.7, -1.0, -0.6],
    });
    const tailY = runCycleProgress.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -0.5, -0.2, -0.6, 0],
    });
    const neckRuffX = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.neckRuffX),
    });
    const neckRuffRotate = runCycleProgress.interpolate({
      inputRange: runPhase,
      outputRange: toMutableRange(PET_RUN_MOTION.neckRuffRotate),
    });

    return {
      torso: {
        translateX: torsoX,
        translateY: torsoY,
        scaleX: runTorsoScaleX,
        scaleY: runTorsoScaleY,
      },
      arm_left: {
        translateX: limbLeftX,
        rotateDeg: armLeftRotate,
        scaleX: armFatScaleX,
        scaleY: armFatScaleY,
      },
      arm_right: {
        translateX: limbRightX,
        rotateDeg: armRightRotate,
        scaleX: armFatScaleX,
        scaleY: armFatScaleY,
      },
      leg_left: {
        translateX: Animated.multiply(limbRightX, legSpreadFactor),
        translateY: runLegMorphOffsetY,
        rotateDeg: legLeftRotate,
        scaleX: legFatScaleX,
        scaleY: legFatScaleY,
      },
      leg_right: {
        translateX: Animated.multiply(limbLeftX, legSpreadFactor),
        translateY: runLegMorphOffsetY,
        rotateDeg: legRightRotate,
        scaleX: legFatScaleX,
        scaleY: legFatScaleY,
      },
      tail: {
        translateX: tailX,
        translateY: tailY,
        rotateDeg: tailRotate,
      },
      neckRuff: {
        translateX: neckRuffX,
        rotateDeg: neckRuffRotate,
      },
      face: {
        translateX: faceX,
        translateY: faceY,
        scaleX: faceFatScaleX,
        scaleY: faceFatScaleY,
      },
      flushing_left: {
        translateX: faceX,
        translateY: faceY,
        scaleX: faceFatScaleX,
        scaleY: faceFatScaleY,
      },
      flushing_right: {
        translateX: faceX,
        translateY: faceY,
        scaleX: faceFatScaleX,
        scaleY: faceFatScaleY,
      },
      eye_left: {
        translateX: faceX,
        translateY: faceY,
        scaleX: faceFatScaleX,
        scaleY: faceFatScaleY,
      },
      eye_right: {
        translateX: faceX,
        translateY: faceY,
        scaleX: faceFatScaleX,
        scaleY: faceFatScaleY,
      },
      mouth: {
        translateX: faceX,
        translateY: faceY,
        scaleX: faceFatScaleX,
        scaleY: faceFatScaleY,
      },
    };
  }, [
    effectivePbf,
    petRenderSize,
    runCycleProgress,
    torsoMorph.scaleX,
    torsoMorph.scaleY,
    torsoMorph.t,
  ]);

  return { idlePartTransforms, runPartTransforms };
};
