import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import history from './history';
import Login from './Login';
import {REGISTER_USER_OR_DOCTOR} from '../actions/types'
import { TOGGLE_LOGIN_LOGOUT } from '../actions/types';
function Logout(props) {
    const dispatch = useDispatch()
    useEffect(() => {
        console.log("called")
        dispatch({ type: "USER_LOGIN", payload: null });
        dispatch({ type: TOGGLE_LOGIN_LOGOUT, payload: true })
        document.getElementById("user").innerText = ``;
        dispatch({ type: REGISTER_USER_OR_DOCTOR, payload: false });

        history.push('/login');
    }, []);

    return (
        <>

        </>
    );
}

export default Logout;