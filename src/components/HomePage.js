import React from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MessageSquare, Activity, Calendar, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './HomePage.css';

export const HomePage = () => {
  // Sample data for charts
  const dailyData = [
    { name: 'Mon', messages: 120, users: 45 },
    { name: 'Tue', messages: 190, users: 67 },
    { name: 'Wed', messages: 280, users: 89 },
    { name: 'Thu', messages: 220, users: 78 },
    { name: 'Fri', messages: 350, users: 112 },
    { name: 'Sat', messages: 180, users: 56 },
    { name: 'Sun', messages: 240, users: 84 }
  ];

  const categoryData = [
    { name: 'Support', value: 35, color: '#6B7280' },
    { name: 'Sales', value: 25, color: '#9CA3AF' },
    { name: 'General', value: 20, color: '#D1D5DB' },
    { name: 'Technical', value: 20, color: '#E5E7EB' }
  ];

  const hourlyData = [
    { hour: '00', activity: 12 },
    { hour: '04', activity: 8 },
    { hour: '08', activity: 45 },
    { hour: '12', activity: 78 },
    { hour: '16', activity: 65 },
    { hour: '20', activity: 34 }
  ];

  const stats = [
    {
      title: 'Total Messages',
      value: '12,847',
      change: '+12.5%',
      trend: 'up',
      icon: MessageSquare
    },
    {
      title: 'Active Users',
      value: '2,341',
      change: '+8.2%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Response Time',
      value: '1.2s',
      change: '-15.3%',
      trend: 'down',
      icon: Clock
    },
    {
      title: 'Satisfaction',
      value: '94.8%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp
    }
  ];

  return (
    <div className="homepage">
      {/* Header */}
      <div className="homepage-header">
        <div className="header-content">
          <h1>FloatChat Dashboard</h1>
          <p>Welcome back! Here's what's happening with your AI assistant today.</p>
          <div className="date-info">
            <div className="today-date">
              <Calendar size={18} />
              <span className="date-label">Today:</span>
              <span className="date-value">{new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="last-updated">
              <Clock size={18} />
              <span className="date-label">Last Updated:</span>
              <span className="date-value">{new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
        </div>
        <div className="header-stats">
          <div className="live-indicator">
            <div className="pulse-dot"></div>
            <span>Live Data</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className={`stat-trend ${stat.trend}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </div>
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Main Chart */}
        <div className="chart-card main-chart">
          <div className="chart-header">
            <h3>Weekly Activity</h3>
            <p>Messages and user engagement over the past week</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="#6B7280"
                  fill="#F3F4F6"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Charts */}
        <div className="side-charts">
          {/* Category Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Query Categories</h3>
              <p>Distribution by type</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Activity */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Hourly Activity</h3>
              <p>Peak usage times</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="hour" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="activity" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

