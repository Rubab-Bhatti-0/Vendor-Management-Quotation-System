export default function statCard({label,value,icon,color}){
    const colors={
    blue:   'bg-blue-50 border-blue-200 text-blue-600',
    green:  'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600',
    };
    const valueColors={
     blue:   'text-blue-700',
    green:  'text-green-700',
    yellow: 'text-yellow-700',
    indigo: 'text-indigo-700',

    };
    return(
        <div  className={`rounded-2xl border-2 p-5 flex items-center gap-4 shadow-sm ${colors[color]}`}>
            <div>{icon}</div>
            <div>
                <p className="text-sm font-medium opacity-75">{label}</p>
                <p className={`text-3xl font-bold ${valueColors[color]}`}>{value ?? '—'}</p>
            </div>
        </div>
    );

}