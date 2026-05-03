import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Colors, Fonts } from '@styles/theme';
import { styles } from '@styles/PermissionPage.styles';
import TermsModal, { SelectedTerms } from '@components/TermsModal';
import { getTerms, TermsResponse } from '@api/termsApi';

export type TermsAgreement = {
  termsId: number;
  isAgreed: boolean;
  termsCode: string;
};

type PermissionProps = {
  onNext: (data: { termsAgreements: TermsAgreement[] }) => void;
};

/**
 * 약관 동의 화면.
 * - 서버에서 약관 목록을 받아 동적으로 항목을 렌더링한다.
 * - [>] 버튼을 누르면 해당 약관 전문을 모달로 볼 수 있다.
 * - 필수 항목을 모두 동의해야 다음 단계로 진행할 수 있다.
 */
const PermissionPage: React.FC<PermissionProps> = ({ onNext }) => {
  const [termsList, setTermsList] = useState<TermsResponse[]>([]);
  const [agreements, setAgreements] = useState<Record<number, boolean>>({});
  const [selectedTerms, setSelectedTerms] = useState<SelectedTerms>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const data = await getTerms();
        setTermsList(data);
        const initial: Record<number, boolean> = {};
        data.forEach((t) => {
          initial[t.termsId] = false;
        });
        setAgreements(initial);
      } catch (err) {
        console.error('[PermissionPage] 약관 목록 로드 실패', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  const agreeAll =
    termsList.length > 0 && termsList.every((t) => agreements[t.termsId]);

  const allRequiredAgreed = termsList
    .filter((t) => t.isRequired)
    .every((t) => agreements[t.termsId]);

  const handleAgreeAll = () => {
    const next = !agreeAll;
    const updated: Record<number, boolean> = {};
    termsList.forEach((t) => {
      updated[t.termsId] = next;
    });
    setAgreements(updated);
  };

  const toggle = (termsId: number) => {
    setAgreements((prev) => ({ ...prev, [termsId]: !prev[termsId] }));
  };

  const handleNext = () => {
    const termsAgreements: TermsAgreement[] = termsList.map((t) => ({
      termsId: t.termsId,
      isAgreed: agreements[t.termsId] ?? false,
      termsCode: t.termsCode,
    }));
    onNext({ termsAgreements });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.accentStrong} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.textSecondary, fontFamily: Fonts.Pretendard, textAlign: 'center' }}>
          약관을 불러오는 데 실패했습니다.{'\n'}잠시 후 다시 시도해주세요.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        FitPet과 함께 귀여운 여행을 위한 {'\n'}약관에 대해 안내할게요!
      </Text>
      <Text style={styles.subtitle}>
        아래 약관에 <Text style={{ color: 'red' }}>동의</Text>하시면 시작됩니다.
      </Text>

      {/* 전체 동의 */}
      <Pressable style={styles.checkboxContainer} onPress={handleAgreeAll}>
        <View pointerEvents='none' style={styles.checkboxWrapper}>
          <CheckBox value={agreeAll} onValueChange={undefined} />
        </View>
        <Text style={styles.allCheckboxLabel}>전체 동의</Text>
      </Pressable>
      <View style={styles.divider} />

      {/* 서버에서 받은 약관 목록 */}
      {termsList.map((term) => (
        <View key={term.termsId} style={styles.termRow}>
          <Pressable
            style={styles.termCheckArea}
            onPress={() => toggle(term.termsId)}
          >
            <View pointerEvents='none' style={styles.checkboxWrapper}>
              <CheckBox
                value={agreements[term.termsId] ?? false}
                onValueChange={undefined}
              />
            </View>
            <Text style={styles.checkboxLabel}>
              <Text style={term.isRequired ? styles.requiredBadge : styles.optionalBadge}>
                {term.isRequired ? '[필수] ' : '[선택] '}
              </Text>
              {term.title}
            </Text>
          </Pressable>
          <Pressable
            style={styles.arrowButton}
            onPress={() =>
              setSelectedTerms({ title: term.title, content: term.content })
            }
            hitSlop={8}
          >
            <Text style={styles.arrowText}>{'>'}</Text>
          </Pressable>
        </View>
      ))}

      <View style={{ alignItems: 'center' }}>
        <Pressable
          style={[
            styles.startButton,
            !allRequiredAgreed && { backgroundColor: Colors.disabled },
          ]}
          disabled={!allRequiredAgreed}
          onPress={handleNext}
        >
          <Text style={styles.startButtonText}>시작하기</Text>
        </Pressable>
      </View>

      <TermsModal terms={selectedTerms} onClose={() => setSelectedTerms(null)} />
    </View>
  );
};

export default PermissionPage;
