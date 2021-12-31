import React,{useEffect,useState} from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb, Button, Row, Col, InputGroup, Form, Card, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faList } from '@fortawesome/free-solid-svg-icons';

function ListItem(props) {
    const location = useLocation();
    const item = location.state.item;
console.log('item:',item);
    return (
        <>
            <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4">
                <div className="mb-4 mb-lg-0">
                    <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item>Details</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <Row>
                <Col sm={8}>
                    <Card border="light" className="shadow-sm">
                        <Card.Body>
                            <Form>
                                <Row className="justify-content-end align-items-center mb-3">
                                    <Col sm={12} className="d-flex">
                                        <div className="mb-4">
                                            <Row className="justify-content-between">
                                                <Col sm={8} className="mb-3">
                                                    <h2 className="heading-1">Details</h2>
                                                    <p className="subheading-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

                                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                                        <Form.Label>Title</Form.Label>
                                                        <Form.Control type="text" placeholder="Enter title" value={item.Title}/>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                                        <Form.Label>Description</Form.Label>
                                                        <Form.Control type="text" placeholder="Enter title" value={item.Description}/>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                                        <Form.Label>Body</Form.Label>
                                                        <Form.Control type="text" placeholder="Enter title" value={item.Body}/>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={4}>
                    <Card border="light" className="shadow-sm">
                        <Card.Body>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default ListItem;