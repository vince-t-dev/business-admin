import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Button, Row, Col, InputGroup, Form, Card, Tab, Nav , Table, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faList } from '@fortawesome/free-solid-svg-icons';
import Footer from "../components/Footer";
import CustomPagination from "../components/Pagination";
import Attendees from "../components/Attendees";
import { useAuth } from "../context/auth";

function List() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [listPagination, setListPagination] = useState({});
    const [keyword, setKeyword] = useState("");
    const params = useParams();
    const navigate = useNavigate();
    let url = new URL(window.location.href);
    let page = Number(params["*"]?.split("p")[1] || 1);

    // update search keyword
    const updateKeyword = e => {
        setKeyword(e.target.value);    
    }

    // search form submit
    const getSearch = e => {
        e.preventDefault();
        // reset page to 1 when doing search
        (page == 1) ? fetchItems(keyword,1) : navigate("/my-business/list/p1");
    }

    // hooks: fetch data when page changes
    useEffect(() => {
        fetchItems(keyword);
    },[page]);

    // fetch items
    let auth = useAuth();
    const fetchItems = (query,goToPage) => {
        setIsLoaded(false);
        url.searchParams.append("page", goToPage ? goToPage : page);
        if (query) url.searchParams.append("q", query);
        fetch(`/__xpr__/pub_engine/business-admin/element/articles_json${url.search}`, {
            method: "GET",
            headers: { Auth: auth.user.token }
        })
        .then(res => res.json())
        .then(
            (result) => {
                setIsLoaded(true);
                setItems(result._embedded?.Article);
                setListPagination(result.Pagination);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
        setSelectedItems([]);
    }

    // get selected items
    const getSelectedItems = e => {
        let selected_item = items.find(a => a.Id == e.target.value);
        // add/remove from selected items list
        if (e.target.checked) {
            if (!selectedItems.filter(item => item.Id == selected_item.Id).length) 
                setSelectedItems(arr => [...arr, selected_item]);
        } else {
            setSelectedItems(selectedItems.filter(item => item.Id != selected_item.Id));
        }
    }

    // toggle all checkboxes
    const toggleAllItems = e => {
        (e.target.checked) ? selectAll() : unSelectAll();
    }

    // select/unselect all
    const selectAll = e => {
        let all_checkboxes = document.getElementsByName("list-check");
        for (let i = 0;i < all_checkboxes.length;i++) {
            if (all_checkboxes[i].type == "checkbox") {
                all_checkboxes[i].checked = true;
                let selected_item = items.find(a => a.Id == all_checkboxes[i].value);
                if (!selectedItems.filter(item => item.Id == selected_item.Id).length) 
                    setSelectedItems(arr => [...arr, selected_item]);
            }
        }
    }
    const unSelectAll = e => {
        let all_checkboxes = document.getElementsByName("list-check");
        for (let i = 0;i < all_checkboxes.length;i++) {
            if (all_checkboxes[i].type == "checkbox") {
                all_checkboxes[i].checked = false;
                setSelectedItems([]);
            }
        }
    }			

    // show footer nav when select items
    useEffect(() => {
        if (selectedItems.length)
            document.getElementById("nav-footer").classList.add("active");
        else
            document.getElementById("nav-footer").classList.remove("active");
    }, [selectedItems]);

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
                                <Form onSubmit={getSearch}>
                                    <Row className="justify-content-end align-items-center mb-3">
                                        <Col lg={4} className="d-flex justify-content-end">
                                            <InputGroup>
                                                <Form.Control size="lg" type="text" className="rounded-xl px-4" placeholder="Search" value={keyword} onChange={updateKeyword}/>
                                                <InputGroup.Text className="rounded-xl">
                                                    <i className="xpri-search text-primary"></i>
                                                </InputGroup.Text>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Form>
                                <Form>
                                    {/* list table */}
                                    <Table responsive="sm">
                                        <thead>
                                            <tr>
                                                <th><Form.Check inline onChange={toggleAllItems}/></th>
                                                <th>Type</th>
                                                <th className="w-35">Title</th>
                                                <th className="w-20">Categories</th>
                                                <th>Created On</th>
                                                <th>Published</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                        {isLoaded && items?.map(a => (
                                            <tr key={"list-"+a.Id} className={selectedItems.find(item => item.Id == a.Id) ? "selected" : undefined}>
                                                <td><span className="justify-content-start"><Form.Check inline onChange={getSelectedItems} name="list-check" value={a.Id}/></span></td>
                                                <td><span className="justify-content-start">{a.ArticleLink ? <FontAwesomeIcon icon={faLink}/> : <FontAwesomeIcon icon={faList}/> }</span></td>
                                                <td><span><div className="text-truncate" dangerouslySetInnerHTML={{__html: a.Title}}></div></span></td>
                                                <td><span>
                                                    {a._embedded.Categories && a._embedded.Categories.map(category => ( 
                                                        <Badge key={category.Id} bg="primary">{category && category.Name}</Badge>
                                                    ))}
                                                    </span></td>
                                                <td><span>{a.CreatedOn}</span></td>
                                                <td>
                                                    <span>
                                                        <Form.Check type="switch" defaultChecked={a.Active} id={"switch-status-"+a.Id}/>
                                                    </span>
                                                </td>
                                                <td>
                                                    <span>
                                                        <div className="btn-group">
                                                            <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                                                <Link to={"/my-business/list/edit/"+a.Id} state={{item: a}} className="btn btn-link"><i data-toggle="tooltip" className="xpri-edit"></i></Link>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger overlay={<Tooltip>Preview</Tooltip>}>
                                                                <a href="" className="btn btn-link" target="_blank"><i data-toggle="tooltip" className="xpri-preview"></i></a>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                                                                <button type="button" className="btn btn-link"><i data-toggle="tooltip" className="xpri-delete"></i></button>
                                                            </OverlayTrigger>
                                                        </div>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}   
                                        { error && <div>Fetching list error: {error.message}</div> }
                                        { !items?.length && isLoaded && <tr><td colSpan="7"><div className="text-center my-3">No result found.</div></td></tr> }
                                        </tbody>

                                        {/* skeleton loader */}
                                        { !isLoaded &&
                                            <tbody>
                                                <tr>
                                                    <td><span></span></td><td><span><div className="empty"></div></span></td><td><span><div className="d-flex w-100 flex-wrap align-items-center"><div className="empty w-25"></div><div className="empty"></div></div></span></td>
                                                    <td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td>
                                                    <td><span></span></td>
                                                </tr>
                                                <tr>
                                                    <td><span></span></td><td><span><div className="empty"></div></span></td><td><span><div className="d-flex w-100 flex-wrap align-items-center"><div className="empty w-50"></div><div className="empty"></div></div></span></td>
                                                    <td><span><div className="empty w-50"></div></span></td><td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td>
                                                    <td><span></span></td>
                                                </tr> 
                                                <tr>
                                                    <td><span></span></td><td><span><div className="empty"></div></span></td><td><span><div className="d-flex w-100 flex-wrap align-items-center"><div className="empty w-25"></div><div className="empty"></div></div></span></td>
                                                    <td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td>
                                                    <td><span></span></td>
                                                </tr> 
                                                <tr>
                                                    <td><span></span></td><td><span><div className="empty"></div></span></td><td><span><div className="d-flex w-100 flex-wrap align-items-center"><div className="empty w-50"></div><div className="empty"></div></div></span></td>
                                                    <td><span><div className="empty w-50"></div></span></td><td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td>
                                                    <td><span></span></td>
                                                </tr> 
                                                <tr>
                                                    <td><span></span></td><td><span><div className="empty"></div></span></td><td><span><div className="d-flex w-100 flex-wrap align-items-center"><div className="empty w-25"></div><div className="empty"></div></div></span></td>
                                                    <td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td>
                                                    <td><span></span></td>
                                                </tr>
                                                <tr>
                                                    <td><span></span></td><td><span><div className="empty"></div></span></td><td><span><div className="d-flex w-100 flex-wrap align-items-center"><div className="empty w-50"></div><div className="empty"></div></div></span></td>
                                                    <td><span><div className="empty w-50"></div></span></td><td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td>
                                                    <td><span></span></td>
                                                </tr> 
                                                <tr>
                                                    <td><span></span></td><td><span><div className="empty"></div></span></td><td><span><div className="d-flex w-100 flex-wrap align-items-center"><div className="empty w-25"></div><div className="empty"></div></div></span></td>
                                                    <td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td>
                                                    <td><span></span></td>
                                                </tr> 
                                                <tr>
                                                    <td><span></span></td><td><span><div className="empty"></div></span></td><td><span><div className="d-flex w-100 flex-wrap align-items-center"><div className="empty w-50"></div><div className="empty"></div></div></span></td>
                                                    <td><span><div className="empty w-50"></div></span></td><td><span><div className="empty"></div></span></td><td><span><div className="empty"></div></span></td>
                                                    <td><span></span></td>
                                                </tr> 
                                            </tbody> 
                                        }
                                    </Table>
                                </Form>   
                                
                                {/* pagination */}
                                { listPagination.totalPages > 0 && <CustomPagination totalPages={listPagination?.totalPages} page={page} href={"/my-business/list/p"}/> }

                            </Card.Body>
                        </Tab.Pane>
                    </Tab.Content>
                    <Tab.Content>
                        <Tab.Pane eventKey="tab-2">
                            <Card.Body>
                                <Attendees/>
                            </Card.Body>
                        </Tab.Pane>
                    </Tab.Content>
                </Card>
            </Tab.Container>

            <Footer selectedItems={selectedItems}/>
        </>
    )
}

export default List;