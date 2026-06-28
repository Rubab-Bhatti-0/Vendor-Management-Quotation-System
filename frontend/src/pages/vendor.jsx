import { useEffect, useState } from 'react';
import { getVendors, createVendor, updateVendor, delVendor } from '../api/vendor';
import Modal from '../components/modal';

const empty = { vendorName: '', companyName: '', email: '', contactNumber: '', businessAddress: '' };

export default function Vendor() {
  const [vendors, setVendors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(empty);
  const [error, setError]       = useState('');
  const [saving, setSaving]     = useState(false);

  const fetchVendors = (q = '') => {
    setLoading(true);
    getVendors(q)
      .then(res => setVendors(res.data.data))
      .catch(() => setError('Failed to load vendors.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVendors(); }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchVendors(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const openAdd = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (v) => { 
    setEditing(v); 
    setForm({
        vendorName: v.vendorName || v.name,
        companyName: v.companyName || v.company,
        email: v.email,
        contactNumber: v.contactNumber || v.contact,
        businessAddress: v.businessAddress || v.address
    }); 
    setShowModal(true); 
  };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.vendorName || !form.email) return setError('Name and email are required.');
    setSaving(true);
    try {
      if (editing) {
        await updateVendor(editing._id, form);
      } else {
        await createVendor(form);
      }
      closeModal();
      fetchVendors(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vendor?')) return;
    try {
        await delVendor(id);
        fetchVendors(search);
    } catch (err) {
        setError('Failed to delete vendor.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vendors</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your vendor directory</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          + Add Vendor
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search vendors by name, company or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            {['Vendor Details', 'Company', 'Contact Info', 'Address', 'Actions'].map(h => (
                                <th key={h} className="text-left px-6 py-4 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {vendors.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No vendors found.</td></tr>
                        ) : (
                            vendors.map(v => (
                                <tr key={v._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800">{v.vendorName || v.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{v.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 font-medium">{v.companyName || v.company}</td>
                                    <td className="px-6 py-4 text-gray-600">{v.contactNumber || v.contact || '—'}</td>
                                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{v.businessAddress || v.address || '—'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => openEdit(v)} className="text-indigo-600 hover:text-indigo-800 transition-colors">Edit</button>
                                            <button onClick={() => handleDelete(v._id)} className="text-red-600 hover:text-red-800 transition-colors">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Vendor' : 'Add New Vendor'} onClose={closeModal}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                        <input type="text" name="vendorName" value={form.vendorName} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input type="text" name="companyName" value={form.companyName} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                    <textarea name="businessAddress" value={form.businessAddress} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-20" />
                </div>
                <div className="pt-4 flex gap-3">
                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                    <button type="submit" disabled={saving} className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Save Vendor'}</button>
                </div>
            </form>
        </Modal>
      )}
    </div>
  );
}
