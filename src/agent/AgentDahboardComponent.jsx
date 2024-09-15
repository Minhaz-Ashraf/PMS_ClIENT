import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../helper/commonHelperFunc";
import { Link } from "react-router-dom";
import { SiMercedes, SiMg } from "react-icons/si";
import PdfPage from "../Components/pdfPage";
import SideNav from "./SideNav";
import { getPolicyById } from "../../Util/UtilityFunction";
import Pagination from "../Components/Pagination";
import Loader from "../Components/Loader";
import DataNotFound from "../admin/DataNotFound";
import { cancelReqPolicy } from "../features/policySlice";
import { toast } from "react-toastify";
import { TbPencilCancel } from "react-icons/tb";
import CancelReqPopUp from "../Components/CancelReqPopUp";

const AgentDashboardComponent = () => {
  const { _id, agentName, brandName, agentId } = useSelector(
    (state) => state.users?.users
  );
  const dispatch = useDispatch();
  const [policy, setPolicy] = useState([]);
  const [filteredPolicy, setFilteredPolicy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPoliciesCount, setTotalPoliciesCount] = useState(0);
  const [totalPagesCount, setTotalPagesCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isReqStatus, setIsReq] =useState(false);
  const perPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPolicyById(_id, currentPage, perPage);
        setPolicy(res?.data || []);
        setIsReq(false)
        setTotalPagesCount(res.totalPagesCount || 0);
        setTotalPoliciesCount(res.totalPoliciesCount || 0);
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [_id, currentPage, isReqStatus]);

  useEffect(() => {
    const filtered = (Array.isArray(policy) ? policy : []).filter(
      (item) =>
        item.policyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicleRegNumber
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.engineNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPolicy(filtered);
  }, [policy, searchTerm]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const cancelPolicyRequest = async (id) => {
    try {
      const response = await dispatch(cancelReqPolicy(id)).unwrap();
      setIsReq(true)
      toast.info(response.message);
      //  console.log(response.message);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <SideNav />
        </span>
      </div>

      <div className="flex items-center gap-3 justify-center md:ml-28 text-[18px] md:mt-10 sm:mt-10 mt-20">
        <span className="text-[22px]">
          {brandName === "MG" ? <SiMg /> : <SiMercedes />}
        </span>
        <span className="font-head font-semibold">
          {brandName === "MG" ? "Morris Garage" : "Mercedes-Benz"}
        </span>
      </div>
      <div className="md:pt-14 sm:pt-14 pt-6  flex md:flex-row sm:flex-row flex-col-reverse  justify-between md:items-center sm:items-center md:px-20 mx-6">
        <Link
          to="/new-policy"
          state={{ policyType: brandName }}
          className="px-6 bg-primary text-white rounded-md py-2 text-[16px] md:ml-[16%] sm:ml-[33%] mt-4 sm:mt-4 md:mt-4"
        >
          + Add New Policy
        </Link>
        <span className="font-medium ">
          {agentName} ({agentId})
        </span>
      </div>

      <div className="px-6 flex justify-center md:ml-28 sm:ml-60 mt-6">
        <input
          type="text"
          placeholder="Search by Policy ID / Engine Number / Vehicle Registration Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[30rem]  py-2 border border-gray-300 bg-secondary px-3 rounded-2xl outline-none"
        />
      </div>
      <p className="pt-5 text-[20px] font-semibold md:ml-[20%] sm:ml-[33%] ml-6">
        Policy List -
      </p>

      <div className="font-head pt-4">
        {loading ? (
          <div className="mt-16 flex justify-center md:ml-32 sm:ml-32">
            {/* <Loading customText={"Loading"} /> */}
            <Loader />
          </div>
        ) : filteredPolicy.length === 0 ? (
          <div className="flex justify-center items-center h-[300px]">
            <DataNotFound
              className="flex justify-center flex-col w-full items-center md:mt-20 mt-12 md:ml-28 sm:ml-28"
              message="No agent policy found"
            />
          </div>
        ) : (
          <div className="w-[120%] md:w-[110%] sm:w-[100%] overflow-x-scroll scrollbar-hide ">
            <div className="flex flex-row justify-between md:mx-36 mx-6 md:ml-[18%] sm:ml-[33%] w-[240%]  bg-secondary  md:w-[77%] py-2 px-6 sm:w-[120%] font-semibold text-center text-[16px] items-center font-DMsans mb-6">
              <p className="md:w-1  ">S.No</p>
              <p className="md:w-32 w-[20%]">Name</p>
              <p className="text-center md:w-36 w-[16%]">Certificate No.</p>
              <p className="md:w-24 w-[15%]">Certificate Issue Date</p>
              <p className="md:w-32 w-[16%]">View / Download</p>
              <p className="md:w-24 w-[16%]"> Cancel Request</p>
              <p className="md:w-40 md:text-start  w-[12%]">Status</p>
            </div>
            {filteredPolicy.map((item, index) => (
              <PolicyDataTable
                key={item._id}
                item={item}
                cancelPolicyRequest={cancelPolicyRequest}
                index={index + 1 + (currentPage - 1) * perPage}
              />
            ))}
            {totalPagesCount > 1 && (
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
        )}
      </div>
    </>
  );
};

const PolicyDataTable = ({ item, index, cancelPolicyRequest}) => {
  const pdfRef = useRef();
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const openPopUp = useCallback(() => setIsPopUpOpen(true), []);
  const closePopUp = useCallback(() => setIsPopUpOpen(false), []);

  const handleDownloadClick = () => {
    if (pdfRef.current) {
      pdfRef.current.handleDownloadPDF();
    }
  };


  return (
    <>
      <div className="flex flex-col md:mx-40  md:ml-[20%] ml-[14%] sm:ml-[38%] mx-6  md:w-[72%] w-[210%] sm:w-[105%] font-normal text-black text-[15px] items-start  font-DMsans mb-9">
        <div className="flex text-[14px] flex-row justify-between items-start w-full my-1">
          <p className="md:w-3 w-8">{index}</p>
          <p className="md:w-32 w-[15%]">{item?.customerName}</p>
          <p className="md:w-36 w-[15%]">{item?.policyId || "waiting"}</p>
          <p className="">{formatDate(item?.createdAt)}</p>
          <p className="md:w-36 w-[15%] sm:w-36 flex flex-row items-center gap-5 md:gap-5 sm:gap-2 text-[14px]">
            <Link
              to="/policy"
              state={{ id: item?._id }}
              className="bg-primary text-white py-1 px-3 cursor-pointer rounded-md"
            >
              View
            </Link>
            <span
              onClick={handleDownloadClick}
              className="bg-primary text-white py-1 px-3 cursor-pointer rounded-md"
            >
              Download
            </span>
          </p>

          <p className="md:w-20 w-[10%] sm:w-28  flex flex-row items-center gap-3 text-[14px] ">
            {item?.isCancelReq === "reqCancel" ? (
              <span className="ps-6">Pending</span>
            ) : item?.isCancelReq === "approvedReq" ? (
              <span className="ps-6">Approved</span>

            )  : item?.isDisabled === true ? (
              <span className="ps-6">Approved</span>
            )     : item?.policyStatus === "rejected" ? (
              <span className="ps-6">Rejected</span>
            )
             :  item?.policyStatus === "approved" ? (
              <>
                <span className="text-[20px] ps-3 text-red-500">
                  <TbPencilCancel />
                </span>
                <span className="cursor-pointer" onClick={openPopUp}>
                  Request
                </span>
              </>
            ) : null}
          </p>
          <p className="md:w-40 w-[5%] ">
            {item?.isDisabled === true && item?.policyStatus === "approved" ? (
              <span className="bg-red-500 text-white rounded-md py-1 px-2">
                Cancelled
              </span>
            ) : item?.policyStatus === "approved" ? (
              <span className="bg-green-500 text-white rounded-md py-1 px-3">
                Approved
              </span>
            ) : item?.policyStatus === "rejected" ? (
              <span className="bg-red-500 text-white rounded-md py-1 px-3">
                Rejected
              </span>
            ) : (
              <span className="bg-yellow-500  text-white rounded-md py-1 px-3">
                Pending
              </span>
            )}
          </p>
        </div>
      </div>
      <CancelReqPopUp
        closePopUp={closePopUp}
        isPopUpOpen={isPopUpOpen}
        item={item}
        cancelPolicyRequest={cancelPolicyRequest}
      />
      <span className="hidden">
        <PdfPage ref={pdfRef} id={item?._id} />
      </span>
    </>
  );
};

export default AgentDashboardComponent;
