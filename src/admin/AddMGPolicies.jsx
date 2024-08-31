import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import InputField from "../Components/Input";
import {
  addYearsEndDate,
  createdDate,
} from "../helper/commonHelperFunc";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllMbOptions,
  fetchAllMgOptions,
} from "../features/VehcleOptionsSlice";
import { useLocation } from "react-router-dom";
import { submitPolicy } from "../features/policySlice";

const AddMGPolicies = () => {
  const location = useLocation();
  const [policyData, setPolicydata] = useState({
    customerName: "",
    address: "",
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
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); 
  const userId = useSelector((state) => state.users.users._id); 
  const [availablePackages, setAvailablePackages] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);

  useEffect(() => {
    dispatch(fetchAllMgOptions());
    dispatch(fetchAllMbOptions());
  }, [dispatch]);

  const { mgData, mbData } = useSelector((state) => state.master);

  useEffect(() => {
    const policyType = location.state.policyType;

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
    setPolicydata((data) => ({
      ...data,
      [name]: value,
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
          const packages = Object.keys(mbDataEntry).filter((key) =>
            ["fourthYear", "prevPlusFifthYear", "prevPlusSixthYear"].includes(key)
          );
          setAvailablePackages(packages);
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
        entryAge = "0-30";
      } else if (dayDiff > 30 && dayDiff <= 180) {
        entryAge = "31-180";
      } else if (dayDiff > 180 && dayDiff <= 365) {
        entryAge = "181-365";
      } else if (dayDiff > 365 && dayDiff <= 700) {
        entryAge = "366-700";
      } else if (dayDiff > 700 && dayDiff <= 1065) {
        entryAge = "731-1065";
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
          const packages = Object.keys(mgDataEntry).filter((key) =>
            [
              "twelveMonthPerhundredK_KMS",
              "twentyFourMonthPerhundredK_KMS",
              "twelveMonthPerUnlimited_KMS",
              "twentyFourMonthPerUnlimited_KMS",
            ].includes(key)
          );
          setAvailablePackages(packages);
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
    const totalPrice = price + gstValue;

    setPolicydata((data) => ({
      ...data,
      gst: gstValue,
      totalPrice: totalPrice,
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
      "contactNumber",
      // Add more required fields as needed
    ];

    requiredFields.forEach((field) => {
      if (!policyData[field]) {
        newErrors[field] = `${field} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit =  (e) => {
    e.preventDefault();
    if (validateFields()) {
      try {
      
                
        const response =  dispatch(submitPolicy({ userId, policyData, token }));
        
        if (submitPolicy.fulfilled.match(response)) {
          console.log('Policy data submitted successfully:', response.payload);
          setSuccessMessage('Policy data submitted successfully!');
           navigate('/admin/dashboard')
      
        } else {
          console.error('Failed to submit policy data:', response.payload);
          setErrors(response.payload);
        }
      } catch (err) {
        console.error('Error submitting policy data:', err.message);
        setErrors(err.message);
      }
    } else {
      console.log('Form data is invalid. Please correct the errors.');
    }
  };
  

  const formattedDate = createdDate();
  const uniqueModels = Array.from(
    new Map(
      (policyData.vehicleManufacturer === "Morris Garage" ? mgData : mbData)
        .map((item) => [item.model, item])
    ).values()
  );
  return (
    <>
      <div className="fixed">
        <span className="absolute">
          <Nav />
        </span>
      </div>

      <span className="flex flex-row items-center justify-between mx-36 font-head ">
        <p className="text-[23px] font-semibold pt-12 ml-[14%]">
          Add New Policy
        </p>
        <p className="text-[20px] font-medium pt-12">
          Certificate Issues Date - {formattedDate}
        </p>
      </span>
      <div className="ml-[22%] pt-12 ">
      <form onSubmit={handleSubmit}>

        <p className="text-[20px] font-head font-semibold pt-10">
          Customer Personal Details
        </p>
        <div className="flex md:flex-row sm:flex-row flex-col font-body gap-6">
          <span className="w-96">
            <div className="pt-3">
              <label className="font-semibold">Customer Name</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Customer Name"
                name="customerName"
                onchange={handleInput}
                type="text"
                value={policyData.customerName}
              />
              {errors.customerName && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.customerName}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">Contact Number</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Contact Number"
                name="contactNumber"
                onchange={handleInput}
                type="text"
                value={policyData.contactNumber}
              />
              {errors.contactNumber && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.contactNumber}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">PAN Number</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Agent Id"
                name="panNumber"
                onchange={handleInput}
                type="text"
                value={policyData.panNumber}
              />
              {errors.panNumber && (
                <p className="text-red-500 mt-1 text-sm">{errors.panNumber}</p>
              )}
            </div>
          </span>
          <span className="w-96">
            <div className="pt-3">
              <label className="font-semibold">Address</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Address"
                name="address"
                onchange={handleInput}
                type="text"
                value={policyData.address}
              />
              {errors.address && (
                <p className="text-red-500 mt-1 text-sm">{errors.address}</p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">Email ID</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Email"
                name="email"
                onchange={handleInput}
                type="email"
                value={policyData.email}
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">Customer GST Number</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Contact Number"
                name="customerGstNumber"
                onchange={handleInput}
                type="text"
                value={policyData.customerGstNumber}
              />
              {errors.customerGstNumber && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.customerGstNumber}
                </p>
              )}
            </div>
          </span>
        </div>

        <p className="text-[20px] font-head font-semibold pt-10">
          Vehicle Details
        </p>
        <div className="flex md:flex-row sm:flex-row flex-col font-body gap-6">
          <span className="w-96">
            <div className="pt-3">
              <label className="font-semibold">Model</label>
              <select
                className="w-full h-10 bg-input px-3 outline-none"
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
              {errors.vehicleModel && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.vehicleModel}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">Variant (Optional)</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Model"
                name="variant"
                onchange={handleInput}
                type="text"
                value={policyData.variant}
              />
              {errors.variant && (
                <p className="text-red-500 mt-1 text-sm">{errors.variant}</p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">Fuel Type</label>
              <select
                className="w-full h-10 bg-input px-3"
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
              {errors.fuelType && (
                <p className="text-red-500 mt-1 text-sm">{errors.fuelType}</p>
              )}
            </div>

            <div className="pt-3">
              <label className="font-semibold">Vehicle Engine Number</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Vehicle Engine Number"
                name="vehicleEngineNumber"
                onchange={handleInput}
                type="text"
                value={policyData.vehicleEngineNumber}
              />
              {errors.vehicleEngineNumber && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.vehicleEngineNumber}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">EW Vehicle Entry Age</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="EW Vehicle Entry Age"
                name="ewVehicleEntryAge"
                onchange={handleInput}
                type="text"
                value={policyData.ewVehicleEntryAge}
              />
              {errors.ewVehicleEntryAge && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.ewVehicleEntryAge}
                </p>
              )}
            </div>

            <div className="pt-3">
              <label className="font-semibold">Price</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Price"
                name="price"
                onchange={handleInput}
                type="text"
                value={policyData.price}
              />
              {errors.price && (
                <p className="text-red-500 mt-1 text-sm">{errors.price}</p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">Odometer Reading</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Odomenter Reading"
                name="odometerReading"
                onchange={handleInput}
                type="text"
                value={policyData.odometerReading}
              />
              {errors.odometerReading && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.odometerReading}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">
                360 Car Protect Extended Warranty Start Date
              </label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Warranty Start Date"
                name="extWarrantyStartDate"
                onchange={handleInput}
                type="text"
                value={policyData.extWarrantyStartDate}
              />
              {errors.extWarrantyStartDate && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.extWarrantyStartDate}
                </p>
              )}
            </div>
            <span className="font-medium">Cooling Off Period :- 30 Days</span>
          </span>
          <span className="w-96">
            <div className="pt-3">
              <label className="font-semibold">Vehicle Manufacturer</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                name="vehicleManufacturer"
                type="text"
                value={policyData.vehicleManufacturer}
              />
              {errors.vehicleManufacturer && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.vehicleManufacturer}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">
                Vehicle Identification Number
              </label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Ex Showroom Price "
                name="vehicleIdNumber"
                onchange={handleInput}
                type="text"
                value={policyData.vehicleIdNumber}
              />
              {errors.vehicleIdNumber && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.vehicleIdNumber}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">
                Vehicle Registration Number
              </label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Vehicle Registration Number"
                name="vehicleRegNumber"
                onchange={handleInput}
                type="text"
                value={policyData.vehicleRegNumber}
              />
              {errors.vehicleRegNumber && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.vehicleRegNumber}
                </p>
              )}
            </div>

            <div className="pt-3">
              <label className="font-semibold">Vehicle Purchase Date</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Vehicle Registration Number"
                name="vehiclePurchaseDate"
                onchange={handleInput}
                type="date"
                value={policyData.vehiclePurchaseDate}
              />
              {errors.vehiclePurchaseDate && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.vehiclePurchaseDate}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">Type of Packages</label>
              <select
                className="w-full h-10 bg-input px-3 outline-none"
                name="typeOfPackage"
                onChange={handlePackageChange}
                value={policyData.typeOfPackage}
              >
                <option value="">Select Package</option>
                {availablePackages.map((pkg, index) => (
                  <option key={index} value={pkg}>
                    {pkg}
                  </option>
                ))}
              </select>
              {errors.typeOfPackage && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.typeOfPackage}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">
                Ex-Showroom Price of Vehicle
              </label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Ex Showroom Price "
                name="exshowroomPrice"
                onchange={handleInput}
                type="text"
                value={policyData.exshowroomPrice}
              />
              {errors.exshowroomPrice && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.exshowroomPrice}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">Hypothecation (Optional)</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Hypothecation"
                name="hypothecation"
                onchange={handleInput}
                type="text"
                value={policyData.hypothecation}
              />
              {errors.hypothecation && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.hypothecation}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">
                360 Car Protect Extended Warranty Start Date
              </label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Extended Warranty End Date"
                name="extWarrantyEndDate"
                onchange={handleInput}
                type="text"
                value={policyData.extWarrantyEndDate}
              />
              {errors.extWarrantyEndDate && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.extWarrantyEndDate}
                </p>
              )}
            </div>
          </span>
        </div>

        <p className="text-[20px] font-head font-semibold pt-10">
          Customer Billing Details
        </p>
        <div className="flex md:flex-row sm:flex-row flex-col font-body gap-6">
          <span className="w-96">
            <div className="pt-3">
              <label className="font-semibold">Product</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Extended Warranty End Date"
                name="product"
                onchange={handleInput}
                type="text"
                value={policyData.product}
              />
              {errors.product && (
                <p className="text-red-500 mt-1 text-sm">{errors.product}</p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">GST @ 18%</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="GST"
                name="gst"
                onchange={handleInput}
                type="text"
                value={policyData.gst}
              />
              {errors.gst && (
                <p className="text-red-500 mt-1 text-sm">{errors.gst}</p>
              )}
            </div>
          </span>

          <span className="w-96">
            <div className="pt-3">
              <label className="font-semibold">Product Price</label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Product Price"
                name="productPrice"
                onchange={handleInput}
                type="text"
                value={policyData.productPrice}
              />
              {errors.productPrice && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.productPrice}
                </p>
              )}
            </div>
            <div className="pt-3">
              <label className="font-semibold">
                Grand Total Price (incl. Taxes)
              </label>
              <InputField
                className="w-full h-10 bg-input px-3 outline-none"
                placeholder="Extended Warranty End Date"
                name="totalPrice"
                onchange={handleInput}
                type="text"
                value={policyData.totalPrice}
              />
              {errors.totalPrice && (
                <p className="text-red-500 mt-1 text-sm">{errors.totalPrice}</p>
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

export default AddMGPolicies;
