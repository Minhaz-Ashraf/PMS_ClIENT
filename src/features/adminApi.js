import apiurl from "../utils";

export const getAllMbAgents = async () => {
  try {
    const response = await apiurl.get("/mb-agents");
    console.log(response, "api");
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const getAllMgAgents = async () => {
  try {
    const response = await apiurl.get("/mg-agents");
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const addNewAgent = async (agentData, update, addNew, aId) => {
  
  try {
    const response = await apiurl.post("/add-new-agent", agentData, {
      params:{
        update:update,
        isNew: addNew,
        id: aId,
      }
    });
    console.log("Agent added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding agent:", error);
    throw error;  
  }
};

export const  deleteAgent  = async (userId) =>{
  try{
    const response  = await apiurl.delete(`/deleteAgent/${userId}`)
    
    return response.data
  }catch(error){
    console.log("Error whle deleting agents",error)
  }

}



export const cancelPolicy = async (policyId) => {
  try {
    const response = await apiurl.put(`/cancelPolicy/${policyId}`);
    return response.data;
  } catch (error) {
    console.error("Error in cancelling policy:", error);
    throw error;  
  }
};

export const getCancelPolicy = async(page, limit) =>{
  try{
   const response = await apiurl.get('/get-cancelled-policy',{
    params:{page, limit}
   })
   console.log(response.data, "cab")
   return response.data;
  }catch(error){
    console.log("Error in fetching cancelled policy:", error);
     throw error
  }
}


export const getAllPolicy = async(page, limit, manufacturer) =>{
  try{
   const response = await apiurl.get('/get-all-policy',{
    params: { page, limit, manufacturer},
  
  })
   return response.data;
  }catch(error){
    console.log("Error in fetching all policies:", error);
     throw error
  }
}