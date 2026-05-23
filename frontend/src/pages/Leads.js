import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const Leads = () => {
  const { token } = useAuth();

  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editLead, setEditLead] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New'
  });

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await axios.get(
      'http://localhost:5000/api/leads',
      config
    );

    setLeads(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editLead) {
      await axios.put(
        `http://localhost:5000/api/leads/${editLead._id}`,
        form,
        config
      );
    } else {
      await axios.post(
        'http://localhost:5000/api/leads',
        form,
        config
      );
    }

    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'New'
    });

    setShowForm(false);
    setEditLead(null);

    fetchLeads();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this client?')) {
      await axios.delete(
        `http://localhost:5000/api/leads/${id}`,
        config
      );

      fetchLeads();
    }
  };

  const handleEdit = (lead) => {
    setEditLead(lead);

    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status
    });

    setShowForm(true);
  };

  const statusColors = {
    New: 'bg-blue-500',
    Contacted: 'bg-yellow-500',
    'Follow-up': 'bg-orange-500',
    Converted: 'bg-green-500',
    Rejected: 'bg-red-500'
  };

  const filteredLeads = leads
    .filter(
      (l) => filterStatus === 'All' || l.status === filterStatus
    )
    .filter(
      (l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.company.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">
          Industrial Clients
        </h1>

        <button
          onClick={() => {
            setShowForm(true);
            setEditLead(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Client
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search industrial clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg flex-1 border border-slate-700"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700"
        >
          <option>All</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Follow-up</option>
          <option>Converted</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-slate-800 p-6 rounded-xl mb-6 border border-slate-700">
          <h2 className="text-white font-semibold mb-4">
            {editLead ? 'Edit Client' : 'Add New Client'}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-4"
          >
            <input
              placeholder="Client Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
              className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              required
            />

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
              className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              required
            />

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value
                })
              }
              className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              required
            />

            <input
              placeholder="Manufacturing Company"
              value={form.company}
              onChange={(e) =>
                setForm({
                  ...form,
                  company: e.target.value
                })
              }
              className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              required
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value
                })
              }
              className="bg-slate-700 text-white px-4 py-2 rounded-lg"
            >
              <option>New</option>
              <option>Contacted</option>
              <option>Follow-up</option>
              <option>Converted</option>
              <option>Rejected</option>
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {editLead ? 'Update Client' : 'Add Client'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditLead(null);
                }}
                className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="text-left text-slate-300 px-6 py-4">
                Client Name
              </th>

              <th className="text-left text-slate-300 px-6 py-4">
                Manufacturing Company
              </th>

              <th className="text-left text-slate-300 px-6 py-4">
                Phone
              </th>

              <th className="text-left text-slate-300 px-6 py-4">
                Client Status
              </th>

              <th className="text-left text-slate-300 px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr
                key={lead._id}
                className="border-t border-slate-700 hover:bg-slate-750"
              >
                <td className="px-6 py-4">
                  <p className="text-white font-medium">
                    {lead.name}
                  </p>

                  <p className="text-slate-400 text-sm">
                    {lead.email}
                  </p>
                </td>

                <td className="px-6 py-4 text-slate-300">
                  {lead.company}
                </td>

                <td className="px-6 py-4 text-slate-300">
                  {lead.phone}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`${statusColors[lead.status]} text-white text-xs px-3 py-1 rounded-full`}
                  >
                    {lead.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEdit(lead)}
                    className="text-blue-400 hover:text-blue-300 mr-3"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(lead._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLeads.length === 0 && (
          <p className="text-slate-400 text-center py-8">
            No industrial clients found
          </p>
        )}
      </div>
    </div>
  );
};

export default Leads;