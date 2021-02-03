import React from 'react'
import { Redirect } from 'react-router-dom'

export default function ProtectedRoute(props) {
    const Component = props.component;

    return props.isAuth ? (
        <Component handleLogout={props.handleLogout} />
    ) : (
            <Redirect to={{ pathname: '/login' }} />
        );
}
