import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Button, Row, Col, InputGroup, Form, Card, Table, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faList } from '@fortawesome/free-solid-svg-icons';
import Footer from "../components/Footer";
import { useAuth } from "../context/auth";
import axios from "axios";

function List() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);

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
    let auth = useAuth();
    useEffect(() => {
        setIsLoaded(false);
        // TODO
        let articles_params = {
            "_noUnhydrated"                     : 1,
            "with"                              : "Picture,Categories,CustomFields,Language",
            "related_Language_Id__eq"           : 1/*request.language.Id*/,
            // expresia /my-business/ section
            "SectionId__in"                     : 6103,
            "order_fields"                      : "SortOrder",
            "order_dirs"                        : "ASC",
            "per_page"                          : 10
        }
        //if (request.urlParams.q) articles_params.q_Title_Description_Html = request.urlParams.q;
        //if (request.urlParams.page) articles_params.page = request.urlParams.page;
        let articles = axios.get("/api/articles/", {
			headers: { 
				"Content-Type": "multipart/form-data",
				"xpr-token-backend": auth.user.token
			},
            params: articles_params,
			withCredentials: true
		})
        .then(function (result) {
            setIsLoaded(true);
            let articles_data = result.data?._embedded?.Article;
            setItems(articles_data);
        })
        .catch(function (error) {
            setIsLoaded(true);
            setError(error);
        });
       
        /*fetch(`/__xpr__/pub_engine/business-admin/element/articles_json?q=${query}`)
            .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true);
                setItems(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )*/

        setSelectedItems([]);
    }, [query]);

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
        let all_chackboxes = document.getElementsByName("list-check");
        for (let i = 0;i < all_chackboxes.length;i++) {
            if (all_chackboxes[i].type == "checkbox") {
                all_chackboxes[i].checked = true;
                let selected_item = items.find(a => a.Id == all_chackboxes[i].value);
                if (!selectedItems.filter(item => item.Id == selected_item.Id).length) 
                    setSelectedItems(arr => [...arr, selected_item]);
            }
        }
    }
    const unSelectAll = e => {
        let all_chackboxes = document.getElementsByName("list-check");
        for (let i = 0;i < all_chackboxes.length;i++) {
            if (all_chackboxes[i].type == "checkbox") {
                all_chackboxes[i].checked = false;
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
                <div className="btn-toolbar mb-2 mb-md-0">
                    {/*<Button variant="primary" size="sm">
                        <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New Article
                    </Button>
                    <ButtonGroup className="ms-3">
                        <Button variant="outline-primary" size="sm">Share</Button>
                        <Button variant="outline-primary" size="sm">Export</Button>
                    </ButtonGroup>*/}
                </div>
            </div>

            <div className="table-settings mb-4">
                <Row className="align-items-center justify-content-between">
                    <Col sm="auto">
                        <h1 className="heading-1 mb-0">Articles</h1>
                    </Col>
                    <Col sm="auto">
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <Button as={Link} variant="primary" size="sm" to={"/my-business/list/edit/new"} state={{item: {}}}>
                                <i className="xpri-plus pe-1"></i> New Article
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
           
            <Card border="light" className="table-wrapper table-responsive shadow-sm">
                <Card.Body>
                    <Form onSubmit={getSearch}>
                        <Row className="justify-content-end align-items-center mb-3">
                            <Col lg={4} className="d-flex justify-content-end">
                                <InputGroup>
                                    <Form.Control size="lg" type="text" className="rounded-xl" placeholder="Search" value={search} onChange={updateSearch}/>
                                    <InputGroup.Text className="rounded-xl">
                                        <i className="xpri-search text-primary"></i>
                                    </InputGroup.Text>
                                </InputGroup>
                            </Col>
                        </Row>
                    </Form>
                    <Form>
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

                            {isLoaded && items.map(a => (
                                <tr key={"list-"+a.Id} className={selectedItems.find(item => item.Id == a.Id) ? "selected" : undefined}>
                                    <td><span className="justify-content-start"><Form.Check inline onChange={getSelectedItems} name="list-check" value={a.Id}/></span></td>
                                    <td><span className="justify-content-start">{a.ArticleLink ? <FontAwesomeIcon icon={faLink}/> : <FontAwesomeIcon icon={faList}/> }</span></td>
                                    <td><span><div className="text-truncate">{a.Title}</div></span></td>
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
                            { !items.length && isLoaded && <tr><td colSpan="6"><div className="text-center my-3">No result found.</div></td></tr> }
                            </tbody>
                            {/* loader */}
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
                                </tbody> 
                            }
                        </Table>
                    </Form>
                </Card.Body>
            </Card>
            <Footer selectedItems={selectedItems}/>
        </>
    )
}

export default List;