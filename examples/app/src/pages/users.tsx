import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { KeepAliveContext } from '@malita/keepalive';
import "./users.css";

const Users = () => {
    const [count, setCount] = useState(0);
    const { pathname } = useLocation();
    const { dropByCacheKey } = useContext<any>(KeepAliveContext);
    return (
        <>
            <p> Users </p>
            <p className='malita-users'>{count}</p>
            <p><button onClick={() => setCount(count => count + 1)}> Click Me! Add!</button></p>
            <p><button onClick={() => dropByCacheKey(pathname)}> Click Me! Clear Cache!</button></p>
            <Link to='/'>go Home</Link>
        </>);
};
export default Users;