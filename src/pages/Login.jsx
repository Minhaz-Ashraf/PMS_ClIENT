import React, { useState } from "react";
import { logo } from "../assets";
import { useAuth } from "../features/authSlice";
import { toast } from "react-toastify";
import {useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
    const [loginCred, setLoginCred] = useState({
        email: "",
        password: ""
    })

   const handleInput = (e)=>{
    const { value, name, type } = e.target;
    setLoginCred((data)=>({
        ...data,
        [name]: value,
    }))
   }

   const handleLogin = () => {
    try{
      login(loginCred?.email, loginCred?.password);
        toast.success("Login successful")
          navigate("/admin/dashboard")
    }catch(err){
      toast.error("Invalied Credentials")
    }
    
  };
  return (
    <>
      <div>
        <img src={logo} alt="" loading="lazy" className="w-24 h-24" />
      </div>

      <div className="bg-[#F7F7F7] mt-6 flex flex-col justify-center mx-96 p-20  rounded-md">
        <span className="font-semibold">Email <span className="text-red-500">*</span></span>
        <input
          type="email"
          name="email"
          className="bg-input w-full px-3 py-3 mt-2 rounded-md"
          placeholder="Email"
          onChange={handleInput}
        />
        <span className="font-semibold mt-6">Password <span className="text-red-500">*</span></span>

        <input
          type="password"
          name="password"
          className="bg-input w-full px-3 py-3  rounded-md"
          placeholder="Password"
          onChange={handleInput}
        />

        <button onClick={handleLogin} className="bg-primary text-white rounded-md py-3 mt-9">
          Submit
        </button>
      </div>
    </>
  );
};

export default Login;
