const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "inventory", label: "Inventory" },
  { id: "suppliers", label: "Suppliers" },
  { id: "shipments", label: "Shipments" },
  { id: "analytics", label: "Analytics" },
];

function Navbar({ activePage, onPageChange }) {
  return (
    <nav className="sticky top-0 z-10 flex flex-col gap-5 border-b border-emerald-100 bg-white px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-12">
      <div>
        <p className="mb-1 text-xs font-bold uppercase text-slate-500">
          National medicine supply
        </p>
        <h1 className="text-2xl font-bold leading-tight text-slate-950">
          Pharma Dashboard
        </h1>
      </div>
      <div
        className="flex gap-1 overflow-x-auto rounded-lg border border-emerald-100 bg-slate-100 p-1"
        aria-label="Main sections"
      >
        {navItems.map((item) => (
          <button
            className={`min-h-10 whitespace-nowrap rounded-md px-4 text-sm font-bold transition ${
              activePage === item.id
                ? "bg-emerald-700 text-white shadow-sm"
                : "text-slate-600 hover:bg-white hover:text-slate-950"
            }`}
            key={item.id}
            onClick={() => onPageChange(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
