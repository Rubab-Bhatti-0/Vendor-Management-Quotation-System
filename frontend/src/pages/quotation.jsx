import { useEffect, useState } from 'react';
import { getQuotations, createQuotation, updateStatus, delQuotation } from '../api/quotation';
import { getvendors } from '../api/vendor';
import Modal from '../components/modal';

const empty = { title: '', description: '', vendorReference: '', amount: '', status: 'pending' };
const statuses = ['pending', 'active', 'approved', 'rejected'];

const statusStyle = {
  pending:  'bg-yellow-100 text-yellow-700',
  active:   'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [vendors, setVendors]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filterStatus, setFilter]   = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(empty);
  const [error, setError]           = useState('');
  const [saving, setSaving]         = useState(false);

  const fetchQuotations = (status = '') => {
    setLoading(true);
    getQuotations(status)
      .then(res => setQuotations(res.data.data))
      .catch(() => setError('Failed to load quotations.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuotations();
    getVendors().then(res => setVendors(res.data.data));
  }, []);

  useEffect(() => { fetchQuotations(filterStatus); }, [filterStatus]);

  const openAdd  = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (q) => {
    setEditing(q);
    setForm({
      title: q.title,
      description: q.description,
      vendorReference: q.vendorReference?._id || q.vendorReference,
      amount: q.amount,
      status: q.status,
    });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.vendorReference || !form.amount) {
      return setError('Title, vendor and amount are required.');
    }
    setSaving(true);
    try {
      if (editing) {
        await updateQuotation(editing._id, form);
      } else {
        await createQuotation(form);
      }
      closeModal();
      fetchQuotations(filterStatus);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this quotation?')) return;
    await deleteQuotation(id);
    fetchQuotations(filterStatus);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quotations</h2>
          <p className="text-gray-500 text-sm mt-1">Manage quotation requests and responses</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          + New Quotation
        </button>
      </div>

      {/* Filter by status */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['', ...statuses].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors
              ${filterStatus === s
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : quotations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📄</p>
            <p>No quotations found.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Title','Vendor','Amount','Date','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quotations.map(q => (
                <tr key={q._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{q.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {q.vendorReference?.vendorName || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    PKR {Number(q.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(q.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[q.status]}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(q)}
                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(q._id)}
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
        <Modal title={editing ? 'Edit Quotation' : 'New Quotation'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Vendor <span className="text-red-400">*</span>
              </label>
              <select
                name="vendorReference"
                value={form.vendorReference}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                <option value="">Select vendor...</option>
                {vendors.map(v => (
                  <option key={v._id} value={v._id}>{v.vendorName} — {v.companyName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Amount (PKR) <span className="text-red-400">*</span>
              </label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-medium transition-colors"
              >
                {saving ? 'Saving...' : editing ? 'Update' : 'Create Quotation'}
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