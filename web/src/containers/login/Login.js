import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import TabSelector from '../../components/tab-selector/TabSelector';
import LoginForm from '../../components/login-form/LoginForm';
import SignupForm from '../../components/signup-form/SignupForm';
import './Login.css';


const Login = (props) => {

    const [login, setLogin] = useState(props.login);

    let body = null;
    if (login) {
        body = (<LoginForm />);
    }
    else {
        body = (<SignupForm />);
    }

    console.log(body);

    return (
        <div className="Login">
            <Container>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Card style={{ width: '100%' }} className="card-holder">
                            <Card.Body>
                                <Card.Title>
                                    <p className="title-text">Welcome to Backrow Shop</p>
                                    <Container>
                                        <Row>
                                            <Col>
                                                <TabSelector text="Login" active={login} clickHandler={() => {setLogin(true)}} />
                                            </Col>
                                            <Col>
                                                <TabSelector text="Signup" active={!login} clickHandler={() => {setLogin(false)}} />
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Title>
                                <Card.Text>
                                    {body}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
