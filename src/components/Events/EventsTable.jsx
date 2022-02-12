import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, InputGroup, Form, Table, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faList } from '@fortawesome/free-solid-svg-icons';
import CustomPagination from "../Pagination";
import { useAuth } from "../../context/auth";
import Footer from "../../components/Footer";

function EventsTable() {
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
            selected_item.checked = true;
            if (!selectedItems.filter(item => item.Id == selected_item.Id).length) 
                setSelectedItems(arr => [...arr, selected_item]);
        } else {
            selected_item.checked = false;
            setSelectedItems(selectedItems.filter(item => item.Id != selected_item.Id));
        }
    }

    // toggle all checkboxes
    const toggleAllItems = e => {
        if (e.target.checked) {
            let check_all_items = items.map(a => {a.checked = true;return a;});
            setSelectedItems(check_all_items);
        } else {
            let uncheck_all_items = items.map(a => {a.checked = false;return a;});
            setSelectedItems([]);
        }
    }			

    return (
        <>
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
                    <tr key={"list-"+a.Id} className={a.checked ? "selected" : null}>
                        <td>
                            <span className="justify-content-start">
                                <Form.Check inline checked={a.checked || false} onChange={getSelectedItems} value={a.Id}/>
                            </span>
                        </td>
                        <td><span className="justify-content-start">{a.ArticleLink ? <FontAwesomeIcon icon={faLink}/> : <FontAwesomeIcon icon={faList}/> }</span></td>
                        <td><span><div className="text-truncate" dangerouslySetInnerHTML={{__html: a.Title}}></div></span></td>
                        <td><span>
                            {a._embedded?.Categories && a._embedded?.Categories?.map(category => ( 
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
        
        <Footer selectedItems={selectedItems}/>
        </>
    )
}   

export default EventsTable;