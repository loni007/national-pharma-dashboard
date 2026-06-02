import { useEffect, useState } from "react";
import { api } from "../services/api";

function Analytics() {
  const [predictions, setPredictions] = useState([]);
  const [trends, setTrends] = useState([]);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [predictionData, trendData, reportData] = await Promise.all([
          api.getPredictions(),
          api.getTrends(),
          api.getReports(),
        ]);

        setPredictions(predictionData);
        setTrends(trendData);
        setReport(reportData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-emerald-100 bg-white p-6 text-slate-500">
        Loading analytics...
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
            Demand analytics
          </h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            Forecasts, demand trends, and reporting signals prepared by the
            backend analytics services.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-emerald-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-950">
              Demand predictions
            </h3>
            <span className="text-sm text-slate-500">Next month</span>
          </div>
          <div className="grid gap-3">
            {predictions.map((item) => (
              <div
                className="flex min-h-16 items-center justify-between gap-4 rounded-lg border border-slate-100 p-3"
                key={item.medicine}
              >
                <div>
                  <strong className="text-slate-950">{item.medicine}</strong>
                  <p className="mt-1 text-slate-500">
                    {item.predictedDemandNextMonth} units expected
                  </p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-extrabold ${
                    item.riskLevel === "High"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {item.riskLevel}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-emerald-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-950">Monthly report</h3>
          </div>
          <h4 className="mb-2 font-bold text-slate-950">
            {report?.reportTitle}
          </h4>
          <p className="text-slate-600">{report?.summary}</p>
        </article>
      </section>

      <section className="mt-4 rounded-lg border border-emerald-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-950">
            Demand trend graphs
          </h3>
          <span className="text-sm text-slate-500">Last 4 months</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {trends.map((trend) => {
            const maxDemand = Math.max(...trend.monthlyDemand);

            return (
              <div
                className="rounded-lg border border-slate-100 p-4"
                key={trend.medicine}
              >
                <h4 className="mb-2 font-bold text-slate-950">
                  {trend.medicine}
                </h4>
                <div
                  className="grid min-h-44 grid-cols-4 items-end gap-3"
                  aria-label={`${trend.medicine} demand`}
                >
                  {trend.monthlyDemand.map((value, index) => (
                    <div
                      className="flex flex-col items-center justify-end gap-1.5"
                      key={`${trend.medicine}-${value}`}
                    >
                      <span className="text-xs font-bold text-slate-600">
                        {value}
                      </span>
                      <div
                        className="w-full rounded-t-md rounded-b-sm bg-sky-600"
                        style={{ height: `${Math.max((value / maxDemand) * 120, 12)}px` }}
                      />
                      <small className="text-slate-500">M{index + 1}</small>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default Analytics;
