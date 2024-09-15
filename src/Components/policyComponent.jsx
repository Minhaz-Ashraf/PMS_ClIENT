import React, { useEffect, useState } from "react";
import Nav from "../admin/Nav";
import InputField from "./Input";
import {
  addYearsEndDate,
  createdDate,
  formatDate,
  formatFieldName,
} from "../helper/commonHelperFunc";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllMbOptions,
  fetchAllMgOptions,
} from "../features/VehcleOptionsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { submitPolicy } from "../features/policySlice";
import SideNav from "../agent/SideNav";
import { getPolicyById } from "../../Util/UtilityFunction";
import { toast } from "react-toastify";

const PolicyComponenet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [policyData, setPolicydata] = useState({
    customerName: "",
    address: "",
    email: "",
    panNumber: "",
    contactNumber: "",
    customerGstNumber: "",
    vehicleManufacturer: "",
    vehicleModel: "",
    ewVehicleEntryAge: "",
    vehicleEngineNumber: "",
    vehicleIdNumber: "",
    vehicleRegNumber: "",
    fuelType: "",
    vehiclePurchaseDate: "",
    exshowroomPrice: "",
    odometerReading: "",
    coolingOffPeriod: "30 days",
    extWarrantyStartDate: "",
    extWarrantyEndDate: "",
    product: "360 Car Protect Warranty",
    typeOfPackage: "",
    productPrice: "",
    gst: "",
    totalPrice: "",
    price: "",
    variant: "",
    hypothecation: "",
    transactionId: "",
  });
  const dispatch = useDispatch();
  const policyType = location?.state?.policyType;
  const { mgData, mbData } = useSelector((state) => state.master);
  const token = useSelector((state) => state.auth.token);
  const { _id, roleType } = useSelector((state) => state.users.users);
  const update = location?.state?.update;
  const addNew = location?.state?.addNew;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userId = _id;
  const [availablePackages, setAvailablePackages] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [policyDataGet, setPolicyDataGet] = useState();
  const [errors, setErrors] = useState({});
  const [isEmailValid, setEmailValid] = useState("");
  const [isCreatedDate, setIsCreatedDate] = useState("");
  const id = location?.state?.id;
  const [pId, setPid] = useState();
  const [maxDate, setMaxDate] = useState("");
  useEffect(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
  }, []);
  useEffect(() => {
    dispatch(fetchAllMgOptions());
    dispatch(fetchAllMbOptions());
  }, [dispatch]);
  useEffect(() => {
    const getPolicies = async () => {
      const res = await getPolicyById(id);
      console.log(res);
      setPid(res?.data[0]?.policyId);
      setIsCreatedDate(res?.data[0]?.createdAt);
      setPolicyDataGet(res.data);
    };
    getPolicies();
  }, [id]);
  const getData = () => {
    if (policyDataGet) {
      setPolicydata({
        customerName: policyDataGet[0].customerName || "",
        address: policyDataGet[0].address || "",
        email: policyDataGet[0].email || "",
        panNumber: policyDataGet[0].panNumber || "",
        contactNumber: policyDataGet[0].contactNumber || "",
        customerGstNumber: policyDataGet[0].customerGstNumber || "",
        vehicleManufacturer: policyDataGet[0].vehicleManufacturer || "",
        vehicleModel: policyDataGet[0].vehicleModel || "",
        ewVehicleEntryAge: policyDataGet[0].ewVehicleEntryAge || "",
        vehicleEngineNumber: policyDataGet[0].vehicleEngineNumber || "",
        vehicleIdNumber: policyDataGet[0].vehicleIdNumber || "",
        vehicleRegNumber: policyDataGet[0].vehicleRegNumber || "",
        fuelType: policyDataGet[0].fuelType || "",
        vehiclePurchaseDate: policyDataGet[0].vehiclePurchaseDate || "",
        exshowroomPrice: policyDataGet[0].exshowroomPrice || "",
        odometerReading: policyDataGet[0].odometerReading || "",
        coolingOffPeriod: policyDataGet[0].coolingOffPeriod || "30 days",
        extWarrantyStartDate: policyDataGet[0].extWarrantyStartDate || "",
        extWarrantyEndDate: policyDataGet[0].extWarrantyEndDate || "",
        product: policyDataGet[0].product || "360 Car Protect Warranty",
        typeOfPackage: policyDataGet[0].typeOfPackage || "",
        productPrice: policyDataGet[0].productPrice || "",
        gst: policyDataGet[0].gst || "",
        totalPrice: policyDataGet[0].totalPrice || "",
        price: policyDataGet[0].price || "",
        variant: policyDataGet[0].variant || "",
        hypothecation: policyDataGet[0].hypothecation || "",
         transactionId: policyDataGet[0]?.transactionId || "",


      });
    }
  };
  useEffect(() => {
    getData();
  }, [policyDataGet]);

  useEffect(() => {
    if (policyType === "MG") {
      setPolicydata((data) => ({
        ...data,
        vehicleManufacturer: "Morris Garage",
      }));
    } else if (policyType === "MB") {
      setPolicydata((data) => ({
        ...data,
        vehicleManufacturer: "Mercedes-Benz",
      }));
    }
  }, [location?.state?.policyType]);

  useEffect(() => {
    if (policyData.vehicleManufacturer === "Mercedes-Benz") {
      // Fetch MB Data
      setModelOptions(mbData.map((item) => item.model));
    } else if (policyData.vehicleManufacturer === "Morris Garage") {
      // Fetch MG Data
      setModelOptions(mgData.map((item) => item.model));
    }
  }, [policyData.vehicleManufacturer, mgData, mbData]);

  const handleInput = (e) => {
    const { value, name } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
    const updatedValue = name === "panNumber" || name === "transactionId" ||  name === "customerGstNumber" ? value.toUpperCase() : value;

    setPolicydata((data) => ({
      ...data,
      [name]: updatedValue,
    }));

    if (name === "vehiclePurchaseDate") {
      const purchaseDate = new Date(value);
      const extWarrantyStartDate = new Date(
        purchaseDate.setFullYear(purchaseDate.getFullYear() + 3)
      );
      const formattedDate = `${String(extWarrantyStartDate.getDate()).padStart(
        2,
        "0"
      )}-${String(extWarrantyStartDate.getMonth() + 1).padStart(
        2,
        "0"
      )}-${extWarrantyStartDate.getFullYear()}`;

      setPolicydata((data) => ({
        ...data,
        extWarrantyStartDate: formattedDate,
      }));
    }

    // Trigger age calculation and update fields based on input
    if (name === "vehiclePurchaseDate" || name === "vehicleModel") {
      handleDateAndModelChange(value, name);
    }
    if (name === "typeOfPackage") {
      updatePriceBasedOnPackage(value);
    }
  };

  const packageMappings = {
    fourthYear: "4th Year",
    prevPlusFifthYear: "4th + 5th Year",
    prevPlusSixthYear: "4th + 5th + 6th Year",
    twelveMonthPerhundredK_KMS: "12 Month / 100 KMS",
    twentyFourMonthPerhundredK_KMS: "24 Month / 100 KMS",
    twelveMonthPerUnlimited_KMS: "12 Month / Unlimited KMS",
    twentyFourMonthPerUnlimited_KMS: "24 Month / Unlimited KMS",
  };

  const handleDateAndModelChange = () => {
    const currentDate = new Date();
    const purchaseDate = new Date(policyData.vehiclePurchaseDate);
    const model = policyData.vehicleModel;

    // Calculate the difference in days
    const timeDiff = currentDate - purchaseDate;
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let entryAge = "Not applicable";

    if (policyData.vehicleManufacturer === "Mercedes-Benz") {
      // Calculate entry age for Mercedes-Benz
      const monthDiff =
        currentDate.getMonth() -
        purchaseDate.getMonth() +
        12 * (currentDate.getFullYear() - purchaseDate.getFullYear());

      if (monthDiff <= 6) {
        entryAge = "0 - 6 Months";
      } else if (monthDiff > 6 && monthDiff <= 12) {
        entryAge = "6 - 12 Months";
      } else if (monthDiff > 12 && monthDiff <= 24) {
        entryAge = "1 to 2 year";
      } else if (monthDiff > 24 && monthDiff <= 36) {
        entryAge = "2 to 3 year";
      }

      const modelData = mbData.find((item) => item.model === model);
      if (modelData && entryAge !== "Not applicable") {
        setPolicydata((data) => ({
          ...data,
          ewVehicleEntryAge: entryAge,
        }));

        const mbDataEntry = mbData.find(
          (item) => item.model === model && item.entryAge === entryAge
        );

        if (mbDataEntry) {
          // Store original keys in the state
          const originalPackages = Object.keys(mbDataEntry).filter((key) =>
            ["fourthYear", "prevPlusFifthYear", "prevPlusSixthYear"].includes(
              key
            )
          );

          // Convert original keys to user-friendly text
          const displayPackages = originalPackages.map((key) => ({
            value: key,
            label: packageMappings[key],
          }));

          setAvailablePackages(displayPackages);
        } else {
          setAvailablePackages([]);
        }
      } else {
        setPolicydata((data) => ({
          ...data,
          ewVehicleEntryAge: "Not applicable",
        }));
        setAvailablePackages([]);
      }
    } else if (policyData.vehicleManufacturer === "Morris Garage") {
      // Calculate entry age for Morris Garage
      if (dayDiff <= 30) {
        entryAge = "0-30 days";
      } else if (dayDiff > 30 && dayDiff <= 180) {
        entryAge = "31-180 days";
      } else if (dayDiff > 180 && dayDiff <= 365) {
        entryAge = "181-365 days";
      } else if (dayDiff > 365 && dayDiff <= 700) {
        entryAge = "366-700 days";
      } else if (dayDiff > 700 && dayDiff <= 1065) {
        entryAge = "731-1065 days";
      }

      const modelData = mgData.find((item) => item.model === model);
      if (modelData && entryAge !== "Not applicable") {
        setPolicydata((data) => ({
          ...data,
          ewVehicleEntryAge: entryAge,
        }));

        const mgDataEntry = mgData.find(
          (item) => item.model === model && item.entryAge === entryAge
        );

        if (mgDataEntry) {
          // Store original keys in the state
          const originalPackages = Object.keys(mgDataEntry).filter((key) =>
            [
              "twelveMonthPerhundredK_KMS",
              "twentyFourMonthPerhundredK_KMS",
              "twelveMonthPerUnlimited_KMS",
              "twentyFourMonthPerUnlimited_KMS",
            ].includes(key)
          );

          // Convert original keys to user-friendly text
          const displayPackages = originalPackages.map((key) => ({
            value: key,
            label: packageMappings[key],
          }));

          setAvailablePackages(displayPackages);
        } else {
          setAvailablePackages([]);
        }
      } else {
        setPolicydata((data) => ({
          ...data,
          ewVehicleEntryAge: "Not applicable",
        }));
        setAvailablePackages([]);
      }
    }
  };

  useEffect(() => {
    if (policyData.vehiclePurchaseDate && policyData.vehicleModel) {
      handleDateAndModelChange();
    }
  }, [policyData.vehiclePurchaseDate, policyData.vehicleModel]);

  const calculateAndSetPriceDetails = (price, gstRate) => {
    const gstValue = price * (gstRate / 100);
    console.log(gstValue + price, "check");

    const totalPrice = parseInt(price) + parseInt(gstValue);

    setPolicydata((data) => ({
      ...data,
      gst: gstValue.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    }));
  };

  const handlePackageChange = (e) => {
    const selectedPackage = e.target.value;
    setPolicydata((data) => ({
      ...data,
      typeOfPackage: selectedPackage,
    }));

    let price;
    if (policyData.vehicleManufacturer === "Mercedes-Benz") {
      const modelData = mbData.find(
        (item) =>
          item.model === policyData.vehicleModel &&
          item.entryAge === policyData.ewVehicleEntryAge
      );

      if (modelData) {
        price = modelData[selectedPackage];
      }
    } else if (policyData.vehicleManufacturer === "Morris Garage") {
      const modelData = mgData.find(
        (item) =>
          item.model === policyData.vehicleModel &&
          item.entryAge === policyData.ewVehicleEntryAge
      );

      if (modelData) {
        price = modelData[selectedPackage];
      }
    }

    setPolicydata((data) => ({
      ...data,
      price: price || "",
      productPrice: price || "",
    }));

    calculateAndSetPriceDetails(price || 0, 18);

    let duration = 0;
    if (selectedPackage === "fourthYear") {
      duration = 1;
    } else if (selectedPackage === "prevPlusFifthYear") {
      duration = 2;
    } else if (selectedPackage === "prevPlusSixthYear") {
      duration = 3;
    } else if (selectedPackage === "twelveMonthPerhundredK_KMS") {
      duration = 1;
    } else if (selectedPackage === "twentyFourMonthPerhundredK_KMS") {
      duration = 2;
    } else if (selectedPackage === "twelveMonthPerUnlimited_KMS") {
      duration = 1;
    } else if (selectedPackage === "twentyFourMonthPerUnlimited_KMS") {
      duration = 2;
    }

    const startDate = new Date(
      policyData.extWarrantyStartDate.split("-").reverse().join("-")
    );
    const endDate = addYearsEndDate(startDate, duration);

    const formattedEndDate = `${String(endDate.getDate()).padStart(
      2,
      "0"
    )}-${String(endDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${endDate.getFullYear()}`;

    setPolicydata((data) => ({
      ...data,
      extWarrantyEndDate: formattedEndDate,
    }));
  };

  const validateFields = () => {
    let newErrors = {};
    const requiredFields = [
      "customerName",
      "address",
      "email",
      "panNumber",
      "contactNumber",
      "customerGstNumber",
      "vehicleManufacturer",
      "vehicleModel",
      "ewVehicleEntryAge",
      "vehicleEngineNumber",
      "vehicleIdNumber",
      "vehicleRegNumber",
      "fuelType",
      "vehiclePurchaseDate",
      "exshowroomPrice",
      "odometerReading",
      "extWarrantyStartDate",
      "extWarrantyEndDate",
      "typeOfPackage",
      "productPrice",
      "gst",
      "totalPrice",
      "price",
      "transactionId",
    ];

    requiredFields.forEach((field) => {
      if (!policyData[field]) {
        newErrors[field] = `Please provide a value for ${formatFieldName(
          field
        )}.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      try {
        if (emailRegex.test(policyData.email)) {
          setEmailValid("");
        } else {
          setEmailValid("Please Enter a Valid Email");
          return;
        }
        const response = await dispatch(
          submitPolicy({ userId, policyData, token, addNew, update, pId })
        ).unwrap();
        if (submitPolicy.fulfilled.match(response)) {
          setPolicydata({
            customerName: "",
            address: "",
            email: "",
            panNumber: "",
            contactNumber: "",
            customerGstNumber: "",
            vehicleManufacturer: "",
            vehicleModel: "",
            ewVehicleEntryAge: "",
            vehicleEngineNumber: "",
            vehicleIdNumber: "",
            vehicleRegNumber: "",
            fuelType: "",
            vehiclePurchaseDate: "",
            exshowroomPrice: "",
            odometerReading: "",
            coolingOffPeriod: "30 days",
            extWarrantyStartDate: "",
            extWarrantyEndDate: "",
            product: "360 Car Protect Warranty",
            typeOfPackage: "",
            productPrice: "",
            gst: "",
            totalPrice: "",
            price: "",
            variant: "",
            hypothecation: "",
            transactionId: "",
          });
        }
        toast.success(response?.message);
        navigate(-1);
      } catch (err) {
        console.error("Error submitting policy data:", err.message);
        toast.error(err.message);
        setErrors(err.message);
      }
    } else {
      console.log("Form data is invalid. Please correct the errors.");
      toast.info("Form data is invalid. Please correct the errors.");
    }
  };

  const formattedDate = createdDate();
  const uniqueModels = Array.from(
    new Map(
      (policyData.vehicleManufacturer === "Morris Garage"
        ? mgData
        : mbData
      ).map((item) => [item.model, item])
    ).values()
  );
  return (
    <>
      <div className="fixed">
        <span className="absolute">
          {roleType === "0" ? <Nav /> : <SideNav />}
        </span>
      </div>

      <span className="flex md:flex-row flex-col md:items-center justify-between md:mx-36 mx-6 font-head md:pt-0 pt-12 ">
        <p className="md:text-[23px] text-[18px] font-semibold pt-12 md:ml-[14%] sm:ml-[34%]">
          {id ? "Update" : "Add"} {policyData?.vehicleManufacturer} Policy
        </p>
        <p className="md:text-[18px] text-[16px] font-medium md:pt-12 pt-4 sm:ml-[34%]">
          Certificate Issues Date -{" "}
          {id ? formatDate(isCreatedDate) : formattedDate}
        </p>
      </span>
      <div className="md:ml-[22%] sm:ml-[34%] md:mx-0 sm:mx-0 mx-6 pt-12 ">
        <form onSubmit={handleSubmit}>
          <p className="text-[20px] font-head font-semibold pb-4">
            Customer Personal Details
          </p>
          <div className="flex md:flex-row sm:flex-row flex-col font-body md:gap-12 sm:gap-12">
            <span className="md:w-[40%] sm:w-[40%]">
              <div className="pt-3 pb-2 ">
                <label className="font-semibold">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2 "
                  placeholder="Customer Name"
                  name="customerName"
                  onchange={handleInput}
                  type="text"
                  value={policyData.customerName}
                />
                {errors?.customerName && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.customerName}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2 ">
                <label className="font-semibold">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2 "
                  placeholder="Contact Number"
                  name="contactNumber"
                  onchange={handleInput}
                  type="text"
                  value={policyData?.contactNumber}
                />
                {errors?.contactNumber && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.contactNumber}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2 "
                  placeholder="Agent Id"
                  name="panNumber"
                  onchange={handleInput}
                  type="text"
                  value={policyData.panNumber}
                />
                {errors?.panNumber && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.panNumber}
                  </p>
                )}
              </div>
            </span>
            <span className="md:w-[40%] sm:w-[40%]">
              <div className="pt-3 pb-2 ">
                <label className="font-semibold">
                  Address <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Address"
                  name="address"
                  onchange={handleInput}
                  type="text"
                  value={policyData.address}
                />
                {errors?.address && (
                  <p className="text-red-500 mt-1 text-sm">{errors?.address}</p>
                )}
              </div>
              <div className="pt-3 pb-2 ">
                <label className="font-semibold">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2 "
                  placeholder="Email"
                  name="email"
                  onchange={handleInput}
                  type="email"
                  value={policyData.email}
                />
                {errors?.email && (
                  <p className="text-red-500 mt-1 text-sm">{errors?.email}</p>
                )}
                <p className="text-red-500 text-sm font-DMsan">
                  {isEmailValid}
                </p>
              </div>
              <div className="pt-3 pb-2 ">
                <label className="font-semibold">
                  Customer GST Number <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2 "
                  placeholder="Contact Number"
                  name="customerGstNumber"
                  onchange={handleInput}
                  type="text"
                  value={policyData.customerGstNumber}
                />
                {errors?.customerGstNumber && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.customerGstNumber}
                  </p>
                )}
              </div>
            </span>
          </div>

          <p className="text-[20px] font-head font-semibold pt-10">
            Vehicle Details
          </p>
          <div className="flex md:flex-row sm:flex-row flex-col font-body gap-12">
            <span className="md:w-[40%] sm:w-[40%]">
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Model <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  name="vehicleModel"
                  onChange={handleInput}
                  value={policyData.vehicleModel}
                >
                  <option value="">Select Model</option>
                  {uniqueModels.map((item, index) => (
                    <option key={index} value={item.model}>
                      {item.model}
                    </option>
                  ))}
                </select>
                {errors?.vehicleModel && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.vehicleModel}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">Variant (Optional)</label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Variant"
                  name="variant"
                  onchange={handleInput}
                  type="text"
                  value={policyData.variant}
                />
                {errors?.variant && (
                  <p className="text-red-500 mt-1 text-sm">{errors?.variant}</p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Fuel Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full h-10 bg-secondary rounded-md px-3 mt-2"
                  name="fuelType"
                  value={policyData.fuelType}
                  onChange={handleInput}
                  autoComplete="off"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="petrol">Petrol </option>
                  <option value="diesel">Diesel</option>
                  <option value="EV">Electric Vehicle</option>
                </select>
                {errors?.fuelType && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.fuelType}
                  </p>
                )}
              </div>

              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Vehicle Engine Number <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Vehicle Engine Number"
                  name="vehicleEngineNumber"
                  onchange={handleInput}
                  type="text"
                  value={policyData.vehicleEngineNumber}
                />
                {errors?.vehicleEngineNumber && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.vehicleEngineNumber}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  EW Vehicle Entry Age <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="EW Vehicle Entry Age"
                  name="ewVehicleEntryAge"
                  onchange={handleInput}
                  type="text"
                  value={policyData.ewVehicleEntryAge}
                />
                {errors?.ewVehicleEntryAge && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.ewVehicleEntryAge}
                  </p>
                )}
              </div>

              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Price <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Price"
                  name="price"
                  type="text"
                  value={policyData?.price}
                />
                {errors?.price && (
                  <p className="text-red-500 mt-1 text-sm">{errors?.price}</p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Odometer Reading <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Odomenter Reading"
                  name="odometerReading"
                  onchange={handleInput}
                  type="text"
                  value={policyData?.odometerReading}
                />
                {errors?.odometerReading && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.odometerReading}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  360 Car Protect Extended Warranty Start Date
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Warranty Start Date"
                  name="extWarrantyStartDate"
                  type="text"
                  value={policyData?.extWarrantyStartDate}
                />
                {errors?.extWarrantyStartDate && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.extWarrantyStartDate}
                  </p>
                )}
              </div>
              <span className="font-medium">Cooling Off Period :- 30 Days</span>
            </span>
            <span className="md:w-[40%] sm:w-[40%]">
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Vehicle Manufacturer <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  name="vehicleManufacturer"
                  type="text"
                  value={policyData.vehicleManufacturer}
                />
                {errors?.vehicleManufacturer && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.vehicleManufacturer}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Vehicle Identification Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Ex Showroom Price "
                  name="vehicleIdNumber"
                  onchange={handleInput}
                  type="text"
                  value={policyData.vehicleIdNumber}
                />
                {errors?.vehicleIdNumber && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.vehicleIdNumber}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Vehicle Registration Number{" "}
                  <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Vehicle Registration Number"
                  name="vehicleRegNumber"
                  onchange={handleInput}
                  type="text"
                  value={policyData.vehicleRegNumber}
                />
                {errors?.vehicleRegNumber && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.vehicleRegNumber}
                  </p>
                )}
              </div>

              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Vehicle Purchase Date <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Vehicle Registration Number"
                  name="vehiclePurchaseDate"
                  onchange={handleInput}
                  type="date"
                  id="date"
                  max={maxDate}
                  value={policyData.vehiclePurchaseDate}
                />
                {errors?.vehiclePurchaseDate && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.vehiclePurchaseDate}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Type of Packages <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  name="typeOfPackage"
                  onChange={handlePackageChange}
                  value={policyData.typeOfPackage}
                >
                  <option value="">Select Package</option>
                  {availablePackages.length > 0 ? (
                    availablePackages.map((pkg, index) => (
                      <option key={index} value={pkg.value}>
                        {pkg.label}
                      </option>
                    ))
                  ) : (
                    <option disabled>No packages available</option>
                  )}
                </select>
                {errors?.typeOfPackage && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.typeOfPackage}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Ex-Showroom Price of Vehicle{" "}
                  <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Ex Showroom Price "
                  name="exshowroomPrice"
                  onchange={handleInput}
                  type="text"
                  value={policyData.exshowroomPrice}
                />
                {errors?.exshowroomPrice && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.exshowroomPrice}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Hypothecation (Optional)
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Hypothecation"
                  name="hypothecation"
                  onchange={handleInput}
                  type="text"
                  value={policyData.hypothecation}
                />
                {errors?.hypothecation && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.hypothecation}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  360 Car Protect Extended Warranty Start Date{" "}
                  <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Extended Warranty End Date"
                  name="extWarrantyEndDate"
                  type="text"
                  value={policyData.extWarrantyEndDate}
                />
                {errors?.extWarrantyEndDate && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.extWarrantyEndDate}
                  </p>
                )}
              </div>
            </span>
          </div>

          <p className="text-[20px] font-head font-semibold pt-10">
            Customer Billing Details
          </p>
          <div className="flex md:flex-row sm:flex-row flex-col font-body md:gap-12 sm:gap-12">
            <span className="md:w-[40%] sm:w-[40%]">
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Product <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Extended Warranty End Date"
                  name="product"
                  type="text"
                  value={policyData.product}
                />
                {errors?.product && (
                  <p className="text-red-500 mt-1 text-sm">{errors?.product}</p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  GST @ 18% <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="GST"
                  name="gst"
                  type="text"
                  value={policyData.gst}
                />
                {errors?.gst && (
                  <p className="text-red-500 mt-1 text-sm">{errors?.gst}</p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Transaction Id<span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Transaction Id"
                  name="transactionId"
                  type="text"
                  value={policyData.transactionId}
                  onchange={handleInput}
                />
                {errors?.transactionId && (
                  <p className="text-red-500 mt-1 text-sm">{errors?.transactionId}</p>
                )}
              </div>
            </span>

            <span className="md:w-[40%] sm:w-[40%]">
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Product Price <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Product Price"
                  name="productPrice"
                  type="text"
                  value={policyData.productPrice}
                />
                {errors?.productPrice && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.productPrice}
                  </p>
                )}
              </div>
              <div className="pt-3 pb-2">
                <label className="font-semibold">
                  Grand Total Price (incl. Taxes){" "}
                  <span className="text-red-500">*</span>
                </label>
                <InputField
                  className="w-full h-10 bg-secondary rounded-md px-3 outline-none mt-2"
                  placeholder="Extended Warranty End Date"
                  name="totalPrice"
                  type="text"
                  value={policyData.totalPrice}
                />
                {errors?.totalPrice && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors?.totalPrice}
                  </p>
                )}
              </div>
            </span>
          </div>

          <div className=" mt-12 mb-20">
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

export default PolicyComponenet;
