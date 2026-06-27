import {useState,UseEffect} from 'react'
import { getStats } from '../api/dashboard'
import {statCard} from '../components/statsCard'

export default function dashboard(){
    const [stats,setStat]= useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState('');

    UseEffect(()=>{
        getStats().then(res=>setStat(res.data.data))
        .catch(err=>console.log(err))
        .finally(()=>setLoading(false));

    },[]);
      if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div> );
    if (error) return (
    <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4">{error}</div>);
    return(
        <div>
            <div className='mb-8'>
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                 <p className="text-gray-500 text-sm mt-1">Overview of your vendor management system</p>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8'>
            
                        < statCard label='Total Vendors'  value={stats.totalVendors} icon="🏢" color="indigo"/>
                        < statCard label='Active Requests'value= {stats.activeQuot} icon="✅" color="green" /> 
                        < statCard label='Pending Requests'value={stats.PendingQuot} icon="⏳" color="yellow" /> 
                        <statCard label='Approved Requests'value={stats.approvedQuot} icon="🎯" color="blue"/>
                    
                        </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-base font-semibold text-gray-700 mb-4">Recent Activity</h3>
                {stats.recentAct?.length === 0?(
                    <p className="text-gray-400 text-sm">No rrecent Activity ...</p>
                ):(
                    <ul className="divide-y divide-gray-50">
                        {stats.recentAct?.map((activity)=>(
                            <li key={activity._id} className="py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{activity.vendor?.name||'Unknown vendor'}</p>
                                
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium
                  ${q.status === 'approved' ? 'bg-green-100 text-green-700'
                  : q.status === 'active'   ? 'bg-blue-100 text-blue-700'
                  : q.status === 'rejected' ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'}`}>{activity.status}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
    
     </div>
                    
    );
    
}

