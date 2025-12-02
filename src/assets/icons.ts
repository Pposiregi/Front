import { ImageSourcePropType } from 'react-native';

import IconHandInactive from './images/Icon_uncolored/fp_hand.png';
import IconCarrotActive from './images/Icon_colored/fp_carrot.png';
import IconCarrotInactive from './images/Icon_uncolored/fp_carrot.png';
import IconHomeActive from './images/Icon_colored/fb_home.png';
import IconHomeInactive from './images/Icon_uncolored/fb_home.png';
import IconHumanActive from './images/Icon_colored/fp_human.png';
import IconDogActive from './images/Icon_colored/fp_dog.png';
import IconDogInactive from './images/Icon_uncolored/fp_dog.png';
import IconMedalActive from './images/Icon_colored/fp_medal.png';
import IconMedalInactive from './images/Icon_uncolored/fp_medal.png';

export const tabIcons: Record<
  'Activity' | 'Meal' | 'Main' | 'Achievement' | 'Profile',
  { focused: ImageSourcePropType; unfocused: ImageSourcePropType }
> = {
  Activity: {
    focused: IconDogActive,
    unfocused: IconDogInactive,
  },
  Meal: {
    focused: IconCarrotActive,
    unfocused: IconCarrotInactive,
  },
  Main: {
    focused: IconHomeActive,
    unfocused: IconHomeInactive,
  },
  Achievement: {
    focused: IconMedalActive,
    unfocused: IconMedalInactive,
  },
  Profile: {
    focused: IconHumanActive,
    unfocused: IconHandInactive,
  },
};

export type TabIconKey = keyof typeof tabIcons;
