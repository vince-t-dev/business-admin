import React,{useEffect,useState} from "react";
import { Breadcrumb, Button, ButtonGroup, Row, Col, InputGroup, Form, Image, Dropdown, Card, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faCog, faCheck, faSearch, faSlidersH, faLink, faList } from '@fortawesome/free-solid-svg-icons';

function Users() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");

    // update search value
    const updateSearch = e => {
        setSearch(e.target.value);    
    }

    // get search results
    const getSearch = e => {
        e.preventDefault();
        setQuery(search);
    }

    // fetch results when query changes
    useEffect(() => {
        setIsLoaded(false);
        fetch(`/__xpr__/pub_engine/business-admin/element/users_json?q=${query}`)
            .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true);
                setUsers(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [query]);
    
    return (
        <>
            <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                <div className="mb-4 mb-lg-0">
                    <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <div className="table-settings mb-4">
                <Row className="justify-content-between">
                    <Col sm="auto">
                        <h1 className="heading-1">Users</h1>
                    </Col>
                    <Col sm="auto">
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <Button variant="primary" size="sm">
                                <i className="xpri-plus pe-1"></i> New User
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>

            <div className="table-settings mb-4">
                <Form onSubmit={getSearch}>
                    <Row className="justify-content-between align-items-center">
                        <Col xs={9} lg={4} className="d-flex">
                            <InputGroup className="me-2 me-lg-3">
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faSearch} />
                                </InputGroup.Text>
                                <Form.Control type="text" placeholder="Search" value={search} onChange={updateSearch}/>
                            </InputGroup>
                            <Form.Select className="w-25">
                                <option defaultChecked>All</option>
                                <option value="1">Active</option>
                                <option value="2">Inactive</option>
                                <option value="3">Pending</option>
                                <option value="3">Canceled</option>
                            </Form.Select>
                        </Col>
                        <Col xs={3} lg={8} className="text-end">
                            <Dropdown as={ButtonGroup} className="me-2">
                                <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-0">
                                    <span className="icon icon-sm icon-gray">
                                        <FontAwesomeIcon icon={faSlidersH} />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-right">
                                    <Dropdown.Item className="fw-bold text-dark">Show</Dropdown.Item>
                                    <Dropdown.Item className="d-flex fw-bold">
                                        10 <span className="icon icon-small ms-auto"><FontAwesomeIcon icon={faCheck} /></span>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="fw-bold">20</Dropdown.Item>
                                    <Dropdown.Item className="fw-bold">30</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown as={ButtonGroup}>
                                <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-0">
                                    <span className="icon icon-sm icon-gray">
                                        <FontAwesomeIcon icon={faCog} />
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-right">
                                    <Dropdown.Item className="fw-bold text-dark">Show</Dropdown.Item>
                                    <Dropdown.Item className="d-flex fw-bold">
                                        10 <span className="icon icon-small ms-auto"><FontAwesomeIcon icon={faCheck} /></span>
                                    </Dropdown.Item>
                                    <Dropdown.Item className="fw-bold">20</Dropdown.Item>
                                    <Dropdown.Item className="fw-bold">30</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Form>
            </div>
            
            <Card border="light" className="table-wrapper table-responsive shadow-sm">
                <Card.Body>
                    <Table className="user-table align-items-center">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Position</th>
                                <th>User Created at</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                        {isLoaded && users.map(u => (
                            <tr key={u.Id}>
                                <td>
                                    <span>
                                        <Card.Link className="d-flex align-items-center">
                                            <i class="xpri-members me-2"></i>
                                            <div className="d-block">
                                                <span className="fw-bold">{u.FirstName && u.LastName ? u.FirstName+" "+u.LastName : "Anonymous"}</span>

                                            </div>
                                        </Card.Link>
                                    </span>
                                </td>
                                <td><span><div className="small text-gray">{u.Email || "-"}</div></span></td>
                                <td><span><div className="small text-gray">{u.CompanyName || "-"}</div></span></td>
                                <td><span>{u.LastLogin || "long ago"}</span></td>
                            </tr>
                        ))}

                        { error && <div>Fetching users error: {error.message}</div> }
                        { !isLoaded && <tr><td colSpan="4"><div className="text-center my-3">Loading...</div></td></tr> }
                        { !users.length && isLoaded && <tr><td colSpan="4"><div className="text-center my-3">No result found.</div></td></tr> }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    )
}

export default Users;