import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import WriteReview from './pages/WriteReview'
import FAQ from './pages/FAQ'
import Firm from './pages/Firm'
import StoreDetail from './pages/Store-Detail'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />

          <main style={{ flex: 1 }}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/collection' element={<Collection />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/product/:productId' element={<Product />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/payment' element={<Payment />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Login />} />
              <Route path='/place-order' element={<PlaceOrder />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/write-review' element={<WriteReview />} />
              <Route path='/faq' element={<FAQ />} />
              <Route path='/firm' element={<Firm />} />
              <Route path='/store-detail' element={<StoreDetail />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

export default App