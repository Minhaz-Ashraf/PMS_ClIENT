import React, { useEffect, useState } from "react";
import HeaderTab from "./HeaderTabs";
import Nav from "./Nav";
import AdminCards from "../Components/AdminCards";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAgentData,
  fetchAllMbAgents,
  fetchAllMgAgents,
} from "../features/adminDashboardSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { SiMercedes, SiMg } from "react-icons/si";
import { getCancelledCountPolicy, getCountPolicy } from "../../Util/UtilityFunction";

const DashboardComponent = () => {
  const dispatch = useDispatch();
  const { mbAgents, mgAgents } = useSelector((state) => state.admin);

  const [toggle, setToggle] = useState(1);
  const [cancelPolicyCount, setCancelPolicyCount] = useState();
  const [policyCount, setPolicyCount] = useState();

  useEffect(() => {
    dispatch(fetchAllMbAgents());
    dispatch(fetchAllMgAgents());
  }, [dispatch]);
  const toggleTab = (index) => {
    setToggle(index);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await dispatch(deleteAgentData(userId)).unwrap();
      toast.success("Agent deleted successfully");
      
      return response;
    } catch (error) {
      console.log("Error while deleting", error);
      toast.error("Failed to delete agent");
    }
  };
  useEffect(() => {
    const getCancelledPolicy = async () => {
      const response = await getCancelledCountPolicy();
      setCancelPolicyCount(response);
    };
    getCancelledPolicy();
  }, []);
  useEffect(() => {
    const getAllPolicy = async () => {
      const response = await getCountPolicy();
      setPolicyCount(response);
    };
    getAllPolicy();
  }, []);
  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <Nav />
        </span>
      </div>
      <div className="ml-0 sm:ml-[28%] md:ml-[23%]">
        <HeaderTab />
      </div>

      <div className="flex md:flex-row sm:flex-row flex-col  ml-8 sm:ml-[33%] md:ml-[25%]  w-full gap-9 pt-3">
        <Link
          to="/admin/active-policy"
          className="bg-secondary shadow font-semibold font md:w-[16%]  sm:w-[16%] w-[72%] md:mx-0 sm:mx-0 mx-6 rounded-md h-[10rem] text-center pt-6 font-head text-[20px]"
        >
          <p className="text-[40px]">{policyCount || 0}</p>
          Active Polices
        </Link>

        <Link
          to="/admin/cancelled-policy"
          className="bg-secondary shadow font-semibold font md:w-[16%]  sm:w-[16%] w-[72%] md:mx-0 sm:mx-0 mx-6 rounded-md h-[10rem] text-center pt-6 font-head text-[20px]"
        >
          <p className="text-[40px]">{cancelPolicyCount || 0}</p>
          Cancelled Polices
        </Link>
      </div>

      <p className="md:ml-[25%] sm:ml-[33%] ml-6 pt-8 text-[23px] font-medium">Agent Lists - </p>
      <div className="mx-6 md:mx-0 sm:mx-0 md:ml-[25%] sm:ml-[33%] flex md:gap-20 gap-3 pt-5 ">
        <div
          className={` rounded-xl flex items-center gap-3 border border-primary text-black mb-9 font-medium md:px-6 sm:px-6 w-48 px-6 text-center py-2 cursor-pointer ${
            toggle === 1
              ? "bg-primary text-white"
              : "bg-secondary text-black shadow"
          }`}
          onClick={() => toggleTab(1)}
        >
                 <SiMg />

          <span>Morris Garage</span>
        </div>

        <div
          className={`rounded-xl flex items-center gap-3 border border-primary text-black mb-9 font-medium md:px-6 sm:px-6 w-48 px-6 text-center py-2 cursor-pointer ${
            toggle === 2
              ? "bg-primary text-white"
              : "bg-secondary text-black shadow"
          }`}
          onClick={() => toggleTab(2)}
        >
                   <SiMercedes />

          <span>Mercedes-Benz</span>
        </div>
      </div>

      <div className="md:ml-[25%] sm:ml-[33%] ml-6 mb-20">
        <div
          className={toggle === 1 ? "flex flex-wrap gap-6   pt-2" : "hidden"}
        >
          {mgAgents?.map((agent) => (
            <AdminCards
              key={agent._id}
              id={agent._id}
              name={agent.agentName}
              agentId={agent.agentId}
              handleDelete={handleDelete}
              link="/admin/agent-policies"
              editLink="/admin/update-agent"
            />
          ))}
        </div>

        <div className={toggle === 2 ? " flex flex-wrap gap-6 pt-2" : "hidden"}>
          {mbAgents?.map((agent) => (
            <AdminCards
              key={agent._id}
              id={agent._id}
              name={agent.agentName}
              agentId={agent.agentId}
              handleDelete={handleDelete}
              link="/admin/agent-policies"
              editLink="/admin/update-agent"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardComponent;
