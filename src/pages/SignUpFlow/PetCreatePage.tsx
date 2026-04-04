import { postPets } from '@api/petApi';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '@store/index';
import userSlice from '@slices/user';
import { Image } from 'react-native';
import { Colors } from '@styles/theme';

export default function PetCreatePage() {
  const [petType, setPetType] = useState<'DOG' | 'CAT' | null>(null);
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);
  const [selectedPetImage, setSelectedPetImage] = useState<any>(null);
  const nickname = useAppSelector((state) => state.user.nickname);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const cardScale = useRef(new Animated.Value(0)).current;

  const dispatch = useAppDispatch();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setStep(1);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 1300);

    setTimeout(() => {
      setStep(2);

      Animated.spring(cardScale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }, 2500);
  }, []);

  const handleCreate = async () => {
    if (!petType || !name) {
      Alert.alert('알림', '펫 종류와 이름을 모두 입력해주세요.');
      return;
    }

    try {
      const pet = await postPets({
        name,
        petType,
        color: 'UNKNOWN',
      });

      await AsyncStorage.setItem('petId', String(pet.petId));
      dispatch(userSlice.actions.setPet(pet.petId));
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '펫 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      {step < 2 && (
        <View style={styles.introBox}>
          <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
            안녕하세요 {nickname}님!
          </Animated.Text>

          {step >= 1 && (
            <Animated.Text
              style={[
                styles.subtitle,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              함께 달릴 친구를 선택해봐요
            </Animated.Text>
          )}
        </View>
      )}

      {step === 2 && (
        <Animated.View
          style={{
            width: '100%',
            transform: [{ scale: cardScale }],
          }}
        >
          <Text style={styles.title}>함께 달릴 친구를 만들어볼까요?</Text>

          <View style={styles.petContainer}>
            <TouchableOpacity
              style={[styles.card, petType === 'DOG' && styles.selected]}
              onPress={() => {
                setPetType('DOG');
                setSelectedPetImage(
                  require('@assets/pet/brown_cat/origin/browncat_v1.png')
                );
              }}
            >
              <Image
                source={require('@assets/images/profile/image_02.png')}
                style={styles.petImage}
              />
              <Text>강아지</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, petType === 'CAT' && styles.selected]}
              onPress={() => {
                setPetType('CAT');
                setSelectedPetImage(
                  require('@assets/pet/brown_cat/origin/browncat_v1.png')
                );
              }}
            >
              <Image
                source={require('@assets/images/profile/image_01.png')}
                style={styles.petImage}
              />
              <Text>고양이</Text>
            </TouchableOpacity>
          </View>
          {selectedPetImage && (
            <Animated.Image
              source={selectedPetImage}
              style={[
                styles.selectedPetImage,
                { transform: [{ scale: cardScale }] },
              ]}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder='펫 이름'
            value={name}
            onChangeText={setName}
          />

          <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>시작하기</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.surface,
  },

  introBox: {
    alignItems: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: 18,
    marginTop: 20,
    color: '#666',
  },

  petContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 30,
  },
  petImage: { width: 80, height: 80, marginBottom: 10, resizeMode: 'contain' },

  selectedPetImage: {
    width: 200,
    height: 200,
    marginVertical: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  card: {
    width: 140,
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selected: {
    borderColor: '#FF6347',
    borderWidth: 2,
  },

  emoji: {
    fontSize: 50,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#FF6347',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
