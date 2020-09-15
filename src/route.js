import React from 'react';

const Login = React.lazy(() => import('./studio/login/Login'));

const route = [
    { exact: true, name: 'Login', path: '/', component: Login }
];

export default route;
