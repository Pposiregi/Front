declare module 'react-native-pedometer' {
  /* 새 모듈 인지하도록 */
  export type PedometerData = {
    numberOfSteps?: number;
  };

  export type AvailabilityHandler = (
    error: Error | null,
    available: boolean
  ) => void;

  const Pedometer: {
    isStepCountingAvailable(handler: AvailabilityHandler): void;
    startPedometerUpdatesFromDate(
      start: number,
      handler: (data: PedometerData) => void
    ): void;
    stopPedometerUpdates(): void;
  };

  export default Pedometer;
}
