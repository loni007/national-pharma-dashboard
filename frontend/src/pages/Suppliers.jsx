import { useEffect, useState } from "react";
import { api } from "../services/api";

const emptySupplier = {
  name: "",
  contactEmail: "",
  phone: "",
  country: "",
};

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(emptySupplier);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadSuppliers() {
    const data = await api.getSuppliers();
    setSuppliers(data);
  }

  useEffect(() => {
    async function loadInitialSuppliers() {
      try {
        const data = await api.getSuppliers();
        setSuppliers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadInitialSuppliers();
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptySupplier);
    setEditingId(null);
  }

  async function submitSupplier(event) {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        await api.updateSupplier(editingId, form);
      } else {
        await api.createSupplier(form);
      }
      await loadSuppliers();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  }

  function editSupplier(supplier) {
    setEditingId(supplier.id);
    setForm({
      name: supplier.name,
      contactEmail: supplier.contactEmail,
      phone: supplier.phone,
      country: supplier.country,
    });
  }

  async function removeSupplier(id) {
    setError("");

    try {
      await api.deleteSupplier(id);
      await loadSuppliers();
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
            Suppliers
          </h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            Manage supplier contacts used by shipment and procurement teams.
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
          onSubmit={submitSupplier}
        >
          <h3 className="mb-4 text-lg font-bold text-slate-950">
            {editingId ? "Edit supplier" : "Add supplier"}
          </h3>
          <div className="grid gap-4">
            {[
              ["name", "Name", "text"],
              ["contactEmail", "Contact email", "email"],
              ["phone", "Phone", "tel"],
              ["country", "Country", "text"],
            ].map(([name, label, type]) => (
              <label
                className="grid gap-1.5 text-sm font-bold text-slate-700"
                key={name}
              >
                {label}
                <input
                  className="rounded-md border border-slate-200 px-3 py-2 font-normal outline-none focus:border-emerald-600"
                  name={name}
                  onChange={updateField}
                  required
                  type={type}
                  value={form[name]}
                />
              </label>
            ))}
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
              Supplier directory
            </h3>
            <span className="text-sm text-slate-500">
              {suppliers.length} records
            </span>
          </div>
          {loading ? (
            <p className="text-slate-500">Loading suppliers...</p>
          ) : (
            <div className="grid gap-3">
              {suppliers.map((supplier) => (
                <div
                  className="flex flex-col gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 xl:flex-row xl:items-center xl:justify-between"
                  key={supplier.id}
                >
                  <div>
                    <strong className="text-slate-950">{supplier.name}</strong>
                    <p className="mt-1 text-slate-500">
                      {supplier.contactEmail} · {supplier.phone}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {supplier.country}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      onClick={() => editSupplier(supplier)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-red-700"
                      onClick={() => removeSupplier(supplier.id)}
                      type="button"
                    >
                      Delete
                    </button>
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

export default Suppliers;
