import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import api from "../utils/api.js";

const Report = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  // redirect if not admin
  if (!user || !user.isAdmin) {
    navigate("/");
    return null;
  }

  // Fetch order report
  const generateReport = async () => {
    try {
      setLoading(true);

      // build query for optional date range
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get("/reports/orders", { params });
      setReport(response.data);
    } catch (error) {
      console.error("Error generating report", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Orders Report</h1>
        <button
          className="btn btn-outline rounded-md"
          onClick={() => navigate("/admin")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Date filter */}
      <div className="card bg-base-100 border border-base-300 shadow-sm p-6 mb-8">
        <h2 className="font-medium mb-4">Filter by Date Range (optional)</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              className="input input-bordered w-full rounded-md"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm font-medium ">End Date</label>
            <input
              type="date"
              className="input input-bordered w-full rounded-md"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Generate report */}
          <button
            className="btn btn-primary rounded-md"
            onClick={generateReport}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Generate Report"
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {report && (
        <div>
          <div className="card bg-base-100 border border-base-300 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">{report.title}</h2>
            <p className="text-sm text-base-content/70">
              Generated at: {report.generatedAt}
            </p>
            <div className="flex gap-8 mt-4">
              <div>
                <p className="text-sm text-base-content/70">Total Orders</p>
                <p className="text-2xl font-bold">{report.totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Total Revenue</p>
                <p className="text-2xl font-bold">${report.totalRevenue}</p>
              </div>
            </div>
          </div>
          {/* Orders table */}
          {report.orders.length === 0 ? (
            <p className="text-center text-base-content/70 py-12">
              No orders found for this date range.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-base-300">
              <table className="table w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {report.orders.map((order) => (
                    <tr key={order.orderId} className="hover">
                      <td>#{order.orderId}</td>
                      <td>{order.customerEmail}</td>
                      <td>
                        {/* List all items in the order */}
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.productName} x{item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="font-medium">${order.total.toFixed(2)}</td>
                      <td className="text-sm text-base-content/70">
                        {order.orderDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Report;
