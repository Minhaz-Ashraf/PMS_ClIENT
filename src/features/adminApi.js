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

export const addNewAgent = async (agentData) => {
  try {
    const response = await apiurl.post("/add-new-agent", agentData);
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