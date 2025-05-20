"use client";
import React, { useEffect, useState } from "react";
import DashboardListCards from "@/components/Card/DashboardListCards";
import { NetRevenueChart } from "@/components/Chart/Dashboard/NetRevenueChart";
import { UserGrowthRateChart } from "@/components/Chart/Dashboard/UserGrowthRateChart";
import { DashboardTable } from "@/components/DashboardTable";
import PageTitle from "@/components/PageTitle";
import { sampleDashboardListCards } from "@/utils/sample/DashboardListCards";
import axiosInstance from "@/lib/axios";
import { DashboardData } from "@/types/dashboard.types";

const AdminDashboard = () => {
  const [date2, setDate2] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [date1, setDate1] = useState<Date | undefined>(() => {
    const date = new Date(); // Create a new Date object for the current date
    date.setMonth(date.getMonth() - 1); // Subtract one month
    return date; // Return the updated Date object
  });

  useEffect(() => {
    if (date2) {
      const newDate1 = new Date(date2);
      newDate1.setMonth(newDate1.getMonth() - 1);
      setDate1(newDate1);
    }
  }, []);

  useEffect(() => {
    if (!date1 || !date2) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/admin-chart?start_date=2023-01-01&end_date=2025-12-09&period_type=monthly&force_refresh=true`
        );
        const { EC, EM, data } = await response.data;
        if (EC === 0) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [date1, date2]);

  console.log("check date 1q foramt", date1);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ff_dri_1a431563-43e9-4195-af3b-ff897847ac31?start_date=${date1}&end_date=${date2}`
      );
      const data = await response.data;
      console.log(data);
    };
  }, []);

  return (
    <div className="fc">
      <PageTitle
        date1={date1}
        setDate1={setDate1}
        date2={date2}
        setDate2={setDate2}
        isDashboard
      />
      <DashboardListCards data={sampleDashboardListCards} />
      <div className="jb gap-4 max-lg:grid max-lg:grid-cols-1">
        <div className="card lg:flex-1 fc">
          <NetRevenueChart
            netIncomeData={dashboardData?.net_income}
            grossIncomeData={dashboardData?.gross_income}
          />
        </div>
        <div className="card lg:flex-1 fc">
          <UserGrowthRateChart
            userGrowthData={dashboardData?.user_growth_rate}
          />
        </div>
      </div>
      <div className="py-6">
        <div className="card fc gap-4">
          <h1 className="text-xl font-bold">Key Performance</h1>
          <DashboardTable
            orderStats={dashboardData?.order_stats}
            churn_rate={dashboardData?.churn_rate}
            average_delivery_time={dashboardData?.average_delivery_time}
            average_customer_satisfaction={
              dashboardData?.average_customer_satisfaction
            }
            order_cancellation_rate={dashboardData?.order_cancellation_rate}
            order_volume={dashboardData?.order_volume}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
