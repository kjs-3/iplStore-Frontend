import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./Login/Login"
import Register from "./Register/Register"
import Home from "./Home/Home"
import Products from "./Products/Products"
import Cart from "./Cart/Cart"
import Checkout from "./Checkout/Checkout"
import Address from "./Address/Address"
import Orderhistory from "./Orders/Orderhistory"
import AdminDashboard from "./AdminDashboard/AdminDashboard"
import AdminProducts from "./AdminDashboard/AdminProducts"
import AdminUsers from "./AdminDashboard/AdminUsers"
import AdminOrders from "./AdminDashboard/AdminOrders"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path='/address' element={<Address />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path='/orders' element={<Orderhistory />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/getallproducts" element={<AdminProducts />} />
          <Route path="/admin/getallusers" element={<AdminUsers />} />
          <Route path="/admin/getallorders" element={<AdminOrders />} />
        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App
