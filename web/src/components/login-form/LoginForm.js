import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './LoginForm.css';


class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    handleSubmit = (event) => {
        // const form = event.currentTarget;
        // // if (form.checkValidity() === false) {
        //     event.preventDefault();
        //     event.stopPropagation();
        // // }
    
        // // setValidated(true);
        // // console.log(form);

        const SERVER_URL = "http://127.0.0.1:8080/";

        var bodyFormData = new FormData();
        bodyFormData.set('username', 'salil');
        bodyFormData.set('password', 'password1');

        axios({
                method: 'post',
                url: SERVER_URL + 'login',
                data: bodyFormData,
                headers: {'Content-Type': 'multipart/form-data' }
            })
            .then((response) => {
                //handle success
                this.props.setStatus(true);
            })
            .catch((response) => {
                //handle error
                this.props.setStatus(false);
                console.log(response);
            });
    }

    render() {
        if (this.props.isLoggedIn === true) {
            console.log("Log is true");
            this.props.setStatus(false);
        }
        
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
