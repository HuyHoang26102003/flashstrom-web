import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api";

export const inquiryService = {
  getAllInquiries: async (id: string) => {
    const response = await axiosInstance.get(
      `customer-care${API_ENDPOINTS.INQUIRIES}/${id}`
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

  //   updatePromotion: async (id: string, promotion: Partial<Promotion>) => {
  //     const response = await axiosInstance.put(
  //       `${API_ENDPOINTS.PROMOTIONS}/${id}`,
  //       promotion
  //     );
  //     return response.data;
  //   },
};
