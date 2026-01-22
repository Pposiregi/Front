import AsyncStorage from '@react-native-async-storage/async-storage';

const PET_ID_KEY = 'petId';

export const ensurePetIdStored = async (seed?: string) => {
  const existing = await AsyncStorage.getItem(PET_ID_KEY);
  if (existing) {
    return existing;
  }
  if (seed) {
    await AsyncStorage.setItem(PET_ID_KEY, seed);
    return seed;
  }
  return null;
};

export const getPetId = async () => {
  return AsyncStorage.getItem(PET_ID_KEY);
};

export const setPetId = async (value: string | number) => {
  await AsyncStorage.setItem(PET_ID_KEY, String(value));
};

export const getResolvedPetId = async (
  fallback = 1,
  logPrefix = '>>> [PetId]'
) => {
  const raw = await getPetId();
  if (raw === null || raw === '') {
    console.warn(`${logPrefix} 저장된 petId가 없어 기본값 ${fallback} 사용`);
    return fallback;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    console.warn(`${logPrefix} 저장된 petId가 없어 기본값 ${fallback} 사용`);
    return fallback;
  }
  return parsed;
};
