import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./admin/Dashboard"
import AddAgent from "./admin/AddAgent"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />

<Routes>
<Route path = "/" element={<Login/>}/>
<Route path = "/admin/dashboard" element={<Dashboard/>}/>
<Route path = "/admin/add-agent" element={<AddAgent/>}/>




</Routes>
     </>
  )
}

export default App
