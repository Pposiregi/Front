export interface MainResponse {
    user: {
        user_id: string;
        nick_name: string;
        age: number;
        gender: string;
    };
    pet: {
        pet_id: string;
        name: string;
        pet_type: string;
        exp: number;
        level: number;
        evolution_stage: string;
        image_uri: string;
        expression: string;
    };
    daily_walk: {
        date: string;
        step: number;
        goal_step: number;
        distance_km: number;
        burn_calories: number;
    };
    ui: {
        message: string;
        pet_expression: string;
    };
}
