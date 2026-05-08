import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Quotations from './pages/Quotations';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import CreateQuotation from './pages/CreateQuotation';
import CreateInvoice from './pages/CreateInvoice';
import ViewQuotation from './pages/ViewQuotation';
import ViewInvoice from './pages/ViewInvoice';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-indigo-600">QuoteMaster</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link to="/" className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link to="/quotations" className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Quotations
                  </Link>
                  <Link to="/invoices" className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Invoices
                  </Link>
                  <Link to="/clients" className="border-transparent text-gray-500 hover:border-indigo-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Clients
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => setIsAuthenticated(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/quotations/new" element={<CreateQuotation />} />
            <Route path="/quotations/:id" element={<ViewQuotation />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/new" element={<CreateInvoice />} />
            <Route path="/invoices/:id" element={<ViewInvoice />} />
            <Route path="/clients" element={<Clients />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;