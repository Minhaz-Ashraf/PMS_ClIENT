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

const Dashboard = () => {
  const dispatch = useDispatch();
  const { mbAgents, mgAgents } = useSelector((state) => state.admin);
  const [toggle, setToggle] = useState(1);

  useEffect(() => {
    dispatch(fetchAllMbAgents());
    dispatch(fetchAllMgAgents());
  }, [dispatch]);
  const toggleTab = (index) => {
    setToggle(index);
  };
  console.log(mbAgents);

const handleDelete = async(userId) => {
  try {
    const response = await dispatch(deleteAgentData(userId)).unwrap(); 
    return response;
  } catch (error) {
    console.log("Error while deleting", error);
  }
};

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

      <div className="flex flex-row ml-0 sm:ml-[28%] md:ml-[25%] w-full gap-9 pt-3">
        <span className="bg-secondary font-semibold font w-[18%] rounded-md h-[10rem] text-center pt-6 font-head text-[20px]">
          <p className="text-[45px]">36</p>
          Active Polices
        </span>

        <span className="bg-secondary font-semibold font w-[18%] h-[10rem] rounded-md text-center pt-6 font-head text-[20px]">
          <p className="text-[45px]">36</p>
          Cancelled Polices
        </span>
      </div>

      <p className="ml-[25%] pt-8 text-[23px] font-medium">Agent Lists - </p>
      <div className="ml-[16%] md:ml-[25%] sm:ml-[28%] flex gap-20 pt-5">
        <div
          className={` rounded-xl border border-primary text-black mb-9 font-medium md:px-6 sm:px-6 w-44 px-6 text-center py-2 cursor-pointer ${
            toggle === 1 ? "bg-primary text-white" : "bg-secondary text-black"
          }`}
          onClick={() => toggleTab(1)}
        >
          MG
        </div>

        <div
          className={`rounded-xl border border-primary text-black mb-9 font-medium md:px-6 sm:px-6 w-44 px-6 text-center py-2 cursor-pointer ${
            toggle === 2 ? "bg-primary text-white" : "bg-secondary text-black"
          }`}
          onClick={() => toggleTab(2)}
        >
          MB
        </div>
      </div>

      <div className="ml-[25%] mb-20">
        <div className={toggle === 1 ? "flex flex-wrap gap-3   pt-2" : "hidden"}>
          {mgAgents?.map((agent) => (
            <AdminCards
              key={agent._id}
              id={agent._id}
              name={agent.agentName}
              agentId={agent.agentId}
              handleDelete = {handleDelete}
              link="/mgAgent"
            />
          ))}
        </div>

        <div className={toggle === 2 ? " flex flex-wrap gap-3 pt-2" : "hidden"}>
          {mbAgents?.map((agent) => (
            <AdminCards
              key={agent._id}
              id={agent._id}
              name={agent.agentName}
              agentId={agent.agentId}
              handleDelete={handleDelete}
              link="/mbAgent"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
