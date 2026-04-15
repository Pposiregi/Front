import React, { useState } from 'react';
import { Image } from 'react-native';
import { DEFAULT_PROFILE_URL } from '@shared/constants/profileIcons';

interface Props {
  profileImageUrl?: string;
}

export const ProfileAvatar = ({ profileImageUrl }: Props) => {
  const [imageFailed, setImageFailed] = useState(false);
  const uri =
    !imageFailed && profileImageUrl ? profileImageUrl : DEFAULT_PROFILE_URL;

  return (
    <Image
      source={{ uri }}
      onError={() => setImageFailed(true)}
      style={{
        width: '100%',
        height: '100%',
      }}
      resizeMode='cover'
    />
  );
};
