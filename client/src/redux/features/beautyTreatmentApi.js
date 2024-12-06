import { apiSlice } from "../api/apiSlice";
import { API_URL } from "@/commons/constants";

export const beautyTreatmentApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getActiveBeautyTreatments: builder.query({
            query: () => `${API_URL}/beauty-treatment?status=true`,
        }),
    }),
});

export const { useGetActiveBeautyTreatmentsQuery } = beautyTreatmentApi;
