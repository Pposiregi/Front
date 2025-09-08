import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useMainData } from "../../hooks/useMainData";
import { StepProgress } from "../../components/StepProgress";
import { PetAvatar } from "../../components/PetAvatar";

export const MainScreen = () => {
    const { data, loading } = useMainData("u12345");

    if (loading) return <ActivityIndicator size="large" />;

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {/* 걸음수 Progress */}
            <StepProgress step={data!.daily_walk.step} goal={data!.daily_walk.goal_step} />

            {/* 안내 메시지 */}
            <Text style={{ marginVertical: 10, fontSize: 16 }}>
                {data!.ui.message}
            </Text>

            <Text>오늘 걸음수: {data!.daily_walk.step}</Text>
            <Text>목표 걸음수: {data!.daily_walk.goal_step}</Text>
            <Text>펫 이름: {data!.pet.name}</Text>

        </View>
    );
};
