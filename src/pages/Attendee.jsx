import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, Row, Col, Form, Card, Image, OverlayTrigger, Tooltip, Button, Tab, Nav, Modal, FormFloating } from "react-bootstrap";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context/auth";

import FilterableEventsTable from "../components/Events/FilterableEventsTable";
import CustomSelect from "../components/Select";
import events from "../data/events";

function Attendee(props) {
    const { id } = useParams();
    // fetch data from api
    const [error, setError] = useState(null);
    const [item, setItem] = useState(null);
    const [event, setEvent] = useState(null);
    // TODO: might just merge date and time together
    const [transferEvent, setTransferEvent] = useState("");
    const [transferEventDate, setTransferEventDate] = useState("");
    const [transferEventTime, setTransferEventTime] = useState("");
    const [showSuccessScreen,setShowSuccessScreen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(true);

    // modal
    const [modalTransferEvent, setModalTransferEvent] = useState(false);
    const handleClose = () => { 
        setModalTransferEvent(false);
        formik.resetForm();
        setTimeout(function() {
            setShowSuccessScreen(false);
        },1500);
    }

    // open transfer event modal
    const openModalTransferEvent = (e,event) => {
        setModalTransferEvent(true);
        setEvent(event);
    }

    let auth = useAuth();
    let upcoming_events = events?.filter(a => new Date(a.CreatedOn).getTime() >= new Date().getTime());
    let past_events = events?.filter(a => new Date(a.CreatedOn).getTime() < new Date().getTime());

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

    // validation
    const formik = useFormik({
        initialValues: {
            event: transferEvent,
            event_date: transferEventDate,
            event_time: transferEventTime
        },
        validationSchema: yup.object({
            event: yup.object().required("Select an event"),
            event_date: yup.object().required("Select event date"),
            event_time: yup.object().required("Select event time")
        }),
        onSubmit: values => {
            // sucess view
            setShowSuccessScreen(true);
        }
    });

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
        <Row className="form-content-update mb-5">
            <Col sm={8}>
                <Card border="light" className="shadow-sm">
                    <Card.Body>
                        <Row className="justify-content-end align-items-center">
                            <Col sm={12}>
                                <div className="mb-4">
                                    <Row className="justify-content-between">
                                        <Col className="mb-3">
                                            <h2 className="heading-2 mb-3">Attendee Details</h2>
                                        </Col>
                                        <Col sm="auto">
                                            <div className="btn-group">
                                                <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                                    <Link to={"/my-business/attendees/"+item.Id+"/edit"} state={{item: item}} className="btn btn-link"><i data-toggle="tooltip" className="xpri-edit"></i></Link>
                                                </OverlayTrigger>
                                                <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                                                    <button type="button" className="btn btn-link"><i data-toggle="tooltip" className="xpri-delete"></i></button>
                                                </OverlayTrigger>
                                            </div>
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
        <Row className="mt-4 mb-4 mb-lg-0">
            <Col sm={8}>
                <Row className="align-items-center mb-3">
                    <Col><h1 className="heading-1 mb-0">Events</h1></Col>
                    <Col sm="auto">
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <Button as={Link} variant="primary" size="sm" to={"/my-business/list/edit/new"} state={{item: {}}}>
                                <i className="xpri-plus pe-1"></i> New Event
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row className="mb-5">
            <Col sm={8}>
                <Card border="light" className="shadow-sm">
                    <Card.Body>
                        <Row className="justify-content-end align-items-center">
                            <Col sm={12}>
                                <Tab.Container defaultActiveKey="tab-1">
                                    <Row className="align-items-center justify-content-between">
                                        <Col sm="auto">
                                            <Nav variant="tabs">
                                                <Nav.Item>
                                                    <Nav.Link eventKey="tab-1">Coming Up</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                    <Nav.Link eventKey="tab-2">History</Nav.Link>
                                                </Nav.Item>
                                            </Nav>
                                        </Col>
                                    </Row>
                            
                                    {isLoaded &&
                                    <Card border="light" className="table-wrapper table-responsive shadow-sm">
                                        <Tab.Content>
                                            {/* upcoming events */}
                                            <Tab.Pane eventKey="tab-1">
                                                <FilterableEventsTable events={upcoming_events} openModalTransferEvent={openModalTransferEvent}/>    
                                            </Tab.Pane>
                                            
                                            {/* past events */}
                                            <Tab.Pane eventKey="tab-2">
                                                <FilterableEventsTable events={past_events} openModalTransferEvent={openModalTransferEvent}/>    
                                            </Tab.Pane>

                                        </Tab.Content>
                                    </Card>
                                    }
                                </Tab.Container>

                                {/* skeleton loader */}
                                { !isLoaded && 
                                <Row className="justify-content-between mt-3">      
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
                                }
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        {/* modal: transfer to different event */}
        { item && event &&
        <Modal centered show={modalTransferEvent} onHide={handleClose}>
            <Form onSubmit={formik.handleSubmit}>
                <Modal.Header closeButton closeVariant="white"> 
                    <Modal.Title>Transfer to Different Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { !showSuccessScreen ?
                        <>
                        <h2 className="text-eggplant mb-3">Attendee to Transfer</h2>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="col-auto user-avatar xs-avatar bg-gray-300 rounded-circle me-2">
                                <i className="xpri-members m-0"></i>
                            </div>
                            <div className="col fw-bold">{item.FirstName || "Firstname"} {item.LastName || "Lastname"}</div>
                            <div>{item.CompanyName}</div>
                        </div>
                        <hr/>
                        <h2 className="text-eggplant mb-3">Transfer From</h2>
                        <p>
                            <span className="fw-bold">{event.Title}</span><br/>
                            {event.CreatedOn}<br/>
                            {event.Location}
                        </p>
                        <hr/>
                        <h2 className="text-eggplant mb-3">Transfer To</h2>
                        <Form.Group className="mb-4" controlId="html">
                            <Form.Label className="text-eggplant">Available Events</Form.Label>
                            <CustomSelect options={events} searchable={true} onSelectChange={event => { setTransferEvent(event);formik.setFieldValue("event",event); } } getOptionLabel={(option) => `${option['Title']}`} getOptionValue={(option) => `${option['Id']}`}/>
                            {formik.errors.event && formik.touched.event && (
                                <div className="text-danger mt-2">{formik.errors.event}</div>
                            )}
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group className="mb-4" controlId="html">
                                    <Form.Label className="text-eggplant">Available Dates</Form.Label>
                                    <CustomSelect options={transferEvent?.Dates} onSelectChange={event => { setTransferEventDate(event);formik.setFieldValue("event_date",event); } }  disabled={!transferEvent ? true : false}/>
                                    {formik.errors.event_date && formik.touched.event_date && (
                                        <div className="text-danger mt-2">{formik.errors.event_date}</div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-4" controlId="html">
                                    <Form.Label className="text-eggplant">Available Time Slots</Form.Label>
                                    <CustomSelect options={transferEventDate?.Time} onSelectChange={event => { setTransferEventTime(event);formik.setFieldValue("event_time",event); } }  disabled={!transferEvent ? true : false}/>
                                    {formik.errors.event_time && formik.touched.event_time && (
                                        <div className="text-danger mt-2">{formik.errors.event_time}</div>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        </>
                        :
                        <>
                        <Col className="text-center my-5">
                            <div className="mb-4"><i className="xpri-star-circle icon-xl"></i></div>
                            <h3>The transfer has been succesful!</h3>
                        </Col>
                        </>
                    }
                </Modal.Body>
                <Modal.Footer className={showSuccessScreen && "d-none"}>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
        }
        </>
    );
}

export default Attendee;