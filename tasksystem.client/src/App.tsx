import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import { history } from './_helpers';
import { Nav, PrivateRoute, DivStyledProvider } from './_components';
import { Home  } from "./Home";
import { Login } from "./Login";
import { Register } from "./Resgister"
import { HandleTaskAction } from "./HandleTaskAction";

import './App.css';
import { Toaster } from 'react-hot-toast';

export { App };

function App() {
    history.navigate = useNavigate();
    history.location = useLocation();
    
    return (
        <div className={"app-container " + (history.location.pathname === '/' ? 'home' : 'form-page')}>
            <DivStyledProvider>
                <Nav />
                <Toaster position="top-right" reverseOrder={true} />
                <div className="container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        }
                    />
                    <Route 
                        path="/createtask" 
                        element={
                            <PrivateRoute>
                                <HandleTaskAction action="create"/>
                            </PrivateRoute>
                        } 
                    />
                    <Route 
                        path="/updatetask/:id" 
                        element={
                            <PrivateRoute>
                                <HandleTaskAction action="update"/>
                            </PrivateRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                </div>
            </DivStyledProvider>
        </div>
    );   
}