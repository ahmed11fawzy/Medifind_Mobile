import { useSelector } from 'react-redux';
import {
    selectCurrentUser,
    selectIsAuthenticated,
    selectToken,
    selectTokenData
} from '../redux/Slice/authSlice';

export const useAuth = () => {
    const token = useSelector(selectToken);
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const tokenData = useSelector(selectTokenData);

    console.log("Auth Hook - Token Data:", tokenData);

    return {
        token,
        user,
        isAuthenticated,
        tokenData,
        // Add useful properties from token data
        userId: tokenData?.sub || tokenData?.id,
        userRole: tokenData?.role,

        // Add expiration check
        isTokenValid: token && tokenData && tokenData.exp * 1000 > Date.now()
    };
};