import { useEffect, useState } from 'react';
import { getVendors, createVendor, updateVendor, delVendor } from '../api/vendor';
import Modal from '../components/modal';

const empty = { vendorName: '', companyName: '', email: '', contactNumber: '', businessAddress: '' };

export default function Vendors() {
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
  const openEdit = (v) => { setEditing(v); setForm(v); setShowModal(true); };
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
    await deleteVendor(id);
    fetchVendors(search);
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

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, company or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🏢</p>
            <p>No vendors found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Vendor Name','Company','Email','Contact','Address','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendors.map(v => (
                <tr key={v._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{v.vendorName}</td>
                  <td className="px-4 py-3 text-gray-600">{v.companyName}</td>
                  <td className="px-4 py-3 text-gray-600">{v.email}</td>
                  <td className="px-4 py-3 text-gray-600">{v.contactNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{v.businessAddress}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(v)}
                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v._id)}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={editing ? 'Edit Vendor' : 'Add Vendor'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            {[
              { name: 'vendorName',       label: 'Vendor Name',     required: true  },
              { name: 'companyName',      label: 'Company Name',    required: false },
              { name: 'email',            label: 'Email',           required: true  },
              { name: 'contactNumber',    label: 'Contact Number',  required: false },
              { name: 'businessAddress',  label: 'Business Address',required: false },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
                </label>
                <input
                  name={field.name}
                  value={form[field.name] || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-medium transition-colors"
              >
                {saving ? 'Saving...' : editing ? 'Update Vendor' : 'Add Vendor'}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}