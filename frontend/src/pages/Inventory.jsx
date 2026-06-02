import { useEffect, useState } from "react";
import { api } from "../services/api";

const emptyMedicine = {
  name: "",
  category: "",
  quantity: "",
  expiryDate: "",
};

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState(emptyMedicine);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadInventory() {
    const data = await api.getInventory();
    setInventory(data);
  }

  useEffect(() => {
    async function loadInitialInventory() {
      try {
        const data = await api.getInventory();
        setInventory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadInitialInventory();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyMedicine);
    setEditingId(null);
  }

  async function submitMedicine(event) {
    event.preventDefault();
    setError("");

    const payload = {
      ...form,
      quantity: Number(form.quantity),
    };

    try {
      if (editingId) {
        await api.updateMedicine(editingId, payload);
      } else {
        await api.createMedicine(payload);
      }
      await loadInventory();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  }

  function editMedicine(medicine) {
    setEditingId(medicine.id);
    setForm({
      name: medicine.name,
      category: medicine.category,
      quantity: medicine.quantity,
      expiryDate: medicine.expiryDate,
    });
  }

  async function removeMedicine(id) {
    setError("");

    try {
      await api.deleteMedicine(id);
      await loadInventory();
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <section className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold leading-tight text-slate-950 lg:text-4xl">
            Inventory
          </h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            Maintain medicine stock levels, categories, and expiry dates.
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
          onSubmit={submitMedicine}
        >
          <h3 className="mb-4 text-lg font-bold text-slate-950">
            {editingId ? "Edit medicine" : "Add medicine"}
          </h3>
          <div className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-bold text-slate-700">
              Name
              <input
                className="rounded-md border border-slate-200 px-3 py-2 font-normal outline-none focus:border-emerald-600"
                name="name"
                onChange={updateField}
                required
                value={form.name}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-slate-700">
              Category
              <input
                className="rounded-md border border-slate-200 px-3 py-2 font-normal outline-none focus:border-emerald-600"
                name="category"
                onChange={updateField}
                required
                value={form.category}
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
              Expiry date
              <input
                className="rounded-md border border-slate-200 px-3 py-2 font-normal outline-none focus:border-emerald-600"
                name="expiryDate"
                onChange={updateField}
                required
                type="date"
                value={form.expiryDate}
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
            <h3 className="text-lg font-bold text-slate-950">Medicines</h3>
            <span className="text-sm text-slate-500">
              {inventory.length} records
            </span>
          </div>
          {loading ? (
            <p className="text-slate-500">Loading inventory...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-separate border-spacing-y-2 text-left">
                <thead className="text-sm text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2">Expiry</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((medicine) => (
                    <tr className="bg-slate-50" key={medicine.id}>
                      <td className="rounded-l-lg px-3 py-3 font-bold text-slate-950">
                        {medicine.name}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {medicine.category}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {medicine.quantity}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {medicine.expiryDate}
                      </td>
                      <td className="rounded-r-lg px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                            onClick={() => editMedicine(medicine)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-700"
                            onClick={() => removeMedicine(medicine.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </>
  );
}

export default Inventory;
