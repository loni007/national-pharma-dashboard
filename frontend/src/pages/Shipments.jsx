import { useEffect, useState } from "react";
import { api } from "../services/api";

const emptyShipment = {
  supplierId: "",
  product: "",
  quantity: "",
  status: "Pending",
  destination: "",
};

const statuses = ["Pending", "In Transit", "Delivered", "Delayed"];

function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(emptyShipment);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadShipments() {
    const [shipmentData, supplierData] = await Promise.all([
      api.getShipments(),
      api.getSuppliers(),
    ]);

    setShipments(shipmentData);
    setSuppliers(supplierData);
  }

  useEffect(() => {
    async function loadInitialShipments() {
      try {
        const [shipmentData, supplierData] = await Promise.all([
          api.getShipments(),
          api.getSuppliers(),
        ]);

        setShipments(shipmentData);
        setSuppliers(supplierData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadInitialShipments();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyShipment);
    setEditingId(null);
  }

  async function submitShipment(event) {
    event.preventDefault();
    setError("");

    const payload = {
      ...form,
      supplierId: Number(form.supplierId),
      quantity: Number(form.quantity),
    };

    try {
      if (editingId) {
        await api.updateShipment(editingId, payload);
      } else {
        await api.createShipment(payload);
      }
      await loadShipments();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  }

  function editShipment(shipment) {
    setEditingId(shipment.id);
    setForm({
      supplierId: shipment.supplierId,
      product: shipment.product,
      quantity: shipment.quantity,
      status: shipment.status,
      destination: shipment.destination,
    });
  }

  async function removeShipment(id) {
    setError("");

    try {
      await api.deleteShipment(id);
      await loadShipments();
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function supplierName(id) {
    return (
      suppliers.find((supplier) => supplier.id === Number(id))?.name ||
      `Supplier #${id}`
    );
  }

  return (
    <>
      <section className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold leading-tight text-slate-950 lg:text-4xl">
            Shipments
          </h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            Track incoming stock movement from suppliers to national warehouse
            destinations.
          </p>
        </div>
      </section>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-white p-4 text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <form
          className="rounded-lg border border-emerald-100 bg-white p-5"
          onSubmit={submitShipment}
        >
          <h3 className="mb-4 text-lg font-bold text-slate-950">
            {editingId ? "Edit shipment" : "Add shipment"}
          </h3>
          <div className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-bold text-slate-700">
              Supplier
              <select
                className="rounded-md border border-slate-200 px-3 py-2 font-normal outline-none focus:border-emerald-600"
                name="supplierId"
                onChange={updateField}
                required
                value={form.supplierId}
              >
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-slate-700">
              Product
              <input
                className="rounded-md border border-slate-200 px-3 py-2 font-normal outline-none focus:border-emerald-600"
                name="product"
                onChange={updateField}
                required
                value={form.product}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-slate-700">
              Quantity
              <input
                className="rounded-md border border-slate-200 px-3 py-2 font-normal outline-none focus:border-emerald-600"
                min="0"
                name="quantity"
                onChange={updateField}
                required
                type="number"
                value={form.quantity}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-slate-700">
              Status
              <select
                className="rounded-md border border-slate-200 px-3 py-2 font-normal outline-none focus:border-emerald-600"
                name="status"
                onChange={updateField}
                value={form.status}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-slate-700">
              Destination
              <input
                className="rounded-md border border-slate-200 px-3 py-2 font-normal outline-none focus:border-emerald-600"
                name="destination"
                onChange={updateField}
                required
                value={form.destination}
              />
            </label>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              className="rounded-md bg-emerald-700 px-4 py-2 font-bold text-white hover:bg-emerald-800"
              type="submit"
            >
              {editingId ? "Save" : "Add"}
            </button>
            {editingId && (
              <button
                className="rounded-md border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50"
                onClick={resetForm}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <article className="rounded-lg border border-emerald-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-950">
              Shipment queue
            </h3>
            <span className="text-sm text-slate-500">
              {shipments.length} records
            </span>
          </div>
          {loading ? (
            <p className="text-slate-500">Loading shipments...</p>
          ) : (
            <div className="grid gap-3">
              {shipments.map((shipment) => (
                <div
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                  key={shipment.id}
                >
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-slate-950">
                          {shipment.product}
                        </strong>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold text-blue-800">
                          {shipment.status}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-500">
                        {supplierName(shipment.supplierId)} to{" "}
                        {shipment.destination}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {shipment.quantity} units
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                        onClick={() => editShipment(shipment)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-700"
                        onClick={() => removeShipment(shipment.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </>
  );
}

export default Shipments;
