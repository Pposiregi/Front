import React from 'react';
import { Image, StyleSheet } from 'react-native';
import {
  PROFILE_ICONS,
  DEFAULT_PROFILE_ICON_ID,
} from '../shared/constants/profileIcons';

interface Props {
  profileImageId?: number;
}

export const ProfileAvatar = ({ profileImageId }: Props) => {
  const source =
    PROFILE_ICONS[profileImageId ?? DEFAULT_PROFILE_ICON_ID] ??
    PROFILE_ICONS[DEFAULT_PROFILE_ICON_ID];

  return (
    <Image
      source={source}
      style={{
        width: '100%',
        height: '100%',
      }}
      resizeMode='cover'
    />
  );
};
