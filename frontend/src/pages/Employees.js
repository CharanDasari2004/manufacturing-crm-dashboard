import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const SalesExecutives = () => {
  const { token, user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    target: 10
  });

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get(
      'http://localhost:5000/api/employees',
      config
    );
    setEmployees(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      'http://localhost:5000/api/employees',
      form,
      config
    );

    setForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      department: '',
      target: 10
    });

    setShowForm(false);
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this sales executive?')) {
      await axios.delete(
        `http://localhost:5000/api/employees/${id}`,
        config
      );

      fetchEmployees();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Sales Executives
        </h1>

        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Sales Executive
          </button>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-slate-800 p-6 rounded-xl mb-6 border border-slate-700">
          <h2 className="text-white font-semibold mb-4">
            Add New Sales Executive
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-4"
          >
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              required
            />

            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              required
            />

            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              required
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="bg-slate-700 text-white px-4 py-2 rounded-lg"
            />

            <input
              placeholder="Department"
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
              className="bg-slate-700 text-white px-4 py-2 rounded-lg"
            />

            <input
              placeholder="Monthly Sales Target"
              type="number"
              value={form.target}
              onChange={(e) =>
                setForm({ ...form, target: e.target.value })
              }
              className="bg-slate-700 text-white px-4 py-2 rounded-lg"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Executive
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-600 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sales Executives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div
            key={emp._id}
            className="bg-slate-800 p-6 rounded-xl border border-slate-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {emp.name}
                </h3>

                <p className="text-slate-400 text-sm">
                  {emp.email}
                </p>

                <p className="text-slate-400 text-sm">
                  {emp.department}
                </p>
              </div>

              {user?.role === 'admin' && (
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-slate-700 p-3 rounded-lg text-center">
                <p className="text-slate-400 text-xs">
                  Monthly Target
                </p>

                <p className="text-white font-bold">
                  {emp.target}
                </p>
              </div>

              <div className="bg-slate-700 p-3 rounded-lg text-center">
                <p className="text-slate-400 text-xs">
                  Converted Clients
                </p>

                <p className="text-green-400 font-bold">
                  {emp.leadsConverted}
                </p>
              </div>
            </div>
          </div>
        ))}

        {employees.length === 0 && (
          <p className="text-slate-400 col-span-3 text-center py-8">
            No sales executives found
          </p>
        )}
      </div>
    </div>
  );
};

export default SalesExecutives;