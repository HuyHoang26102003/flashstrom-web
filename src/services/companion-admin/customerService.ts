import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api";

// Define CustomerCare interface
export interface CustomerCare {
  id: string;
  first_name: string;
  last_name: string;
  active_points: number;
  avatar: {
    url: string;
    key: string;
  };
  is_assigned: boolean;
  available_for_work: boolean;
  address: string;
  contact_email: {
    email: string;
  }[];
}

export const customerService = {
  getAllCustomers: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CUSTOMERS);
      // API might return { data: [customers] } or just [customers]
      const data = response.data;
      return data;
    } catch (error: any) {
      console.error("Error fetching customers:", error.message);
      return [];
    }
  },
  createCustomer: async () => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CUSTOMERS, {
        /* customer data */
      });
      return response.data;
    } catch (error: any) {
      console.error("Error creating customer:", error.message);
      return null;
    }
  },
  updateCustomerStatus: async (customerId: string, newStatus: boolean) => {
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.CUSTOMERS}/${customerId}/status`,
        { isActive: newStatus }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating customer status:", error.message);
      return null;
    }
  },
  getCustomerOrders: async (customerId: string) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.CUSTOMERS}${API_ENDPOINTS.ORDERS}/${customerId}`
      );
      // API might return { data: [customers] } or just [customers]
      const data = response.data;
      return data;
    } catch (error: any) {
      console.error("Error fetching customers:", error.message);
      return [];
    }
  },
};

// interface ApiResponse<T> {
//   EC: number;
//   EM: string;
//   data: T;
// }
