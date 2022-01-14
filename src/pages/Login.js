import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Image, Button, Container, InputGroup, Navbar } from 'react-bootstrap';
import LogoDark from "../assets/media/xprs-logo-dark.svg";
import { useAuth } from "../context/auth";
//import Profile3 from "../../assets/img/team/profile-picture-3.jpg";

function Login(props) {
    const [showPassword, setShowPassword] = useState(false);
    const passwordInputType = showPassword ? "text" : "password";
    const passwordIconColor = showPassword ? "#262B40" : "";
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    let navigate = useNavigate();
    let location = useLocation();
    let auth = useAuth();
    let from = (location.state && location.state.from) ? location.state.from.pathname : "/";
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let credentials = { 
        UserLogin: username, 
        UserPassword: password
    }
    const handleLogin = (e) => {
        e.preventDefault();
        auth.signin(credentials,(e) => {
            // redirect to previous visited url
            navigate(from, { replace: true });
        });
    };
      
    return (
        <main>
            <section className="vh-100 bg-soft d-flex align-items-center my-0">
                <Container>
                    {/*<p className="text-center">
                        <Card.Link as={Link} to={AllRoutes.DashboardOverview.path} className="text-gray-700">
                            <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
                        </Card.Link>
                    </p>*/}
                    <Row className="justify-content-center form-bg-image">
                        <Col xs={12} className="d-flex align-items-center justify-content-center">
                            <div className="bg-white shadow-soft rounded p-4 p-lg-5 w-100 fmxw-500">
                                <div className="text-center text-md-center mb-4 mt-md-0">
                                    {/*<div className="user-avatar large-avatar mx-auto mb-3 border-dark p-2">
                                    <Image src={Profile3} className="rounded-circle" />
                                    </div>*/}
                                    <Image src="/__xpr__/pub_engine/business-admin/web/xprs-logo-dark.svg" className="navbar-brand-light mb-4" />
                                    <div className="text-center text-md-center mb-4 mt-md-0">
                                        <h3 className="mb-0">Sign in to our platform</h3>
                                    </div>
                                </div>
                                <Form onSubmit={e => handleLogin(e)} className="mt-5">
                                    <Form.Group id="email" className="mb-4">
                                        <Form.Label>Your Email</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faEnvelope} />
                                            </InputGroup.Text>
                                            <Form.Control autoFocus required type="text" name="username" onChange={e => setUsername(e.target.value)} placeholder="example@company.com" />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group id="password" className="mb-4">
                                        <Form.Label>Your Password</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                            <FontAwesomeIcon icon={faUnlockAlt} />
                                            </InputGroup.Text>
                                            <Form.Control required type={passwordInputType} name="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
                                            <InputGroup.Text onClick={togglePasswordVisibility}>
                                            <FontAwesomeIcon color={passwordIconColor} icon={faEye} />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="w-100">
                                        Login
                                    </Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    );
}

export default Login;