// ====================
// 모달 컴포넌트

import { styles } from '@styles/Achievement.styles';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ====================
type ItemModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  imageUri: ImageSourcePropType;
  extraText?: string;
};

export const ItemModal = ({
  visible,
  onClose,
  title,
  imageUri,
  extraText,
}: ItemModalProps) => (
  <Modal
    visible={visible}
    transparent
    animationType='fade'
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalBackground}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.modalContent} pointerEvents='none'>
        <Image
          source={imageUri}
          style={styles.fullScreenImage}
          resizeMode='contain'
        />
        <Text style={styles.modalTitleText}>{title}</Text>
        {extraText && <Text style={{ textAlign: 'center' }}>{extraText}</Text>}
      </View>
    </TouchableOpacity>
  </Modal>
);
