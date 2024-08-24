import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { close, menu } from "../assets";
import LogoutPop from "../Components/LogoutPop";

const Nav = () => {
  const location = useLocation();
  const path = location.pathname;
  const [isLogoutOpen, setisLogoutOpen] = useState(false);
  const [toggle, SetToggle] = useState(false);

  const openLogoutPopup = () => {
    setisLogoutOpen(true);
  };

  const closeLogout = () => {
    setisLogoutOpen(false);
  };

  return (
    <>
      <LogoutPop isLogoutOpen={isLogoutOpen} closeLogout={closeLogout} />
      <div className="bg-primary  px-9 py-9 text-start w-60 h-screen rounded-r-3xl hidden md:block sm:block  ">
        <div className="flex  items-center relative gap-3">
          <p className="text-white font-montserrat font-medium text-[30px] px-2">
            Menu
          </p>
        </div>

        <span>
          <Link to="/admin/dashboard">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3  mt-6 rounded-xl text-[17px] "  ${
                (path === "/admin/dashboard" ||
                  path === "/admin/active-users" ||
                  path === "/admin/male-users" ||
                  path === "/admin/female-users" ||
                  path === "/admin/successfull-married" ||
                  path === "/admin/deleted-users" ||
                  path === "/admin/CategoryA-users" ||
                  path === "/admin/categoryB-users" ||
                  path === "/admin/categoryC-users" ||
                  path === "/admin/banned-users" ||
                  path === "/admin/rejected-users" ||
                  path === "/admin/uncategorised-users") &&
                "adminnav"
              }`}
            >
              Dashboard
            </p>
          </Link>
          <Link to="/admin/user">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3 mt-6 rounded-xl text-[17px]  ${
                path === "/admin/user" && "adminnav"
              }`}
            >
              Admin Policies List
            </p>
          </Link>
          <Link to="/admin/currency-value">
            {" "}
            <p
              className={` cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                path === "/admin/currency-value" && "adminnav"
              }`}
            >
              Approval Page
            </p>
          </Link>

          <Link to="">
            {" "}
            <p
              onClick={openLogoutPopup}
              className=" cursor-pointer text-white hover:bg-white hover:text-primary  py-2 px-3  mt-6 rounded-xl text-[17px]"
            >
              Logout
            </p>
          </Link>
        </span>
      </div>
      {/* // responsive nav */}

      <span className="md:hidden sm:hidden mt-6 flex justify-end ml-4 w-9  ">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[25px] h-[25px] object-contain"
          onClick={() => SetToggle(!toggle)}
        />

        <div
          className={`${!toggle ? "hidden" : "flex"}
      p-6 absolute top-20 right-0  min-w-[200px] rounded-xl  admin_sidebar z-50 bg-[#FCFCFC] text-black`}
        >
          <ul className="list-none flex justify-end items-start font-DMsans flex-1 flex-col">
            <span>
              <div className="flex  items-center relative gap-3">
                <p className="text-black font-montserrat font-medium text-[25px] px-2">
                  Menu
                </p>
              </div>
              <Link to="/">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-primary hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px] "  ${
                    path === "/" && "adminresnav"
                  }`}
                >
                  Home
                </p>
              </Link>
              <Link to="/admin/dashboard">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-primary hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px] "  ${
                    (path === "/admin/dashboard" ||
                      path === "/admin/active-users" ||
                      path === "/admin/male-users" ||
                      path === "/admin/female-users" ||
                      path === "/admin/successfull-married" ||
                      path === "/admin/deleted-users" ||
                      path === "/admin/CategoryA-users" ||
                      path === "/admin/categoryB-users" ||
                      path === "/admin/categoryC-users" ||
                      path === "/admin/banned-users" ||
                      path === "/admin/rejected-users" ||
                      path === "/admin/uncategorised-users") &&
                    "adminresnav"
                  }`}
                >
                  Dashboard
                </p>
              </Link>
              <Link to="/admin/user">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-primary hover:text-white  py-2 px-3 mt-6 rounded-xl text-[17px]  ${
                    path === "/admin/user" && "adminresnav"
                  }`}
                >
                  All Users
                </p>
              </Link>
              <Link to="/admin/currency-value">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-primary hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                    path === "/admin/currency-value" && "adminresnav"
                  }`}
                >
                  Currency Value
                </p>
              </Link>
              <Link to="/admin/approval-lists">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-primary hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                    path === "/admin/approval-lists" && "adminresnav"
                  }`}
                >
                  Approval Page
                </p>
              </Link>

              <Link to="/admin/report-lists">
                {" "}
                <p
                  className={` cursor-pointer text-black hover:bg-white hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px] ${
                    path === "/admin/report-lists" && "adminresnav"
                  }`}
                >
                  Manage Reports
                </p>
              </Link>
              <Link to="">
                {" "}
                <p
                  onClick={openLogoutPopup}
                  className=" cursor-pointer  hover:bg-primary hover:text-white  py-2 px-3  mt-6 rounded-xl text-[17px]"
                >
                  Logout
                </p>
              </Link>
            </span>
          </ul>
        </div>
      </span>
    </>
  );
};

export default Nav;
