import axios from "axios";

export const axiosLogin = async (member_id, member_pw) => {
  return await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
    member_id, 
    member_pw
  }, {
    withCredentials: true  // 세션/쿠키 사용하는 경우 필수
  });
};
