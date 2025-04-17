import Chart from "react-apexcharts";
import { useGetUsersQuery } from "@frontend/redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "@frontend/redux/api/orderApiSlice"; 
import { useState, useEffect } from "react";
import OrderList from "./OrderList";
import Loader from "@frontend/components/Loader";
import AdminMenu from "./AdminMenu";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        background: "#fff",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          },
        },
      },
      tooltip: {
        theme: "light",
        style: {
          fontSize: '12px',
        }
      },
      colors: ["#3B82F6"],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return "$" + val;
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: {
          fontSize: '16px',
          fontWeight: 600,
          color: '#1F2937'
        }
      },
      grid: {
        borderColor: "#E5E7EB",
        row: {
          colors: ["#F9FAFB", "transparent"],
          opacity: 0.5
        },
      },
      markers: {
        size: 4,
        colors: ["#3B82F6"],
        strokeColors: "#fff",
        strokeWidth: 2,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
          style: {
            fontSize: '14px',
            color: '#4B5563'
          }
        },
        labels: {
          style: {
            colors: '#6B7280'
          }
        }
      },
      yaxis: {
        title: {
          text: "Sales ($)",
          style: {
            fontSize: '14px',
            color: '#4B5563'
          }
        },
        min: 0,
        labels: {
          style: {
            colors: '#6B7280'
          },
          formatter: function (val) {
            return "$" + val;
          }
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail && Array.isArray(salesDetail)) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id || '',
        y: item.totalSales || 0,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
            <AdminMenu />

          {/* Main Content */}
          <div className="flex-1 mt-[-40px]">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sales Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Total Sales</span>
                  </div>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {isLoading ? <Loader /> : `$${sales?.totalSales?.toFixed(2) || '0.00'}`}
                    </h3>
                  </div>
                </div>

                {/* Customers Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Total Customers</span>
                  </div>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {loading ? <Loader /> : customers?.length || 0}
                    </h3>
                  </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 rounded-full p-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-500">Total Orders</span>
                  </div>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {loadingTwo ? <Loader /> : orders?.totalOrders || 0}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Sales Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <Chart
                  options={state.options}
                  series={state.series}
                  type="line"
                  height={350}
                  width="100%"
                />
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                </div>
                <OrderList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;