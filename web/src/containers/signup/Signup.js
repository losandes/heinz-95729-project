import React from 'react';
import { Redirect } from 'react-router-dom';
import './Signup.css';


const Signup = (props) => {

    if (props.login) {
        return <Redirect to='/login' />
    }

    return (
        <div>
            <h1>Signup</h1>
        </div>
    );
}

export default Signup;
