import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './AnalyticsFilter.css';

// Standalone page: filter by From/To dates and visualize results in an area chart
// This component is self-contained and does not modify other files
export const AnalyticsFilter = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const categories = ['Temperature', 'Salinity', 'Currents', 'Waves', 'Tides'];
  const [selectedCategories, setSelectedCategories] = useState(new Set(categories));
  const allChecked = selectedCategories.size === categories.length;

  // Demo dataset: daily message counts over a month
  const dataset = useMemo(() => {
    const base = new Date();
    const days = 30;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const category = categories[i % categories.length];
      let value = 0;
      switch (category) {
        case 'Temperature':
          value = Math.round(18 + 6 * Math.sin(i / 5) + (Math.random() * 2 - 1)); // °C
          break;
        case 'Salinity':
          value = Math.round(34 + 2 * Math.sin(i / 6) + (Math.random() * 1 - 0.5)); // PSU
          break;
        case 'Currents':
          value = Math.max(0, Math.round(60 + 30 * Math.sin(i / 3) + (Math.random() * 20 - 10))); // cm/s
          break;
        case 'Waves':
          value = Math.max(0, Math.round(2 + 1.2 * Math.sin(i / 4) + (Math.random() * 0.8 - 0.4)) * 10) / 10; // m
          break;
        case 'Tides':
          value = Math.round((1 + 0.8 * Math.sin(i / 2) + (Math.random() * 0.2 - 0.1)) * 10) / 10; // m
          break;
        default:
          value = Math.round(10 + 5 * Math.sin(i / 4));
      }
      data.push({ date: iso, value, category });
    }
    return data;
  }, []);

  const filtered = useMemo(() => {
    return dataset.filter((row) => {
      const t = row.date;
      if (fromDate && t < fromDate) return false;
      if (toDate && t > toDate) return false;
      if (!selectedCategories.has(row.category)) return false;
      return true;
    });
  }, [dataset, fromDate, toDate, selectedCategories]);

  const totalValue = useMemo(() => filtered.reduce((sum, r) => sum + Number(r.value || 0), 0), [filtered]);

  return (
    <div className="analytics-page">
      <div className="analytics-card">
        <div className="analytics-header">
          <h2>Oceanic Analytics</h2>
          <p>Filter ocean data by date and category, view trends over time</p>
        </div>

        <div className="filters">
          <div className="filter">
            <label>From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate || undefined}
            />
          </div>
          <div className="filter">
            <label>To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate || undefined}
            />
          </div>
          <div className="categories">
            {(() => {
              const id = 'cat-all';
              return (
                <label key="all" htmlFor={id} className={`chip ${allChecked ? 'checked' : ''}`}>
                  <input
                    id={id}
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories(new Set(categories));
                      } else {
                        setSelectedCategories(new Set());
                      }
                    }}
                  />
                  <span>All</span>
                </label>
              );
            })()}
            {categories.map((c) => {
              const id = `cat-${c.toLowerCase()}`;
              const checked = selectedCategories.has(c);
              return (
                <label key={c} htmlFor={id} className={`chip ${checked ? 'checked' : ''}`}>
                  <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      setSelectedCategories((prev) => {
                        const next = new Set(prev);
                        if (e.target.checked) next.add(c); else next.delete(c);
                        return next;
                      });
                    }}
                  />
                  <span>{c}</span>
                </label>
              );
            })}
          </div>
          <div className="summary">
            <div className="summary-item">
              <div className="summary-label">Days</div>
              <div className="summary-value">{filtered.length}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total value</div>
              <div className="summary-value">{totalValue}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Avg/day</div>
              <div className="summary-value">{filtered.length ? Math.round(totalValue / filtered.length) : 0}</div>
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={filtered} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8 }} />
              <Area type="monotone" dataKey="value" stroke="#0EA5E9" fill="#E0F2FE" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={`${row.date}-${row.category}`}>
                  <td>{row.date}</td>
                  <td>{row.category}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="empty">
                    No data for the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


