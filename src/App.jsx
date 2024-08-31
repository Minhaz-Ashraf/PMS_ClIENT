import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./admin/Dashboard"
import AddAgent from "./admin/AddAgent"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddMGPolicies from './admin/AddMGPolicies';
import { fetchUsers } from "./features/getUserSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Approval from "./admin/Approval";
import PolicyLists from "./admin/PolicyLists";


function App() {


  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(fetchUsers());
  }, [dispatch]);


  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />

<Routes>
<Route path = "/" element={<Login/>}/>
<Route path = "/admin/dashboard" element={<Dashboard/>}/>
<Route path = "/admin/add-agent" element={<AddAgent/>}/>
<Route path = "/admin/add-policies" element={<AddMGPolicies/>}/>
<Route path = "/admin/approval-lists" element={<Approval/>}/>
<Route path = "/admin/policy-lists" element={<PolicyLists/>}/>






</Routes>
     </>
  )
}

export default App
