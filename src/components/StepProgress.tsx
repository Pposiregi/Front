import React from "react";
import { View, Text } from "react-native";
import * as Progress from "react-native-progress";

type Props = { step: number; goal: number };

/***
 * StepProgress Component
 * @param step - 현재 걸음 수
 * @param goal - 목표 걸음 수   
 */
export const StepProgress = ({ step, goal }: Props) => {
    const progress = step / goal;

    return (
        <View style={{ alignItems: "center", marginVertical: 10 }}>
            <Progress.Bar progress={progress} width={200} color="#FF9900" />
            <Text>{`${step} / ${goal} 보`}</Text>
        </View>
    );
};
