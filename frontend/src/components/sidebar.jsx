import { NavLink } from "react-router-dom";

const links=[
    { to:'/' , label :'Dashboard' , icon:'📊' },
    {to:'/vendor',label:'Vendors', icon:'🏢'},
    {to:'/quotation',label:'Quotations',icon:'📄'},
    {to:'/compare',label:'Compare',icon:'⚖️'}
];
export default function Sidebar(){
    return(
        <aside className="w-60 bg-indigo-900 min-h-screen flex flex-col p-4 shadow-xl">
        <div className="mb-10 mt-2 px-2">
        <h1 className="text-white text-2xl font-bold tracking-tight">Vendor System</h1>
        <p className="text-indigo-300 text-xs mt-1">Management Portal</p>
        </div>
        <nav className="flex flex-col gap-1">
        {links.map(link=>(
            <NavLink key={link.to} to={link.to} end 
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
               ${isActive
                 ? 'bg-indigo-600 text-white shadow-lg'
                 : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`
            }>
                <span className="text-lg">{link.icon}</span>
                {link.label}
                
            </NavLink>
        ))}
        </nav>
        <div className="mt-auto px-2 pb-2">
        <div className="bg-indigo-800 rounded-xl p-3 text-indigo-200 text-xs">
        <p className="font-medium text-white mb-1">Teyzix Internship</p>
        <p>FS Task 2</p>
        </div>
        </div>
        </aside>
    )
}
