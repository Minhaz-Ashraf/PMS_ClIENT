import React, { useState } from "react";
import Nav from "./Nav";
import InputField from "../Components/Input";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAgent } from "../features/adminDashboardSlice";

const AddAgent = () => {
  const [agentData, setAgentData] = useState({
    brandName: "",
    agentId: "",
    agentName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    roleType: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //********************* Password Hide & Unhide ***********************/

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    return passwordRegex.test(password);
  };

  //********************* Input Function***********************/

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "brandName") {
      setAgentData((data) => ({
        ...data,
        brandName: value,
        roleType: value === "MG" ? "1" : value === "MB" ? "2" : "",
      }));
    } else {
      setAgentData((data) => ({
        ...data,
        [name]: value,
      }));
    }
  };

  //********************* Input Validation ***********************/

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "brandName",
      "agentId",
      "agentName",
      "email",
      "contact",
      "password",
      "confirmPassword",
    ];

    // Check if required fields are filled
    requiredFields.forEach((field) => {
      if (!agentData[field]) {
        newErrors[field] = `${field} is required`;
      }
    });

    if (agentData.password !== agentData.confirmPassword) {
      newErrors.confirmPassword = "Passwords doesn't matched";
    }

    if (!isPasswordValid(agentData.password)) {
      newErrors.password =
        "Password must contain at least one letter, one number, and one special character";
    }

    setErrors(newErrors);

    // If there are no errors, the form is valid
    return Object.keys(newErrors).length === 0;
  };

  //********************* Form Submission Function ***********************/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const result = await dispatch(addAgent(agentData)).unwrap();
        toast.success("Agent Added successfully");
        navigate("/admin/dashboard");
      } catch (error) {
        console.error("Error adding agent:", error);
        console.log("message", error.message);
        toast.error(error?.message);
      }
    } else {
      1;
      toast.error("Please correct the errors in the form");
    }
  };
  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <Nav />
        </span>
      </div>
      <div className="ml-[22%]">
        <p className="text-[23px] font-head font-semibold pt-12">
          Add New Agent
        </p>
        <p className="text-[20px] font-head font-semibold pt-10">
          Agent Details
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex md:flex-row sm:flex-row flex-col font-body gap-6">
            <span className="w-96">
              <div className="pt-3">
                <label className="font-semibold">Brand Name</label>
                <select
                  className="w-full h-10 bg-input px-3"
                  name="brandName"
                  value={agentData.brandName}
                  onChange={handleInput}
                  autoComplete="off"
                >
                  <option value="">Select Brand</option>
                  <option value="MG">Morris Garages (MG)</option>
                  <option value="MB">Mercedes-Benz</option>
                </select>
                {errors.brandName && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.brandName}
                  </p>
                )}
              </div>
              <div className="pt-3">
                <label className="font-semibold">Agent Name</label>
                <InputField
                  className="w-full h-10 bg-input px-3"
                  placeholder="Agent Name"
                  name="agentName"
                  onchange={handleInput}
                  type="text"
                  value={agentData.agentName}
                />
                {errors.agentName && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.agentName}
                  </p>
                )}
              </div>
              <div className="pt-3 relative">
                <label className="font-semibold">Password</label>
                <InputField
                  className="w-full h-10 bg-input px-3"
                  placeholder="Password"
                  name="password"
                  onchange={handleInput}
                  type={showPassword ? "text" : "password"}
                  value={agentData.password}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 top-9 text-[14px] flex items-center"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && (
                  <p className="text-red-500 mt-1 text-sm">{errors.password}</p>
                )}
              </div>
              <div className="pt-3 relative">
                <label className="font-semibold">Confirm Password</label>
                <InputField
                  className="w-full h-10 bg-input px-3"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  onchange={handleInput}
                  type={showConfirmPassword ? "text" : "password"}
                  value={agentData.confirmPassword}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-3 top-9 text-[14px] flex items-center"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </span>
            <span className="w-96">
              <div className="pt-3">
                <label className="font-semibold">Agent Id</label>
                <InputField
                  className="w-full h-10 bg-input px-3 outline-none"
                  placeholder="Agent Id"
                  name="agentId"
                  onchange={handleInput}
                  type="text"
                  value={agentData.agentId}
                />
                {errors.agentId && (
                  <p className="text-red-500 mt-1 text-sm">{errors.agentId}</p>
                )}
              </div>
              <div className="pt-3">
                <label className="font-semibold">Contact Number</label>
                <InputField
                  className="w-full h-10 bg-input px-3"
                  placeholder="Contact Number"
                  name="contact"
                  onchange={handleInput}
                  type="number"
                  value={agentData.contact}
                />
                {errors.contact && (
                  <p className="text-red-500 mt-1 text-sm">{errors.contact}</p>
                )}
              </div>
              <div className="pt-3">
                <label className="font-semibold">Email Id</label>
                <InputField
                  className="w-full h-10 bg-input px-3"
                  placeholder="Email Id"
                  name="email"
                  onchange={handleInput}
                  type="email"
                  value={agentData.email}
                />
                {errors.email && (
                  <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
                )}
              </div>
            </span>
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="rounded-md px-6 py-2 bg-primary text-white"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddAgent;
