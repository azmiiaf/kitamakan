import { Routes } from "react-router"
import MainLayout from "../components/templates/MainLayout"
import Cart from "../pages/Cart"
import Menu from "../pages/Menu"
import NotFound from "../pages/NotFound"
import Home from "../pages/Home"
import { Route } from "react-router"

const AppRoutes = () => {
  return (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path='/' element={<Home/> } />
      <Route path='/menu' element={<Menu/> } />
      <Route path='/cart' element={<Cart />} />
      <Route path='*' element={<NotFound/> } />
    </Route>
  </Routes>
  )
}

export default AppRoutes