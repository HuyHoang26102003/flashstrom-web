import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api";

export const inquiryService = {
  getAllInquiries: async (id: string) => {
    const response = await axiosInstance.get(
      `customer-care${API_ENDPOINTS.INQUIRIES}/${id}`
    );
    return response.data;
  },
  getAllEscalatedInquiries: async () => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.CUSTOMER_CARE_INQUIRIES}/escalated`
    );
    return response.data;
  },

  //   createPromotion: async (promotion: Omit<Promotion, "id">) => {
  //     const response = await axiosInstance.post(
  //       `customer-care${API_ENDPOINTS.PROMOTIONS}`,
  //       promotion
  //     );
  //     return response.data;
  //   },

  updateInquiry: async (id: string, reqBody: Partial<any>) => {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.CUSTOMER_CARE_INQUIRIES}/${id}`,
      reqBody
    );
    return response.data;
  },
};
