import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // Keep for any global app-specific styles not covered by index.css or Tailwind components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Chatbot from './components/Chatbot';
import PersonalityTest from './components/PersonalityTest';
import FAQ from './components/FAQ';

function App() {
  return (
    <Router>
      <div className='flex flex-col min-h-screen bg-gray-100'> {/* Overall app container */}
        <Navbar />
        <main className='flex-grow container mx-auto px-4 py-8'> {/* Main content area */}
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/chat' element={<Chatbot />} />
            <Route path='/test' element={<PersonalityTest />} />
            <Route path='/faq' element={<FAQ />} />
            {/* You can add a 404 Not Found route here later */}
            {/* <Route path='*' element={<div>404 Not Found</div>} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
