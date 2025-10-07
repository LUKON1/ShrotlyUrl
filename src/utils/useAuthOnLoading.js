import { useEffect, useState } from 'react';
import useAuth from '../utils/useAuth';
import useRefreshToken from './useRefreshToken';

const useAuthOnLoading = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth(); 

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                
                await refresh();
            } catch (err) {
                
                console.error("Failed to restore session from refresh token:", err);
            } finally {
                
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (!auth?.accessToken) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, []);

    return isLoading; 
};

export default useAuthOnLoading;