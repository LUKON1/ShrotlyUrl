import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	const { setAuth } = useAuth();
	const API_REFRESH = "/auth/refresh";
	const refresh = async () => {
		try {
			const response = await axios.post(
				API_REFRESH,
				{},
				{
					withCredentials: true,
				}
			);

			setAuth((prev) => {
				return {
					...prev,
					accessToken: response.data.accessToken,
					userId: response.data.userId,
				};
			});
			return response.data.accessToken;
		} catch (error) {
			console.error("Failed to refresh token:", error);
			setAuth({});
			throw error;
		}
	};
	return refresh;
};

export default useRefreshToken;
