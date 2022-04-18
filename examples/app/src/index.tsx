import React from 'react';
import ReactDOM from 'react-dom/client';

const Hello = () => {
    const [text, setText] = React.useState('Hello Malita!');
    return (<span
        onClick={() => {
            setText('Hi!')
        }}> {text} </span>);
};

const root = ReactDOM.createRoot(document.getElementById('malita'));
root.render(React.createElement(Hello));
