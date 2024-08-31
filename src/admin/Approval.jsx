import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPendingPolicy, updatePolicy } from "../features/policySlice";
import { toast } from "react-toastify";
import Pagination from "../Components/Pagination";
import { fetchUserById } from "../helper/commonHelperFunc";

const MgApproval = () => {
  const dispatch = useDispatch();
  const { pendingPolicy, status, totalPagesCount, totalUsersCount } =
    useSelector((state) => state.policy);

  const perPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedManufacturer, setSelectedManufacturer] =
    useState("Morris Garage");

  useEffect(() => {
    dispatch(
      fetchAllPendingPolicy({
        page: currentPage,
        limit: perPage,
        manufacturer: selectedManufacturer,
      })
    );
  }, [dispatch, currentPage, selectedManufacturer]);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "succeeded" || status === "failed") {
      setLoading(false);
    }
  }, [status]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTabClick = (manufacturer) => {
    if (manufacturer === "MG") {
      setSelectedManufacturer("Morris Garage");
    }
    if (manufacturer === "MB") {
      setSelectedManufacturer("Mercedes-Benz");
    }

    setCurrentPage(1);
  };

  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <Nav />
        </span>
      </div>

      <div className="flex flex-row justify-center w-full gap-20 pt-20">
        <span
          onClick={() => handleTabClick("MB")}
          className={`bg-secondary font-semibold rounded-2xl text-center font-head text-[20px] px-6 py-2 cursor-pointer ${
            selectedManufacturer === "Mercedes-Benz"
              ? "border border-primary"
              : ""
          }`}
        >
          Mercedes Benz
        </span>

        <span
          onClick={() => handleTabClick("MG")}
          className={`bg-secondary font-semibold rounded-2xl text-center font-head text-[20px] px-6 py-2 cursor-pointer ${
            selectedManufacturer === "Morris Garage"
              ? "border border-primary"
              : ""
          }`}
        >
          Morris Garage
        </span>
      </div>

      <p className="font-semibold text-[28px] md:ml-72 sm:ml-72 ml-6 pt-20">
        Pending Approval List
      </p>
      <div className="overflow-x-scroll w-[100%] md:w-full md:overflow-hidden">
        <ul className="bg-[#F0F0F0] text-[15px] py-7 flex flex-row justify-around items-center md:mx-10 mx-6 sm:mx-0 md:ml-72 sm:ml-72 gap-2 rounded-lg mt-8 h-[6vh] w-[180%] md:w-[80%] sm:w-[100%] text-black font-medium">
          <li className="w-[2%]">S.No</li>
          <li className="w-[32%] md:w-[36%] text-center">Description</li>
          <li className="w-[9%] text-center">Action</li>
        </ul>

        <div>
          {loading ? (
            <div className="mt-16 ml-52">
              {/* <Loading customText={"Loading"} /> */}
            </div>
          ) : pendingPolicy?.data?.length === 0 ? (
            <div className="flex flex-col items-center md:ml-36 mt-11 sm:ml-28 sm:mt-20">
              <p>No approval requests available</p>
              <a href="/user-dashboard" className="text-primary">
                Back to Dashboard
              </a>
            </div>
          ) : (
            pendingPolicy?.data
              ?.filter((policy) => policy.policyStatus === "yetToApproved")
              .map((item, index) => (
                <ApprovalCard key={item._id} item={item} index={index} />
              ))
          )}
        </div>

        {totalUsersCount > 0 && (
          <div className="flex justify-center items-center mt-3 mb-5 ml-52">
            <Pagination
              currentPage={currentPage}
              hasNextPage={currentPage < totalPagesCount}
              hasPreviousPage={currentPage > 1}
              onPageChange={handlePageChange}
              totalPagesCount={totalPagesCount}
            />
          </div>
        )}
      </div>
    </>
  );
};

const ApprovalCard = ({ item, index }) => {
  const dispatch = useDispatch();
  const [agentData, setAgentData] = useState();

  const getAgentData = async () => {
    const data = await fetchUserById(item.userId);
    setAgentData(data);
    console.log(data);
  };

  useEffect(() => {
    getAgentData();
  }, []);

  const handlePolicyStatus = async (userId, type, policyData) => {
    try {
      const response = await dispatch(
        updatePolicy({ userId, type, policyData })
      );

      if (response?.meta?.requestStatus === "fulfilled") {
        toast.success("Updated Successfully");
        dispatch(fetchAllPendingPolicy({ page: 1, limit: 10 }));
      } else {
        toast.error("Failed to update the policy status");
      }
    } catch (error) {
      console.error(error, "Something went wrong");
    }
  };

  return (
    <ul className="text-[15px] flex flex-row justify-around items-start mx-6 sm:mx-6 md:mx-10 md:ml-72 sm:ml-72 gap-2 rounded-lg mt-8 text-black font-normal w-[180%] md:w-[80%] sm:w-[100%]">
      <li className="w-[2%]">{index + 1}</li>
      <li className="w-[36%] px-3 text-start mb-3 py-3 rounded-lg bg-[#EAEAEA] shadow">
        {agentData?.roleType === "0"? "Admin" : "Agent"}: {agentData?.agentName} Sent a request to approve the policy of{" "}
        {item?.customerName}
        <span className="mx-1 text-primary cursor-pointer"> View Policy </span>
      </li>

      <li className="md:w-[9%] w-[13%] text-center flex flex-col gap-2">
        <span
          onClick={() => handlePolicyStatus(item._id, "approved", item)}
          className="py-1 px-5 bg-primary text-white rounded-lg cursor-pointer"
        >
          Accept
        </span>
        <span
          onClick={() => handlePolicyStatus(item._id, "rejected", item)}
          className="py-1 px-5 text-primary border border-primary rounded-md font-medium cursor-pointer"
        >
          Decline
        </span>
      </li>
    </ul>
  );
};

export default MgApproval;
