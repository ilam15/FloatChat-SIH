import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './AnalyticsFilter.css';

// Standalone page: filter by From/To dates and visualize results in an area chart
// This component is self-contained and does not modify other files
export const AnalyticsFilter = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const categories = ['Temperature', 'Salinity', 'Currents', 'Waves', 'Tides'];
  const [selectedCategories, setSelectedCategories] = useState(new Set(categories));
  const [groupByCategory, setGroupByCategory] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc' 
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
    const base = dataset.filter((row) => {
      const t = row.date;
      if (fromDate && t < fromDate) return false;
      if (toDate && t > toDate) return false;
      if (!selectedCategories.has(row.category)) return false;
      return true;
    });
    const sorted = [...base].sort((a, b) =>
      sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
    );
    return sorted;
  }, [dataset, fromDate, toDate, selectedCategories, sortOrder]);

  // Aggregate data for charting: either by total per day or by category per day
  const chartData = useMemo(() => {
    const map = new Map(); // date -> { date, total, [category]: value }
    for (const row of filtered) {
      if (!map.has(row.date)) {
        map.set(row.date, { date: row.date, total: 0 });
      }
      const entry = map.get(row.date);
      entry.total += Number(row.value || 0);
      entry[row.category] = (entry[row.category] || 0) + Number(row.value || 0);
    }
    // Ensure every selected category exists on every date with default 0 so stacked areas render
    const selectedList = categories.filter((c) => selectedCategories.has(c));
    for (const entry of map.values()) {
      for (const c of selectedList) {
        if (entry[c] == null) entry[c] = 0;
      }
    }
    const arr = Array.from(map.values()).sort((a, b) =>
      sortOrder === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
    );
    return arr;
  }, [filtered, sortOrder, categories, selectedCategories]);

  const totalValue = useMemo(() => filtered.reduce((sum, r) => sum + Number(r.value || 0), 0), [filtered]);

  const numberFormatter = (n) => {
    if (n == null || Number.isNaN(n)) return '0';
    return Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);
  };

  const COLORS = {
    Temperature: '#ef4444',
    Salinity: '#10b981',
    Currents: '#8b5cf6',
    Waves: '#0ea5e9',
    Tides: '#f59e0b',
  };

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
          <div className="filter">
            <label>View</label>
            <div className="toggle-row" role="group" aria-label="View mode">
              <button
                type="button"
                className={`btn ${!groupByCategory ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setGroupByCategory(false)}
              >
                Total
              </button>
              <button
                type="button"
                className={`btn ${groupByCategory ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setGroupByCategory(true)}
              >
                By category
              </button>
            </div>
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
          <div className="actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setFromDate('');
                setToDate('');
                setSelectedCategories(new Set(categories));
                setGroupByCategory(false);
                setSortOrder('asc');
              }}
            >
              Reset
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSortOrder((s) => (s === 'asc' ? 'desc' : 'asc'))}
              aria-label="Toggle sort order"
            >
              Sort: {sortOrder === 'asc' ? 'Oldest → Newest' : 'Newest → Oldest'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                const header = ['Date', 'Category', 'Value'];
                const rows = filtered.map((r) => [r.date, r.category, r.value]);
                const csv = [header, ...rows].map((arr) => arr.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'analytics.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </button>
          </div>
          <div className="summary">
            <div className="summary-item">
              <div className="summary-label">Days</div>
              <div className="summary-value">{filtered.length}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Total value</div>
              <div className="summary-value">{numberFormatter(totalValue)}</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Avg/day</div>
              <div className="summary-value">{filtered.length ? numberFormatter(totalValue / filtered.length) : 0}</div>
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                formatter={(value, name) => [numberFormatter(value), name === 'total' ? 'Total' : name]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 8 }}
              />
              {groupByCategory ? (
                <>
                  {categories.filter((c) => selectedCategories.has(c)).map((c) => (
                    <Area key={c} type="monotone" dataKey={c} stackId="1" stroke={COLORS[c]} fill={COLORS[c] + '33'} strokeWidth={2} />
                  ))}
                  <Legend />
                </>
              ) : (
                <Area type="monotone" dataKey="total" stroke="#0EA5E9" fill="#E0F2FE" strokeWidth={2} />
              )}
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
                  <td>{numberFormatter(row.value)}</td>
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


