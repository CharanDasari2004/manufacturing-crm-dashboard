import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const leadsRes = await axios.get('http://localhost:5000/api/leads', config);
        const empRes = await axios.get('http://localhost:5000/api/employees', config);
        setLeads(leadsRes.data);
        setEmployees(empRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [token]);

  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const followUpLeads = leads.filter(l => l.status === 'Follow-up').length;

  const pieData = [
    { name: 'New', value: newLeads },
    { name: 'Converted', value: convertedLeads },
    { name: 'Follow-up', value: followUpLeads },
    { name: 'Rejected', value: leads.filter(l => l.status === 'Rejected').length },
  ];

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

  const barData = [
    { name: 'Total', value: totalLeads },
    { name: 'New', value: newLeads },
    { name: 'Converted', value: convertedLeads },
    { name: 'Follow-up', value: followUpLeads },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Total Leads</p>
          <p className="text-4xl font-bold text-white mt-2">{totalLeads}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Converted</p>
          <p className="text-4xl font-bold text-green-400 mt-2">{convertedLeads}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">New Leads</p>
          <p className="text-4xl font-bold text-blue-400 mt-2">{newLeads}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm">Total Employees</p>
          <p className="text-4xl font-bold text-purple-400 mt-2">{employees.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-white font-semibold mb-4">Lead Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-white font-semibold mb-4">Lead Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;