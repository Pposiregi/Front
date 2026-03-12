import { postPets } from '@api/petApi';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';

type Props = {
  onFinish: () => void;
};

export default function PetCreatePage({ onFinish }: Props) {
  const [petType, setPetType] = useState<'DOG' | 'CAT' | null>(null);
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!petType || !name) return;

    try {
      await postPets({
        name,
        petType,
      });

      onFinish();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <View style={{ width: '100%' }}>
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
