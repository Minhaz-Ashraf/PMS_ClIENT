import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { formatDate } from './../helper/commonHelperFunc';
import { getPolicyById } from '../../Util/UtilityFunction';

const ViewPolicy = () => {

    const location = useLocation();
    const id = location.state.id
    const [policyData, setPolicyData] = useState()
   console.log(id, "check")
  useEffect(()=>{
    const getPolicies = async() =>{
      const res = await getPolicyById(id)
      setPolicyData(res?.data[0])
    }
    getPolicies()
  },[id])
  
  return (
<div className='md:px-32 mx-6'>
<h2 className="text-2xl font-bold text-black-600 mt-14 mb-4 text-center underline">
          360 Car Protect Extended Warranty Certificate
        </h2>
        <p className="mb-2 mt-16">
          <strong>Certificate No.:</strong> {policyData?.policyId}
        </p>
        <p className="mb-2">
          <strong>Certificate Issue Date:</strong> {formatDate(policyData?.createdAt)}
        </p>
        <p className="mb-2 pt-9">
          <strong>Name of Customer:</strong> {policyData?.customerName}
        </p>
        <p className="mb-2 pt-9">
          <strong>Customer GST No:</strong> {policyData?.customerGstNumber}
        </p>
        <p className="mb-2 pt-1">
          <strong>Address:</strong> {policyData?.address}
        </p>
        <p className="mb-2">
          <strong>Contact No.:</strong> {policyData?.contactNumber}
        </p>
        <p className="mb-2">
          <strong>Email Id:</strong> {policyData?.email}
        </p>
        <p className="mb-2">
          <strong>Pan Number:</strong> {policyData?.panNumber}
        </p>
        <p className="mb-2">
          <strong>Transaction Id:</strong> {policyData?.transactionId}
        </p>


        <div className="w-full flex md:flex-row sm:flex-row flex-col justify-between items-start">
          <span>
            <p className="mb-2 pt-6">
              <strong>Vehicle Model:</strong> {policyData?.vehicleModel}
            </p>

            <p className="mb-2">
              <strong>Variant:</strong> {policyData?.variant}
            
            </p>
            <p className="mb-2">
              <strong>Fuel Type:</strong> {policyData?.fuelType}
            </p>

            <p className="mb-2">
              <strong>Vehicle Purchase Date:</strong> {formatDate(policyData?.vehiclePurchaseDate)}
            </p>

            <p className="mb-2">
              <strong>Odometer Reading:</strong> {policyData?.odometerReading}
            </p>

            <p className="mb-2">
              <strong>Cooling-off Period:</strong> (30 days after the 360
              Car Protect Extended Warranty Start Date)
            </p>
          </span>

          <span>
            <p className="mb-2 pt-6">
              <strong>Vehicle Manufacturer:</strong> {policyData?.vehicleManufacturer}
            </p>

            <p className="mb-2">
              <strong>Vehicle Identification No. :</strong> {policyData?.vehicleIdNumber}
            </p>

            <p className="mb-2">
              <strong>Vehicle Engine No. :</strong> {policyData?.vehicleEngineNumber}
            </p>

            <p className="mb-2 ">
              <strong>Vehicle Registration No.:</strong> {policyData?.vehicleRegNumber}
            </p>
            <p className="mb-2 ">
              <strong>Hypothecation:</strong> {policyData?.hypothecation}
            </p>
            <p className="mb-2">
              <strong>Ex-Showroom Price of Vehicle:</strong> {policyData?.exshowroomPrice}
            </p>
          </span>
        </div>
        <span className="flex md:flex-row sm:flex-row flex-col  items-center justify-between">
          <p className="mb-2">
            <strong>360 Car Protect Extended Warranty Start Date:</strong>{" "}
            {policyData?.extWarrantyStartDate}
          </p>
          <p className="mb-2">
            <strong>360 Car Protect Extended Warranty End Date:</strong>{" "}
            {policyData?.extWarrantyEndDate}

          </p>
        </span>
        <div className="mb-4 overflow-x-scroll w-full">
          <table className="min-w-full bg-white mt-9">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal ">
                <th className="py-9 px-6 text-left border-2 border-black">
                  Product
                </th>
                <th className="py-9 px-6 text-left border-2 border-black">
                  Product Price (Rs)
                </th>
                <th className="py-9 px-6 text-left border-2 border-black">
                  GST @ 18%
                </th>
              
                <th className="py-9 px-6 text-left border-2 border-black">
                  Grand Total Price (incl. taxes) (Rs)
                </th>
              </tr>
            </thead>
            <tbody className="text-black text-sm font-medium">
              <tr className="border-b border-gray-200 ">
                <td className="py-3 px-6 text-left whitespace-nowrap border-2 border-black">
                  360 Car Protect Extended Warranty
                </td>
                <td className="py-5 px-6 border-2 border-black text-left">
                {policyData?.productPrice}

                </td>
                <td className="py-5 px-6 border-2 border-black text-left">
                {policyData?.gst}

                </td>
             
                <td className="py-5 border-2 border-black px-6 text-left">
                {policyData?.totalPrice}

                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-4 pt-12 flex flex-col text-end pb-16">
          <p>_________________________</p>
          <p>(Stamp &amp; Signature)</p>
          <p>For 360 Car Protect India LLP</p>
          <p>Name of Signatory: </p>
          <p>Location: </p>
          <p>Date: </p>
        </div>
</div> 
 )
}

export default ViewPolicy