import { Platform } from 'react-native';

export const Fonts = {
  JUA: 'JUA',
  Pretendard: Platform.select({
    ios: 'PretendardVariable-Regular',
    android: 'PretendardVariable',
    default: 'Pretendard Variable',
  }),
  Roboto_VariableFont: 'Roboto-VariableFont',
  GowunDodum: 'GowunDodum',
};
