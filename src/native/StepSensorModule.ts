import { NativeModules, NativeEventEmitter } from 'react-native';

const { StepSensorModule } = NativeModules;
export const stepSensorEmitter = new NativeEventEmitter(StepSensorModule);

export default StepSensorModule as {
  startListening: () => void;
  stopListening: () => void;
};
