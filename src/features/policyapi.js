import apiurl from "../utils";

export const submitPolicyData = async (userId, policyData, token) => {
  try {
    const response = await apiurl.post("/add-policies", {
      userId,
      ...policyData,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting policy data:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getAllPendingPolicy = async (page = 1, limit = 10, manufacturer) => {
  try {
    const response = await apiurl.get("/pendingPolicy", {
      params: { page, limit, manufacturer},
    
    });
    console.log(manufacturer)

    return response.data;
  } catch (err) {
    console.log(err);
    throw err; 
  }
};

  export const updatePolicyStatus = async (userId, type, policyData) => {

    try {
      const response = await apiurl.put("/policyStatus", {
      id: userId,
    type: type,
      ...policyData,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Error submitting policy data:",
        error.response?.data || error.message
      );
      throw error;
    }
  };