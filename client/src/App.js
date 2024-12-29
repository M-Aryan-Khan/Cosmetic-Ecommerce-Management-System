import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import SellerDashboard from './components/seller/Dashboard';
import BuyerDashboard from './components/buyer/Dashboard';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/signup",
    element: <Signup/>
  },
  {
    path: "/seller/dashboard",
    element: <SellerDashboard/>
  },
  
  {
    path: "/buyer/dashboard",
    element: <BuyerDashboard/>
  }
])

function App() {
  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  );
}

export default App;
