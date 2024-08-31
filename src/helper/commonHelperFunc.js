import apiurl from "../utils";
import { getToken } from "./GetToken";

export const createdDate = () => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  return `${day} ${month} ${year}`;
};

export const addYearsToDate = (date, years) => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate.toISOString().split("T")[0];
};

export const addYearsEndDate = (startDate, years) => {
  const date = new Date(startDate);
  date.setFullYear(date.getFullYear() + years);
  return date;
};
const calculatePercentage = (price, percentage) => {
  return (price * percentage) / 100;
};

export const fetchUserById = async (userId) => {
  const token = getToken();
  try {
    const response = await apiurl.get(`/getUserDataById/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user data:",
      error.response?.data || error.message
    );
    throw error;
  }
};
