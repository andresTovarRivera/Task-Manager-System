import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { history } from '../_helpers';

export { PrivateRoute };

function PrivateRoute({ children }: any) {
    const { user: authUser } = useSelector((x : any) => x.auth);
    
    if (!authUser) {
        return <Navigate to="/login" state={{ from: history.location }} />
    }

    return children;
}