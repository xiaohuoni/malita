import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, } from 'react-router-dom';
import KeepAliveLayout from '@malita/keepalive';
import Layout from './layouts/index';
import Hello from './pages/home';
import Users from './pages/users';

const App = () => {
    return (
        <KeepAliveLayout keepalive={[/./]}>
            <HashRouter>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route path="/" element={<Hello />} />
                        <Route path="/users" element={<Users />} />
                    </Route>
                </Routes>
            </HashRouter>
        </KeepAliveLayout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('malita'));
root.render(React.createElement(App));