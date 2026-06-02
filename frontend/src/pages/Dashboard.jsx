import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const metricLabels = {
  totalMedicines: "Medicines",
  totalSuppliers: "Suppliers",
  activeShipments: "Active shipments",
  lowStockItems: "Low stock items",
};

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [lowStockRisk, setLowStockRisk] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashboardData, inventoryData, shipmentData, riskData] =
          await Promise.all([
            api.getDashboard(),
            api.getInventory(),
            api.getShipments(),
            api.getLowStockRisk(),
          ]);

        setSummary(dashboardData);
        setInventory(inventoryData);
        setShipments(shipmentData);
        setLowStockRisk(riskData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const expiringSoon = useMemo(
    () =>
      [...inventory]
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
        .slice(0, 3),
    [inventory],
  );

  if (loading) {
    return (
      <div className="rounded-lg border border-emerald-100 bg-white p-6 text-slate-500">
        Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-white p-6 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <>
      <section className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold leading-tight text-slate-950 lg:text-4xl">
            Operational overview
          </h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            Live snapshot of medicine availability, supplier coverage, shipment
            movement, and stock-risk signals from the backend.
          </p>
        </div>
      </section>

      <section className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(summary || {}).map(([key, value]) => (
          <article
            className="rounded-lg border border-emerald-100 bg-white p-5"
            key={key}
          >
            <span className="block text-sm font-bold text-slate-500">
              {metricLabels[key] || key}
            </span>
            <strong className="mt-3 block text-4xl font-bold leading-none text-emerald-700">
              {value}
            </strong>
          </article>
        ))}
      </section>

      <section className="grid items-start gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-emerald-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-950">
              Current shipments
            </h3>
            <span className="text-sm text-slate-500">
              {shipments.length} records
            </span>
          </div>
          <div className="grid gap-3">
            {shipments.map((shipment) => (
              <div
                className="flex min-h-16 items-center justify-between gap-4 rounded-lg border border-slate-100 p-3"
                key={shipment.id}
              >
                <div>
                  <strong className="text-slate-950">{shipment.product}</strong>
                  <p className="mt-1 text-slate-500">{shipment.destination}</p>
                </div>
                <span className="whitespace-nowrap rounded-full bg-blue-100 px-3 py-1.5 text-xs font-extrabold text-blue-800">
                  {shipment.status}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-emerald-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-950">Stock risk</h3>
            <span className="text-sm text-slate-500">
              {lowStockRisk.length} watched
            </span>
          </div>
          <div className="grid gap-3">
            {lowStockRisk.map((item) => (
              <div
                className="flex min-h-16 items-center justify-between gap-4 rounded-lg border border-slate-100 p-3"
                key={item.medicine}
              >
                <div>
                  <strong className="text-slate-950">{item.medicine}</strong>
                  <p className="mt-1 text-slate-500">
                    {item.currentStock} in stock, {item.predictedDemand} demand
                  </p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-extrabold ${
                    item.risk === "High"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.risk}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-emerald-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-950">
              Earliest expiry dates
            </h3>
            <span className="text-sm text-slate-500">
              {inventory.length} medicines
            </span>
          </div>
          <div className="grid gap-3">
            {expiringSoon.map((medicine) => (
              <div
                className="flex min-h-16 items-center justify-between gap-4 rounded-lg border border-slate-100 p-3"
                key={medicine.id}
              >
                <div>
                  <strong className="text-slate-950">{medicine.name}</strong>
                  <p className="mt-1 text-slate-500">{medicine.category}</p>
                </div>
                <span className="text-sm text-slate-600">
                  {medicine.expiryDate}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-emerald-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-950">Inventory mix</h3>
            <span className="text-sm text-slate-500">By category</span>
          </div>
          <div className="grid gap-3">
            {inventory.map((medicine) => (
              <div key={medicine.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <strong className="text-slate-950">{medicine.name}</strong>
                  <span className="text-sm text-slate-500">
                    {medicine.quantity} units
                  </span>
                </div>
                <progress
                  className="h-2.5 w-full accent-emerald-700"
                  max="500"
                  value={medicine.quantity}
                />
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

export default Dashboard;
