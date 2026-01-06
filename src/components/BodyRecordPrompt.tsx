import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleProp,
  Text,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import styles from '@styles/BodyRecordPrompt.styles';
import type { BodyHistoryFormValues } from 'types/bodyHistory';

type BodyRecordPromptProps = {
  visible: boolean;
  dateLabel: string;
  baseDate: string;
  initialHeight?: number;
  initialWeight?: number;
  initialBodyFat?: number;
  weightAim?: number;
  bodyFatAim?: number;
  saving?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  showSkip?: boolean;
  onSave: (values: BodyHistoryFormValues) => void | Promise<void>;
  onLater?: () => void;
  onSkipToday?: () => void;
};

const clampProgress = (value?: number) =>
  Math.min(Math.max(typeof value === 'number' ? value : 0, 0), 1);

const BodyRecordPrompt = ({
  visible,
  dateLabel,
  baseDate,
  initialHeight = 0,
  initialWeight = 0,
  initialBodyFat = 0,
  weightAim = 0,
  bodyFatAim = 0,
  saving = false,
  primaryLabel = '저장할게요',
  secondaryLabel = '나중에 할게요',
  showSkip = true,
  onSave,
  onLater,
  onSkipToday,
}: BodyRecordPromptProps) => {
  const [heightInput, setHeightInput] = useState(String(initialHeight));
  const [weightInput, setWeightInput] = useState(String(initialWeight));
  const [bodyFatInput, setBodyFatInput] = useState(String(initialBodyFat));

  useEffect(() => {
    if (!visible) return;
    setHeightInput(String(initialHeight));
    setWeightInput(String(initialWeight));
    setBodyFatInput(String(initialBodyFat));
  }, [initialHeight, initialBodyFat, initialWeight, visible]);

  const currentWeight = Number(weightInput) || 0;
  const currentBodyFat = Number(bodyFatInput) || 0;

  const weightProgress = useMemo(() => {
    if (currentWeight <= 0 || !weightAim || weightAim <= 0) return 0.55;
    const ratio = weightAim / Math.max(currentWeight, weightAim);
    return clampProgress(ratio);
  }, [currentWeight, weightAim]);

  const weightBarStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.progressBar,
      styles.weightProgressBar,
      { width: `${weightProgress * 100}%` },
    ],
    [weightProgress]
  );

  const bodyFatProgress = useMemo(() => {
    if (currentBodyFat <= 0 || !bodyFatAim || bodyFatAim <= 0) return 0.6;
    const ratio = bodyFatAim / Math.max(currentBodyFat, bodyFatAim);
    return clampProgress(ratio);
  }, [bodyFatAim, currentBodyFat]);

  const bodyFatBarStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.progressBar,
      styles.fatProgressBar,
      { width: `${bodyFatProgress * 100}%` },
    ],
    [bodyFatProgress]
  );

  const handleSave = () => {
    const heightCm = Number(heightInput);
    const weightKg = Number(weightInput);
    const pbf = Number(bodyFatInput);

    if (
      Number.isNaN(heightCm) ||
      Number.isNaN(weightKg) ||
      Number.isNaN(pbf) ||
      heightCm <= 0 ||
      weightKg <= 0 ||
      pbf < 0
    ) {
      Alert.alert(
        '입력 오류',
        '키, 체중, 체지방률을 모두 올바르게 입력해주세요.'
      );
      return;
    }

    onSave({
      heightCm,
      weightKg,
      pbf,
      baseDate,
    });
  };

  return (
    <Modal transparent animationType='fade' visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.dateLabel}>{dateLabel}</Text>
              <Text style={styles.subtitle}>오늘의 몸을 기록해요!</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeIcon}>😺</Text>
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>키</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType='decimal-pad'
                  value={heightInput}
                  onChangeText={setHeightInput}
                  placeholder='0'
                  placeholderTextColor='#9CA3AF'
                  selectTextOnFocus
                />
                <Text style={styles.fieldUnit}>cm</Text>
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>체중</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType='decimal-pad'
                  value={weightInput}
                  onChangeText={setWeightInput}
                  placeholder='0'
                  placeholderTextColor='#9CA3AF'
                  selectTextOnFocus
                />
                <Text style={styles.fieldUnit}>kg</Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={weightBarStyle} />
            </View>
            {typeof weightAim === 'number' && (
              <Text style={styles.aimText}>aim: {weightAim}</Text>
            )}
          </View>

          <View style={styles.field}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>체지방률</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType='decimal-pad'
                  value={bodyFatInput}
                  onChangeText={setBodyFatInput}
                  placeholder='0'
                  placeholderTextColor='#9CA3AF'
                  selectTextOnFocus
                />
                <Text style={styles.fieldUnit}>%</Text>
              </View>
            </View>
            <View style={[styles.progressTrack, styles.progressTrackFat]}>
              <View style={bodyFatBarStyle} />
            </View>
            {typeof bodyFatAim === 'number' && (
              <Text style={styles.aimText}>aim: {bodyFatAim}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🧡</Text>
            <Text style={styles.infoText}>
              마이페이지에서 다시 기록할 수 있어요.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={[
                styles.button,
                styles.primaryButton,
                saving && styles.buttonDisabled,
              ]}
              disabled={saving}
              onPress={handleSave}
            >
              <Text style={styles.primaryText}>{primaryLabel}</Text>
            </Pressable>
            {onLater && (
              <Pressable
                style={[
                  styles.button,
                  styles.secondaryButton,
                  saving && styles.buttonDisabled,
                ]}
                disabled={saving}
                onPress={onLater}
              >
                <Text style={styles.secondaryText}>{secondaryLabel}</Text>
              </Pressable>
            )}
          </View>

          {showSkip && onSkipToday && (
            <Pressable
              style={styles.skipToday}
              onPress={onSkipToday}
              disabled={saving}
            >
              <Text style={styles.skipTodayText}>오늘은 안 볼래요</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default BodyRecordPrompt;
