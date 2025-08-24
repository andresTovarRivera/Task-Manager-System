import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { authActions } from '../_store';

export { Nav };

function Nav() {
    const authUser = useSelector(( x : any ) => x.auth.user);
    const dispatch = useDispatch();
    const logout = () => dispatch(authActions.logout());
    const logoutIcon = <i className="fa-solid fa-arrow-right-from-bracket"></i>;
    if (!authUser) return null;
    
    return (
        <nav className="navbar">
            <div className="navbar-nav">
                <NavLink to="/" className="nav-item-link">Home</NavLink>
                <button onClick={logout} className="nav-item-button">{logoutIcon}</button>
            </div>
        </nav>
    );
}