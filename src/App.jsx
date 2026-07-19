import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home/Home';
import Explore from './pages/Explore/Explore';
import ModelDetails from './pages/ModelDetails/ModelDetails';
import Admin from './pages/Admin/Admin';
import SubmitModel from './pages/SubmitModel/SubmitModel';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/model/:id" element={<ModelDetails />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/submit-model" element={<SubmitModel />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
