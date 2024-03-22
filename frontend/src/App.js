import "./App.css"
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Register from "./components/auth/Register";

import Home from "./components/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ProductDetails from "./components/product/ProductDetails";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";



import  { Toaster } from 'react-hot-toast';
//import router 
import {BrowserRouter as Router, Routes, Route } from "react-router-dom"
import UploadAvatar from "./components/user/UploadAvatar";
import UpdatePassword from "./components/user/UpdatePassword";

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/me/profile" element={
            <ProtectedRoute>
              <Profile />
          </ProtectedRoute>
          } />

          <Route path="/me/update_profile" element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          } />


<Route path="/me/upload_avatar" element={
            <ProtectedRoute>
              <UploadAvatar />
            </ProtectedRoute>
          } />

<Route path="/me/update_password" element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          } />


      </Routes>
      </div>

      <Footer/>
    </div>
    </Router>
  );
}

export default App;
