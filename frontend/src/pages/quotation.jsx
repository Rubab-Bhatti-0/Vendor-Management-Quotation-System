import { useEffect, useState } from 'react';
import { getQuotations, createQuotation, updateStatus as updateQuotationStatus, delQuotation } from '../api/quotation';
import { getVendors } from '../api/vendor';
import Modal from '../components/modal';

const empty = { title: '', description: '', vendorReference: '', amount: '', status: 'pending' };
const statuses = ['pending', 'active', 'approved', 'rejected'];

const statusStyle = {
  pending:  'bg-yellow-100 text-yellow-700',
  active:   'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function Quotation() {
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
        await updateQuotationStatus(editing._id, form);
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
    try {
        await delQuotation(id);
        fetchQuotations(filterStatus);
    } catch (err) {
        setError('Failed to delete quotation.');
    }
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

      {error && <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-4 overflow-x-auto">
            <button onClick={() => setFilter('')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === '' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}>All</button>
            {statuses.map(s => (
                <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filterStatus === s ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}>{s}</button>
            ))}
        </div>

        {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-50">
                            {['Title', 'Vendor', 'Amount', 'Status', 'Actions'].map(h => (
                                <th key={h} className="text-left px-6 py-4 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {quotations.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No quotations found.</td></tr>
                        ) : (
                            quotations.map(q => (
                                <tr key={q._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800">{q.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{q.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-700 font-medium">{q.vendorReference?.vendorName || q.vendorReference?.name || '—'}</p>
                                        <p className="text-xs text-gray-400">{q.vendorReference?.companyName || q.vendorReference?.company || '—'}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-800">PKR {Number(q.amount).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle[q.status]}`}>{q.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => openEdit(q)} className="text-indigo-600 hover:text-indigo-800 transition-colors">Edit</button>
                                            <button onClick={() => handleDelete(q._id)} className="text-red-600 hover:text-red-800 transition-colors">Delete</button>
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
        <Modal title={editing ? 'Edit Quotation' : 'Add New Quotation'} onClose={closeModal}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                    <select name="vendorReference" value={form.vendorReference} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required>
                        <option value="">Select Vendor</option>
                        {vendors.map(v => <option key={v._id} value={v._id}>{v.vendorName || v.name} ({v.companyName || v.company})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
                    <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                        {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-24" />
                </div>
                <div className="pt-4 flex gap-3">
                    <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                    <button type="submit" disabled={saving} className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Save Quotation'}</button>
                </div>
            </form>
        </Modal>
      )}
    </div>
  );
}
