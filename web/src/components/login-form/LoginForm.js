import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './LoginForm.css';


class LoginForm extends Component {

    handleSubmit = (event) => {
        const form = event.currentTarget;
        // if (form.checkValidity() === false) {
        //     event.preventDefault();
        //     event.stopPropagation();
        // }
    
        // setValidated(true);
        console.log(form);

        const SERVER_URL = "http://10.0.0.127:8080/";
        var config = {
            headers: {'Access-Control-Allow-Origin': '*'}
        };

        axios.post(SERVER_URL + 'login', {
                username: 'salil',
                password: 'password'
            }, config)
            .then(function (response) {
                console.log("SUCCESS");
                console.log(response);
            })
            .catch(function (error) {
                console.log("FAILURE");
                console.log(error);
            });
    }

    render() {
        return (
            <div className="LoginForm" onSubmit={this.handleSubmit}>
                <Form>
                    <Form.Group controlId="formGroupEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" />
                    </Form.Group>
                    <Form.Group controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                </Form>
            </div>
        );
    }
}

export default LoginForm;
