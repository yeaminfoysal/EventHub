import React from 'react';
import { Navigate } from 'react-router';
// import Loading from './Loading';

const PrivateRouter = ({ children }) => {
    const token = localStorage.getItem("token");

    // if (token) {
    //     return <Loading></Loading>
    // }
    if (!token) {
        return <Navigate to={'/login'}></Navigate>
    }

    return children;
};

export default PrivateRouter;