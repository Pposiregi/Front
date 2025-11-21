import { ImageSourcePropType } from 'react-native';

import IconHandActive from './images/Icon_colored/fp_hand.png';
import IconHandInactive from './images/Icon_uncolored/fp_hand.png';
import IconCarrotActive from './images/Icon_colored/fp_carrot.png';
import IconCarrotInactive from './images/Icon_uncolored/fp_carrot.png';
import IconHomeActive from './images/Icon_colored/fb_home.png';
import IconHomeInactive from './images/Icon_uncolored/fb_home.png';
import IconHumanActive from './images/Icon_colored/fp_human.png';
import IconHumanInactive from './images/Icon_uncolored/fp_human.png';
import IconDogActive from './images/Icon_colored/fp_dog.png';
import IconDogInactive from './images/Icon_uncolored/fp_dog.png';

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
    focused: IconHumanActive,
    unfocused: IconHumanInactive,
  },
  Profile: {
    focused: IconHandActive,
    unfocused: IconHandInactive,
  },
};

export type TabIconKey = keyof typeof tabIcons;
