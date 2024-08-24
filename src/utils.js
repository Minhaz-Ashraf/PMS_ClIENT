// import axios from "axios";

// const apiurl = axios.create({
//   baseURL: import.meta.env.VITE_APP_DEV_BASE_URL,
//   // You can add other default configurations here if needed
// });

// apiurl.interceptors.request.use(
//   (config) => {
//     const tokenId = getToken(); // Fetch token inside the interceptor
//     console.log(tokenId);
//     if (tokenId) {
//       config.headers.Authorization = `Bearer ${tokenId}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default apiurl;


import axios from "axios";

const apiurl = axios.create({
  baseURL: "http://localhost:8800/api/v1",
  // baseURL : "http://localhost:8800",
});

export default apiurl;