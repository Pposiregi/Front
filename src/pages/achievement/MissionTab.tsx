import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import dayjs from 'dayjs';

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
  // 날짜 범위
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(
    null
  );

  // 모달 상태
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

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

    // 날짜별
    const grouped: Record<string, MissionHistoryItem[]> = {};
    completed.forEach((mission) => {
      const dateKey = dayjs(mission.completedAt).format('YYYY.MM.DD');
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(mission);
    });

    let sectionList: MissionSection[] = Object.keys(grouped).map((date) => ({
      title: date,
      // 기록은 오름차순
      data: grouped[date].sort(
        (a, b) =>
          new Date(a.completedAt!).getTime() -
          new Date(b.completedAt!).getTime()
      ),
    }));

    sectionList = sectionList.sort(
      (a, b) =>
        new Date(b.title.replace(/\./g, '-')).getTime() -
        new Date(a.title.replace(/\./g, '-')).getTime()
    );

    return sectionList;
  }, [missions]);

  // 필터링 적용
  const filteredSections = useMemo(() => {
    if (!dateRange) return sections;

    const start = dayjs(dateRange.start);
    const end = dayjs(dateRange.end);

    return sections
      .map((section) => ({
        ...section,
        data: section.data.filter((item) => {
          const completed = dayjs(item.completedAt);
          return (
            completed.isAfter(start.subtract(1, 'day')) &&
            completed.isBefore(end.add(1, 'day'))
          );
        }),
      }))
      .filter((section) => section.data.length > 0);
  }, [sections, dateRange]);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // 날짜 선택 핸들러
  const handleStartConfirm = (date: Date) => {
    setStartPickerVisible(false);
    setDateRange((prev) => ({ start: date, end: prev?.end || date }));
  };
  const handleEndConfirm = (date: Date) => {
    setEndPickerVisible(false);
    setDateRange((prev) => ({ start: prev?.start || date, end: date }));
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
      {/* 기간 선택 UI */}
      <View style={{ flexDirection: 'row', padding: 16, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => setStartPickerVisible(true)}>
          <Text style={{ marginRight: 8, fontSize: 14 }}>
            {dateRange ? dayjs(dateRange.start).format('YYYY.MM.DD') : '시작일'}
          </Text>
        </TouchableOpacity>
        <Text>~</Text>
        <TouchableOpacity onPress={() => setEndPickerVisible(true)}>
          <Text style={{ marginLeft: 8, fontSize: 14 }}>
            {dateRange ? dayjs(dateRange.end).format('YYYY.MM.DD') : '종료일'}
          </Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode='date'
        onConfirm={handleStartConfirm}
        onCancel={() => setStartPickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode='date'
        onConfirm={handleEndConfirm}
        onCancel={() => setEndPickerVisible(false)}
      />

      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.missionCheckId.toString()}
        ListHeaderComponent={() => (
          <View style={{ padding: 16 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Roboto-VariableFont',
                color: '#000',
              }}
            >
              오늘도 열심히
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'VariableFont',
                color: '#000',
                marginTop: 4,
              }}
            >
              펫이랑 함께 완료한 미션들이에요 🙂
            </Text>
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
            <View style={styles.listItemBox}>
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
                  {item.progressValue} / {item.goalValue}
                  {item.category === 'STEP' ? ' 걸음' : ''}
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
