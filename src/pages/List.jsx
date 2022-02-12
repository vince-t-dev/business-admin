import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Button, Row, Col, Card, Tab, Nav } from 'react-bootstrap';

import EventsTable from "../components/Events/EventsTable";
import AttendeesTable from "../components/Attendees/AttendeesTable";

function List() {
    return (
        <>
        <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4">
            <div className="mb-4 mb-lg-0">
                <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                    <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        </div>

        <Tab.Container defaultActiveKey="tab-1">
            <div className="table-settings mb-4">
                <Row className="align-items-center justify-content-between">
                    <Col sm="auto">
                        <Nav variant="pills">
                            <Nav.Item>
                                <Nav.Link eventKey="tab-1">Events</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="tab-2">Attendees</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm="auto">
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <Button as={Link} variant="primary" size="sm" to={"/my-business/list/edit/new"} state={{item: {}}}>
                                <i className="xpri-plus pe-1"></i> New Item
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        
            <Card border="light" className="table-wrapper table-responsive shadow-sm">
                <Tab.Content>
                    <Tab.Pane eventKey="tab-1">
                        <Card.Body>
                            {/* events table */}
                            <EventsTable/>
                        </Card.Body>
                    </Tab.Pane>
                </Tab.Content>
                <Tab.Content>
                    <Tab.Pane eventKey="tab-2">
                        <Card.Body>
                            {/* attendees table */}
                            <AttendeesTable/>
                        </Card.Body>
                    </Tab.Pane>
                </Tab.Content>
            </Card>
        </Tab.Container>
        </>
    )
}

export default List;