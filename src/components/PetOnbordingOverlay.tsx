import { postPets } from '@api/petApi';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function PetOnboardingOverlay({ visible, onClose }: Props) {
  const [petType, setPetType] = useState<'DOG' | 'CAT' | null>(null);
  const [name, setName] = useState('');

  if (!visible) return null;

  const handleCreate = async () => {
    if (!petType || !name) return;
    try {
      await postPets({
        name,
        petType,
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <View>
        <Text>함께 달릴 친구를 만들어볼까요?</Text>

        <TouchableOpacity onPress={() => setPetType('DOG')}>
          <Text>🐶 강아지</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setPetType('CAT')}>
          <Text>🐱 고양이</Text>
        </TouchableOpacity>

        <TextInput placeholder='펫 이름' value={name} onChangeText={setName} />

        <TouchableOpacity onPress={handleCreate}>
          <Text>시작하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
