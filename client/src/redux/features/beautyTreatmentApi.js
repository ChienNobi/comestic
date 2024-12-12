import { apiSlice } from "../api/apiSlice";
import { API_URL } from "@/commons/constants";

export const beautyTreatmentApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getActiveBeautyTreatments: builder.query({
            query: () => `${API_URL}/beauty-treatment?status=true`,
        }),
        getBeautyTreatmentById: builder.query({
            query: (id) => `${API_URL}/beauty-treatment/${id}`,
        }),
    }),
});

export const { useGetActiveBeautyTreatmentsQuery, useGetBeautyTreatmentByIdQuery } = beautyTreatmentApi;
