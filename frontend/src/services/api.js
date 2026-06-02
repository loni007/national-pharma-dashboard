const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export const api = {
  getDashboard: () => request("/analytics/dashboard"),
  getPredictions: () => request("/analytics/predictions"),
  getTrends: () => request("/analytics/trends"),
  getReports: () => request("/analytics/reports"),
  getLowStockRisk: () => request("/analytics/low-stock-risk"),
  getInventory: () => request("/inventory"),
  createMedicine: (medicine) =>
    request("/inventory", {
      method: "POST",
      body: JSON.stringify(medicine),
    }),
  updateMedicine: (id, medicine) =>
    request(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(medicine),
    }),
  deleteMedicine: (id) =>
    request(`/inventory/${id}`, {
      method: "DELETE",
    }),
  getSuppliers: () => request("/suppliers"),
  createSupplier: (supplier) =>
    request("/suppliers", {
      method: "POST",
      body: JSON.stringify(supplier),
    }),
  updateSupplier: (id, supplier) =>
    request(`/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(supplier),
    }),
  deleteSupplier: (id) =>
    request(`/suppliers/${id}`, {
      method: "DELETE",
    }),
  getShipments: () => request("/shipments"),
  createShipment: (shipment) =>
    request("/shipments", {
      method: "POST",
      body: JSON.stringify(shipment),
    }),
  updateShipment: (id, shipment) =>
    request(`/shipments/${id}`, {
      method: "PUT",
      body: JSON.stringify(shipment),
    }),
  deleteShipment: (id) =>
    request(`/shipments/${id}`, {
      method: "DELETE",
    }),
};

export default API_BASE_URL;
