import React,{useEffect,useState} from "react";
import { Breadcrumb, Button, ButtonGroup, Row, Col, InputGroup, Form, Image, Dropdown, Card, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faCog, faCheck, faSearch, faSlidersH, faLink, faList } from '@fortawesome/free-solid-svg-icons';

function Articles() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState([]);
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
        fetch(`/__xpr__/pub_engine/business-admin/element/articles_json?q=${query}`)
            .then(res => res.json())
            .then(
            (result) => {
                setIsLoaded(true);
                setArticles(result);
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    }, [query]);
    
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
                <Row className="justify-content-between">
                    <Col sm="auto">
                        <h1 className="heading-1">Articles</h1>
                    </Col>
                    <Col sm="auto">
                        <div className="btn-toolbar mb-2 mb-md-0">
                            <Button variant="primary" size="sm">
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
                    <Table responsive="sm">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th className="w-35">Title</th>
                                <th className="w-20">Categories</th>
                                <th>Created On</th>
                                <th>Published</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                        {isLoaded && articles.map(a => (
                            <tr key={a.Id}>
                                <td><span>{a.ArticleLink ? <FontAwesomeIcon icon={faLink}/> : <FontAwesomeIcon icon={faList}/> }</span></td>
                                <td><span><div className="text-truncate">{a.Title}</div></span></td>
                                <td><span>
                                    {a._embedded.Categories && a._embedded.Categories.map(category => ( 
                                        <Badge key={category.Id} bg="primary">{category && category.Name}</Badge>
                                    ))}
                                    </span></td>
                                <td><span>{a.CreatedOn}</span></td>
                                <td>
                                    <span>
                                        <Form>
                                            <Form.Check type="switch" defaultChecked={a.Active}/>
                                        </Form>
                                    </span>
                                </td>
                                <td>
                                    <span>
                                        <div className="btn-group">
                                            <button type="button" className="btn btn-link"><i data-toggle="tooltip" title="Preview" className="xpri-edit"></i></button>
                                            <a href="/dev/" className="btn btn-link" target="_blank"><i data-toggle="tooltip" title="Preview" className="xpri-preview"></i></a>
                                            <button type="button" className="btn btn-link"><i data-toggle="tooltip" title="Download" className="xpri-delete"></i></button>
                                        </div>
                                    </span>
                                </td>
                            </tr>
                        ))}   
                        { error && <div>Fetching users error: {error.message}</div> }
                        { !isLoaded && <tr><td colSpan="6"><div className="text-center my-3">Loading...</div></td></tr> }
                        { !articles.length && isLoaded && <tr><td colSpan="6"><div className="text-center my-3">No result found.</div></td></tr> }
                        </tbody>
                    </Table>
            
           
                    
                </Card.Body>
            </Card>
        </>
    )
}

export default Articles;