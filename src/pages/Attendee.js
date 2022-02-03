import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, Row, Col, Form, Card, Image } from "react-bootstrap";

import { useAuth } from "../context/auth";

function Attendee(props) {
    const { id } = useParams();
    // fetch data from api
    const [error, setError] = useState(null);
    const [item, setItem] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);
    let auth = useAuth();
    useEffect(() => { 
        setIsLoaded(false);
        fetch(`/__xpr__/pub_engine/business-admin/element/users_json?id=`+id, {
            method: "GET",
            headers: {
                Auth: auth.user.token
            }
        })
        .then(res => res.json())
        .then(
            (result) => { 
                setIsLoaded(true);
                setItem(result);
            },
            (error) => {
                setError(error);
            }
        )
    },[]);
    
    return (
        <>
            <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4">
                <div className="mb-4 mb-lg-0">
                    <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/my-business/" }}>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active>Attendees</Breadcrumb.Item>
                    </Breadcrumb>
                    <h1 className="heading-1 mb-4">Overview</h1>
                </div>
            </div>

            {/* attendee details */}
            {item && 
            <Form className="form-content-update" onSubmit={e => {e.preventDefault()}}>
                <Row className="mb-5">
                    <Col sm={8}>
                        <Card border="light" className="shadow-sm">
                            <Card.Body>
                                <Row className="justify-content-end align-items-center">
                                    <Col sm={12}>
                                        <div className="mb-4">
                                            <Row className="justify-content-between">
                                                <Col sm={8} className="mb-3">
                                                    <h2 className="heading-2 mb-3">Attendee Details</h2>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12}>
                                                    <Row>
                                                        <Col sm="auto">
                                                            {item._embedded.CustomFields?._embedded?.ProfileImage?.SourcePath ?
                                                            <Image src={item._embedded.CustomFields?._embedded?.ProfileImage?.SourcePath} className="user-avatar lg-avatar rounded-circle me-3" />
                                                            :
                                                            <div className="user-avatar lg-avatar bg-gray-300 rounded-circle me-3">
                                                                <i className="xpri-members m-0"></i>
                                                            </div>
                                                            }
                                                        </Col>
                                                        <Col>
                                                            <h1 className="text-eggplant">{item.FirstName || "Firstname"} {item.LastName || "Lastname"}</h1>
                                                            <h5 className="mb-2">{item.CompanyName}</h5>
                                                            <Row>
                                                                <Col sm={6}>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label className="d-block text-nowrap text-uppercase">Email</Form.Label>
                                                                        {item.Email}
                                                                    </Form.Group>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label className="d-block text-nowrap text-uppercase">City</Form.Label>
                                                                        City Name goes here
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={3}>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label className="d-block text-nowrap text-uppercase">Phone Number</Form.Label>
                                                                        604-123-1234
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col sm={2}>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label className="d-block text-nowrap text-uppercase">User Id</Form.Label>
                                                                        {item.Id}
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card border="light" className="shadow-sm">
                            <Card.Body>
                                <h2 className="heading-2 mb-3">Member Numbers</h2>
                                <Form.Group className="d-flex align-items-center justify-content-between w-100 mb-2">
                                    <Form.Label className="text-nowrap m-0 me-3 text-uppercase">Total events booked</Form.Label>
                                    <Form.Text className="h2 text-black fw-bolder">34</Form.Text>
                                </Form.Group>
                                <Form.Group className="d-flex align-items-center justify-content-between w-100 mb-2">
                                    <Form.Label className="text-nowrap m-0 me-3 text-uppercase">Total tickets</Form.Label>
                                    <Form.Text className="h2 text-black fw-bolder">65</Form.Text>
                                </Form.Group>
                                <Form.Group className="d-flex align-items-center justify-content-between w-100 mb-2">
                                    <Form.Label className="text-nowrap m-0 me-3 text-uppercase">Total cost</Form.Label>
                                    <Form.Text className="h2 text-primary fw-bolder">$1,934</Form.Text>
                                </Form.Group>
                                <Form.Group className="d-flex align-items-center justify-content-between w-100 mb-2">
                                    <Form.Label className="text-nowrap m-0 me-3 text-uppercase">Average ticket cost</Form.Label>
                                    <Form.Text className="h2 text-black fw-bolder">$29.75</Form.Text>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
            }

            {/* skeleton loader */}
            { !isLoaded &&
                <Row className="mb-4">
                    <Col sm={8}>
                        <Card border="light" className="shadow-sm">
                            <Card.Body>
                                <Row className="justify-content-end align-items-center">
                                    <Col sm={12}>
                                        <div className="mb-4">
                                            <Row className="justify-content-between">
                                                <Col sm={8} className="mb-3">
                                                    <h2 className="heading-2 mb-3">Attendee Details</h2>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12}>
                                                    <Row>
                                                        <Col sm="auto">
                                                            <div className="user-avatar lg-avatar bg-gray-300 rounded-circle me-3">
                                                                <i className="xpri-members m-0"></i>
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group className="mb-4">
                                                                <div className="empty w-25 mb-2"></div>
                                                                <div><div className="empty w-50"></div></div>
                                                            </Form.Group>
                                                            <Form.Group className="mb-4">
                                                                <div className="empty w-25 mb-2"></div>
                                                                <div><div className="empty w-75"></div></div>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card border="light" className="shadow-sm">
                            <Card.Body>
                                <h2 className="heading-2 mb-3">Member Numbers</h2>
                                <div className="empty w-25 mb-2"></div>
                                <div><div className="empty w-75"></div></div>
                                <div className="empty w-25"></div>
                                <div><div className="empty w-50 mb-5"></div></div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            }

            {/* events table */}
            <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4">
                <div className="mb-4 mb-lg-0">
                    <h1 className="heading-1 mb-4">Events</h1>
                </div>
            </div>
            <Row className="mb-5">
                <Col sm={8}>
                    <Card border="light" className="shadow-sm">
                        <Card.Body>
                            <Row className="justify-content-end align-items-center">
                                <Col sm={12}>
                                    <div className="mb-4">
                                        <Row className="justify-content-between">      
                                            <Col className="my-3">
                                                <Form.Group className="mb-4">
                                                    <div className="empty w-25 mb-2"></div>
                                                    <div><div className="empty w-50"></div></div>
                                                </Form.Group>
                                                <Form.Group className="mb-4">
                                                    <div className="empty w-25 mb-2"></div>
                                                    <div><div className="empty w-75"></div></div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default Attendee;