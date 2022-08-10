import { useEffect } from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading/Loading";

/* Redirect 주소로 전달받은 code값을 추출 */
const KakaoAuth = () => {
  let navigate = useNavigate();
  const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
  const REDIRECT_URI = "http://localhost:3000/oauth/kakao/callback";
  // const REDIRECT_URI = "http://www.4cut.shop/oauth/kakao/callback";
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

  // calllback으로 받은 인가코드
  const code = new URL(window.location.href).searchParams.get("code");
  const getToken = async () => {
    const payload = qs.stringify({
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      code: code,
      client_secret: CLIENT_SECRET,
    });
    try {
      // access token 가져오기
      const res = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        payload
      );
      // Kakao Javascript SDK 초기화
      window.Kakao.init(REST_API_KEY);
      // access token 설정
      window.Kakao.Auth.setAccessToken(res.data.access_token);
      localStorage.setItem("token", res.data.access_token);
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return <Loading />;
};

export default KakaoAuth;
