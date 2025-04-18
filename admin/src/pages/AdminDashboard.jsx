import Chart from "react-apexcharts";
import { useGetUsersQuery } from "@frontend/redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "@frontend/redux/api/orderApiSlice"; 
import { useState, useEffect } from "react";
import Loader from "@frontend/components/Loader";
import { formatPrice } from "@frontend/Utils/cartUtils";

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
      colors: ["#bd8837"],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return formatPrice(val);
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
          color: '#5b3f15'
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
        colors: ["#bd8837"],
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
            return formatPrice(val);
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

  const [monthlyRevenue, setMonthlyRevenue] = useState({
    options: {
      chart: {
        type: "bar",
        background: "#fff",
      },
      title: {
        text: "Monthly Revenue",
        align: "left",
        style: {
          fontSize: '16px',
          fontWeight: 600,
          color: '#5b3f15'
        }
      },
      xaxis: {
        categories: [],
        title: {
          text: "Month",
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
          text: "Revenue ($)",
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
            return formatPrice(val);
          }
        }
      },
    },
    series: [{ name: "Revenue", data: [] }],
  });

  useEffect(() => {
    if (salesDetail && Array.isArray(salesDetail)) {
      // Sort salesDetail by date
      const sortedSalesDetail = [...salesDetail].sort((a, b) => new Date(a._id) - new Date(b._id));

      const formattedSalesDate = sortedSalesDetail.map((item) => ({
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

      // Sort monthly data by month
      const monthlyData = sortedSalesDetail.reduce((acc, item) => {
        const month = new Date(item._id).toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + item.totalSales;
        return acc;
      }, {});

      const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const sortedMonthlyData = Object.keys(monthlyData).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

      setMonthlyRevenue((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: sortedMonthlyData,
          },
        },
        series: [
          { name: "Revenue", data: sortedMonthlyData.map((month) => monthlyData[month]) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl uppercase font-bold text-[#5b3f15]">Dashboard Overview</h1>
            <p className="text-gray-500 mt-2">Insights and metrics of your store</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {/* Total Sales */}
          <div className="bg-[#fff4ca] rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#facc15] rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-lg font-medium text-[#1f2937]">Total Sales</span>
            </div>
            <h3 className="text-2xl font-bold text-[#1f2937]">
              {isLoading ? <Loader /> : formatPrice(sales?.totalSales || 0)}
            </h3>
          </div>

          {/* Total Customers */}
          <div className="bg-[#ffd3d3] rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#ff4b4b] rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-lg font-medium text-[#1f2937]">Total Customers</span>
            </div>
            <h3 className="text-2xl font-bold text-[#1f2937]">
              {loading ? <Loader /> : customers?.length || 0}
            </h3>
          </div>

          {/* Total Orders */}
          <div className="bg-[#d6faed] rounded-2xl shadow-md p-5 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-[#34d399] rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-lg font-medium text-[#1f2937]">Total Orders</span>
            </div>
            <h3 className="text-2xl font-bold text-[#1f2937]">
              {loadingTwo ? <Loader /> : orders?.totalOrders || 0}
            </h3>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <Chart
            options={{
              ...state.options,
              chart: { ...state.options.chart, background: "#f9fafb" },
              colors: ["#60a5fa"],
            }}
            series={state.series}
            type="line"
            height={350}
            width="100%"
          />
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <Chart
            options={{
              ...monthlyRevenue.options,
              chart: { ...monthlyRevenue.options.chart, background: "#f9fafb" },
              colors: ["#ff9f21"],
            }}
            series={monthlyRevenue.series}
            type="bar"
            height={350}
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;