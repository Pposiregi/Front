import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { styles } from '@styles/TermsModal.styles';
import { SCREEN_HEIGHT } from '@styles/dimensions';

export type SelectedTerms = {
  title: string;
  content: string;
} | null;

type Props = {
  terms: SelectedTerms;
  onClose: () => void;
};

const TermsModal: React.FC<Props> = ({ terms, onClose }) => {
  if (!terms) {
    return null;
  }

  return (
    <Modal
      visible
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <View style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {terms.title}
          </Text>
          <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>
        <ScrollView style={{ height: SCREEN_HEIGHT * 0.8 }}>
          <Text style={styles.content}>{terms.content}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default TermsModal;
