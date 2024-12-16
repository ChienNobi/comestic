import { apiSlice } from "../api/apiSlice";
import { API_URL } from "@/commons/constants";

export const beautyTreatmentApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        getActiveBlog: builder.query({
            query: () => `${API_URL}/blogs?status=true`,
        }),
        getBlogById: builder.query({
            query: (id) => `${API_URL}/blogs/${id}`,
        }),
    }),
});

export const { useGetActiveBlogQuery, useGetBlogByIdQuery } = beautyTreatmentApi;
