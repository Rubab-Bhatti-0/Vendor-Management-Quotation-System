import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Quotation from './pages/Quotation';
import Vendor from './pages/Vendor';
import Compare from './pages/Compare';

function App(){
    return (
        <BrowserRouter>
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar/>
            <main className="flex-1 p-6">
                <Routes>
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/vendor" element={<Vendor/>}/>
                    <Route path="/quotation" element={<Quotation/>}/>
                    <Route path="/compare" element={<Compare/> }/>
                </Routes>
            </main>
        </div>

        </BrowserRouter>
        
    );

}

export default App;
