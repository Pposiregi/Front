import axios from "axios";
import { MainResponse } from "../types/main";

export const getMainData = async (userId: string): Promise<MainResponse> => {
    const { data } = await axios.get<MainResponse>(`/api/main?userId=${userId}`);
    return data;
};
