import React from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
const AdminCards = ({name, agentId, link}) => {
    console.log(name, "card")
  return (
    <>

        <div className='bg-secondary flex flex-col items-center w-60 rounded-md pt-5 mt-6'>
           <p className='font-medium  '>{name} </p>
           <p className='font-medium pt-1'>{agentId}</p>
           <span className='text-white  bg-primary mt-2 px-14 py-2 cursor-pointer rounded-md'>View More</span>
           <div className='flex flex-row mt-4 gap-4 pb-9'>
            <span className='text-primary border border-primary px-4 py-1 flex items-center rounded-md'>
            Edit <span><MdOutlineModeEdit /></span>
            </span>
            <span className='text-primary  border border-primary px-4 py-1 flex items-center rounded-md '>
            Delete <span><RiDeleteBin6Line /></span>
            </span>
           </div>
        </div>
     
    </>
  )
}

export default AdminCards