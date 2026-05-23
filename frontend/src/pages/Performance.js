import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Performance = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [leads, setLeads] = useState([]);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await axios.get('http://localhost:5000/api/employees', config);
        const leadsRes = await axios.get('http://localhost:5000/api/leads', config);
        setEmployees(empRes.data);
        setLeads(leadsRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const chartData = employees.map(emp => ({
    name: emp.name,
    target: emp.target,
    converted: emp.leadsConverted
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Team Performance</h1>

      {/* Performance Chart */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
        <h2 className="text-white font-semibold mb-4">Target vs Achieved</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
            <Bar dataKey="target" fill="#3b82f6" name="Target" radius={[4, 4, 0, 0]} />
            <Bar dataKey="converted" fill="#22c55e" name="Converted" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="text-left text-slate-300 px-6 py-4">Employee</th>
              <th className="text-left text-slate-300 px-6 py-4">Department</th>
              <th className="text-left text-slate-300 px-6 py-4">Target</th>
              <th className="text-left text-slate-300 px-6 py-4">Converted</th>
              <th className="text-left text-slate-300 px-6 py-4">Achievement</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const percent = emp.target > 0
                ? Math.round((emp.leadsConverted / emp.target) * 100)
                : 0;
              return (
                <tr key={emp._id} className="border-t border-slate-700">
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{emp.name}</p>
                    <p className="text-slate-400 text-sm">{emp.email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{emp.department}</td>
                  <td className="px-6 py-4 text-slate-300">{emp.target}</td>
                  <td className="px-6 py-4 text-green-400 font-semibold">{emp.leadsConverted}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                      <span className="text-slate-300 text-sm">{percent}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {employees.length === 0 && (
          <p className="text-slate-400 text-center py-8">No data found</p>
        )}
      </div>
    </div>
  );
};

export default Performance;