import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/constants/api';

// Define Restaurant interface
export interface Restaurant {
    id: string;
    name: string;
    address: string;
    cuisine: string;
    rating?: number;
    isActive: boolean;
}

export const restaurantService = {
    getAllRestaurants: async () => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.RESTAURANTS}`);
        return response.data;
    },

    createRestaurant: async () => {
        const response = await axiosInstance.post(`/companion-admin${API_ENDPOINTS.RESTAURANTS}`);
        return response.data;
    },

    updateRestaurant: async (id: string, restaurant: Partial<Restaurant>) => {
        const response = await axiosInstance.put(`${API_ENDPOINTS.RESTAURANTS}/${id}`, restaurant);
        return response.data;
    },

    deleteRestaurant: async (id: string) => {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.RESTAURANTS}/${id}`);
        return response.data;
    },

    toggleRestaurantStatus: async (id: string, isActive: boolean) => {
        const response = await axiosInstance.patch(`${API_ENDPOINTS.RESTAURANTS}/${id}/status`, { isActive });
        return response.data;
    }
}; 