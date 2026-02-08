import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Button,
  Image,
} from 'react-native';
import dayjs from 'dayjs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { styles } from '@styles/Achievement_Mission.styles';
import { MissionHistoryItem } from '../../types/mission';
import { getMissionHistory } from '@api/missionApi';

type MissionStatus = 'LOADING' | 'READY' | 'ERROR';

type MissionSection = {
  title: string;
  data: MissionHistoryItem[];
};

const CATEGORY_META = {
  STEP: { icon: '👟', color: '#4CAF50' },
  MEAL: { icon: '🍽️', color: '#FF9800' },
};

const MissionTab = () => {
  const [missions, setMissions] = useState<MissionHistoryItem[]>([]);
  const [status, setStatus] = useState<MissionStatus>('LOADING');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  // 선택된 기간
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(
    null
  );

  // 모달 상태
  const [isModalVisible, setModalVisible] = useState(false);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  // 임시 모달 내 날짜
  const [tempStart, setTempStart] = useState<Date | null>(null);
  const [tempEnd, setTempEnd] = useState<Date | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getMissionHistory();
        setMissions(data.missions);
        setStatus('READY');
      } catch (e) {
        console.error('미션 히스토리 조회 실패', e);
        setErrorMessage(
          '미션 기록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'
        );
        setStatus('ERROR');
      }
    };
    fetchMissions();
  }, []);

  const sections: MissionSection[] = useMemo(() => {
    const completed = missions.filter((m) => m.completedAt);
    const grouped: Record<string, MissionHistoryItem[]> = {};
    completed.forEach((m) => {
      const dateKey = dayjs(m.completedAt).format('YYYY.MM.DD');
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(m);
    });
    let sectionList: MissionSection[] = Object.keys(grouped).map((date) => ({
      title: date,
      data: grouped[date].sort(
        (a, b) =>
          new Date(a.completedAt!).getTime() -
          new Date(b.completedAt!).getTime()
      ),
    }));
    return sectionList.sort(
      (a, b) =>
        new Date(b.title.replace(/\./g, '-')).getTime() -
        new Date(a.title.replace(/\./g, '-')).getTime()
    );
  }, [missions]);

  const filteredSections = useMemo(() => {
    if (!dateRange) return sections;
    const start = dayjs(dateRange.start).startOf('day').valueOf();
    const end = dayjs(dateRange.end).endOf('day').valueOf();

    return sections
      .map((section) => ({
        ...section,
        data: section.data.filter((item) => {
          const completed = dayjs(item.completedAt).valueOf();
          return completed >= start && completed <= end;
        }),
      }))
      .filter((section) => section.data.length > 0);
  }, [sections, dateRange]);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleStartConfirm = (date: Date) => {
    setStartPickerVisible(false);
    setTempStart(date);
  };
  const handleEndConfirm = (date: Date) => {
    setEndPickerVisible(false);
    setTempEnd(date);
  };
  const applyDateRange = () => {
    if (tempStart && tempEnd) {
      setDateRange({ start: tempStart, end: tempEnd });
    }
    setModalVisible(false);
  };

  if (status === 'LOADING') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  if (status === 'ERROR') {
    return (
      <View style={styles.loadingContainer}>
        <Text>{errorMessage}</Text>
      </View>
    );
  }

  if (sections.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>아직 완료된 미션이 없어요 🙂</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 기간 선택 모달 */}
      <Modal visible={isModalVisible} animationType='slide' transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>기간 선택</Text>

            <TouchableOpacity
              onPress={() => setStartPickerVisible(true)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>
                {tempStart
                  ? dayjs(tempStart).format('YYYY.MM.DD')
                  : '시작일 선택'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEndPickerVisible(true)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>
                {tempEnd ? dayjs(tempEnd).format('YYYY.MM.DD') : '종료일 선택'}
              </Text>
            </TouchableOpacity>

            <Button title='확인' onPress={applyDateRange} />
            <Button
              title='취소'
              color='gray'
              onPress={() => setModalVisible(false)}
            />

            <DateTimePickerModal
              isVisible={isStartPickerVisible}
              mode='date'
              locale='ko-KR'
              onConfirm={handleStartConfirm}
              onCancel={() => setStartPickerVisible(false)}
            />
            <DateTimePickerModal
              isVisible={isEndPickerVisible}
              mode='date'
              locale='ko-KR'
              onConfirm={handleEndConfirm}
              onCancel={() => setEndPickerVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* SectionList */}
      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.missionCheckId.toString()}
        ListHeaderComponent={() => (
          <View style={styles.listHeaderContainer}>
            <View>
              <Text style={styles.listHeaderTitle}>오늘도 열심히</Text>
              <Text style={styles.listHeaderSubtitle}>
                펫이랑 함께 완료한 미션들이에요 🙂
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setTempStart(dateRange?.start || new Date());
                setTempEnd(dateRange?.end || new Date());
                setModalVisible(true);
              }}
              style={styles.dateRangeButton}
            >
              <Image
                source={require('@assets/images/icon/setting_icon.png')}
                style={styles.dateRangeIcon}
              />
            </TouchableOpacity>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <TouchableOpacity
            onPress={() => toggleSection(section.title)}
            style={styles.sectionHeader}
          >
            <Text style={styles.sectionHeaderText}>
              {section.title} {expandedSections[section.title] ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        )}
        renderItem={({ item, section }) => {
          if (!expandedSections[section.title]) return null;
          const meta = CATEGORY_META[item.category];
          return (
            <View style={[styles.listItemBox, { borderLeftColor: meta.color }]}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: meta.color + '22' },
                ]}
              >
                <Text style={styles.iconText}>{meta.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemTitle}>{item.title}</Text>
                <Text style={styles.listItemSub}>
                  {item.progressValue} / {item.goalValue}{' '}
                  {item.category === 'STEP' ? '걸음' : ''}
                </Text>
              </View>
              <View style={styles.rightBox}>
                <Text style={styles.completedText}>완료</Text>
                <Text style={styles.timeText}>
                  {dayjs(item.completedAt).format('HH:mm')}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default MissionTab;
