import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
// import Footer from './Footer';
// import {NavBar} from '../components/Navbar'

const Root = () => {
    return (
        <div>
            <Navbar/>
            <div className='min-h-[calc(100vh-469px)]'>
                <Outlet></Outlet>
            </div>
            {/* <Footer></Footer> */}

        </div>
    );
};

export default Root;