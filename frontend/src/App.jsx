import { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Shipments from "./pages/Shipments";
import Suppliers from "./pages/Suppliers";

const pages = {
  dashboard: Dashboard,
  inventory: Inventory,
  suppliers: Suppliers,
  shipments: Shipments,
  analytics: Analytics,
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const ActivePage = useMemo(() => pages[activePage], [activePage]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar activePage={activePage} onPageChange={setActivePage} />
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-12 lg:pb-12">
        <ActivePage />
      </main>
    </div>
  );
}

export default App;
