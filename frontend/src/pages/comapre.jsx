import { useEffect, useState } from 'react';
import { compareQuotations } from '../api/quotation';

export default function Compare() {
  const [groups, setGroups]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    compareQuotations()
      .then(res => setGroups(res.data.data))
      .catch(() => setError('Failed to load comparison data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4">{error}</div>
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Compare Quotations</h2>
        <p className="text-gray-500 text-sm mt-1">
          Quotations grouped by title — cheapest highlighted in green
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">⚖️</p>
          <p>No quotations to compare yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map(group => (
            <div key={group.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-800">{group.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{group.quotations.length} vendor{group.quotations.length !== 1 ? 's' : ''} quoted</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Vendor','Company','Amount','Status',''].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {group.quotations.map(q => (
                      <tr
                        key={q._id}
                        className={`transition-colors ${q.isCheapest ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {q.vendorReference?.vendorName || '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {q.vendorReference?.companyName || '—'}
                        </td>
                        <td className={`px-4 py-3 font-bold text-base ${q.isCheapest ? 'text-green-700' : 'text-gray-800'}`}>
                          PKR {Number(q.amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${q.status === 'approved' ? 'bg-green-100 text-green-700'
                            : q.status === 'active'   ? 'bg-blue-100 text-blue-700'
                            : q.status === 'rejected' ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'}`}>
                            {q.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {q.isCheapest && (
                            <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                              ✓ Best Price
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}