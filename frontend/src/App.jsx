import { BrowserRouter,Route,Router, Routes } from "react-router-dom";
import sidebar from './components/sidebar';
import dashboard from './pages/dashboard';
import quotation from './pages/quotation';
import vendor from './pages/vendor';
import compare from './pages/comapre'

function App(){
    return (
        <BrowserRouter>
        <div className="flex min-h-screen bg-gray-100">
            <sidebar/>
            <main className="flex-1 p-6">
                <Routes>
                    <Route path="/" element={<dashboard/>} />
                    <Route path="/vendor" element={<vendor/>}/>
                    <Route path="/quotation" element={<quotation/>}/>
                    <Route id="/compare" element={<compare/> }/>
                </Routes>
            </main>
        </div>

        </BrowserRouter>
        
    );

}

export default App;
