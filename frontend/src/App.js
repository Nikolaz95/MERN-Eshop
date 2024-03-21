import "./App.css"

import Home from "./components/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ProductDetails from "./components/product/ProductDetails";



import  { Toaster } from 'react-hot-toast';
//import router 
import {BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (

    <Router>
    <div className="App">
      <Toaster position="top-center"/>
      <Header />
      
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
      </div>

      <Footer/>
    </div>
    </Router>
  );
}

export default App;
