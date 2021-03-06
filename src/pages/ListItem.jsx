import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Breadcrumb, Button, Row, Col, Form, Card, CardGroup, Dropdown, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import TextEditor from "../components/TextEditor";
import ImageEditor from "../components/ImageEditor";
import DateTimePicker from "../components/DateTimePicker";

import { useAuth } from "../context/auth";

function ListItem(props) {
    const navigate = useNavigate();
    const { id } = useParams();
    const isCreateNew = (id == "new");

    // fetch data from api
    const [error, setError] = useState(null);
    const [item, setItem] = useState(null);
    let content_data = isCreateNew ? {"_embedded": { "Section": { "Id": 6103 }, "Language": {"Id": 1 }}} : {};
    const [jsonData, setJsonData] = useState(content_data);
    const [isSaved, setIsSaved] = useState(true);
    const [isLoaded, setIsLoaded] = useState(true);
    let auth = useAuth();
    useEffect(() => { 
        // could use location state from listing to bypass api call but would need an efficent way to detect changes
        //if (location.state) {
            //let data = location.state.item;    
            //setItem(data);
        // for create new form    
        if (isCreateNew) {
            setItem({});
        } else {
            setIsLoaded(false);
            fetch(`/__xpr__/pub_engine/business-admin/element/article_json?id=`+id, {
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
        }
    },[]);
    
    // content card group
    const [cardValues, setCardValues] = useState([{title: "", description: ""}]);
    let addCardFields = () => {
        setCardValues([...cardValues, { title: "", description: "" }]);
    }
    let removeCardFields = (i) => {
        let newCardValues = [...cardValues];
        newCardValues.splice(i, 1);
        setCardValues(newCardValues);
    }
    let handleCardChange = (i,e) => {
        let newCardValues = [...cardValues];
        newCardValues[i][e.target.name] = e.target.value;
        setCardValues(newCardValues);
    }

    // tags
    const [tags, setTags] = useState([{ name: "" }]);
    let addTags = () => {
        setTags([...tags, { name: "" }]);
    }
    let removeTags = (i) => {
        let newTags = [...tags];
        newTags.splice(i, 1);
        setTags(newTags);
    }
    let handleTagChange = (i,e) => {
        let newTags = [...tags];
        newTags[i][e.target.name] = e.target.value;
        setTags(newTags);
    }

    // update nested object
    const updateObject = (object, path, value) => {
        let schema = object;  
        let p_list = path.split(".");
        let len = p_list.length;
        for(let i = 0; i < len-1; i++) {
            let elem = p_list[i];
            if( !schema[elem] ) schema[elem] = {}
            schema = schema[elem];
        }
        schema[p_list[len-1]] = value;
        return schema;
    }

    // update data object
    const updateData = (name,value) => { 
        updateObject(jsonData, name, value);
    }

    // submit form
	const submit_content = async (options) => {
        let formData = {};
        // create new item
        if (isCreateNew) {
            formData.uri = "/articles/";
		    formData.action = "postData";
            jsonData.Active = (options == "publish") ? 1 : 0;
        // edit item    
        } else {
            formData.uri = "/articles/"+item.Id;
		    formData.action = "putData";
        }
	
        formData.data = jsonData;
        setIsSaved(false);
        
        // save and pub
		const response = await axios.post("/__xpr__/pub_engine/business-admin/element/ajax_handler",JSON.stringify(formData), {
			headers: { 
                Auth: auth.user.token,
                "Content-Type": "application/json" 
            },
			withCredentials: true
		});

		// result
		let result = response;
        if (result) {
            setIsSaved(true);
            setItem(result.data);
            // create new form: redirect back to listing page editing form: update states
            if (isCreateNew)
                navigate("/my-business/list");
            else
                navigate({state: {item: result.data}});
        }
    };

    return (
        <>
            <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4">
                <div className="mb-4 mb-lg-0">
                    <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/my-business/" }}>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active>Details</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

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
                                                    <h2 className="heading-2">Details</h2>
                                                    <p className="subheading-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12}>
                                                    {/* ck editor */}
                                                    <Form.Group className="ck-heading mb-4" controlId="title">
                                                        <Form.Label>Title</Form.Label>
                                                        <TextEditor name="Title" value={item.Title} onChange={updateData}/>
                                                    </Form.Group>

                                                    <Form.Group className="mb-4" controlId="description">
                                                        <Form.Label>Description</Form.Label>
                                                        <TextEditor name="Description" value={item.Description} rte={true} onChange={updateData}/>
                                                    </Form.Group>
                                                    
                                                    {/* image editor */}
                                                    <Form.Group className="mb-4">
                                                        <Form.Label>Picture</Form.Label>
                                                        <ImageEditor name="_embedded.Picture" value={item._embedded?.Picture?.SourcePath} onChange={updateData}/>
                                                    </Form.Group>

                                                    <Form.Group className="mb-4" controlId="html">
                                                        <Form.Label>Html</Form.Label>
                                                        <TextEditor name="Html" value={item.Html} rte={true} onChange={updateData}/>
                                                    </Form.Group>
                                                 
                                                    {/* date and time */}
                                                    <Row>
                                                        <Col sm={6}>
                                                            <Form.Label>Date</Form.Label>
                                                            <DateTimePicker name="DisplayDate" value={item.DisplayDate || ""} onChange={updateData}/>
                                                        </Col>
                                                        <Col sm={3}>
                                                            <Form.Label>Start Time</Form.Label>
                                                            <DateTimePicker name="StartTime" value={item.StartTime || ""} viewMode="time" onChange={updateData}/>
                                                        </Col>
                                                        <Col sm={3}>
                                                            <Form.Label>End Time</Form.Label>
                                                            <DateTimePicker name="EndTime" value={item.EndTime || ""} viewMode="time" onChange={updateData}/>
                                                        </Col>
                                                    </Row>    

                                                    {/* content card group */}
                                                    <Form.Group className="mb-4" controlId="card-group">
                                                        <h2 className="heading-2 mt-5 mb-4">Courses</h2>
                                                        <CardGroup className="mb-4">
                                                            {cardValues.map((card, index) => (
                                                            <Card key={index}>
                                                                <Card.Body>
                                                                    {index ? <Button variant="cherry" onClick={e => removeCardFields(index,e)}><i className="xpri-trash"></i></Button> : null}
                                                                    <Form.Group className="mb-3" controlId="title">
                                                                        <Form.Label>Title</Form.Label>
                                                                        <Form.Control type="text" name="title" value={card.title} onChange={e => handleCardChange(index,e)} placeholder="Course title" className="fw-bold text-eggplant"></Form.Control>
                                                                    </Form.Group>
                                                                    <Form.Group className="mb-3" controlId="description">
                                                                        <Form.Label>Description</Form.Label>
                                                                        <Form.Control type="text" name="description" value={card.description} onChange={e => handleCardChange(index,e)} placeholder="BC Mussels, Tomato Coconut Cream, smoked Chili & Lime"></Form.Control>
                                                                    </Form.Group>
                                                                </Card.Body>        
                                                            </Card>
                                                            ))}
                                                        </CardGroup>      
                                                        <Button variant="outline-primary" className="icon" onClick={addCardFields}><i className="xpri-plus"></i></Button>
                                                    </Form.Group>

                                                    <hr/>

                                                    {/* tags */}
                                                    <Form.Group className="mb-4" controlId="tags">
                                                        <h2 className="heading-2 mt-5 mb-4">Tags</h2>
                                                        <section className="tags mb-4">
                                                            {tags.map((el,index) => (
                                                            <Button variant="outline-dark" key={index}>
                                                                <Form.Control type="text" plaintext htmlSize={el.name.length < 11 ? 11 : el.name.length} name="name" value={el.name} onChange={e => handleTagChange(index,e)} placeholder="Add New Tag"></Form.Control>
                                                                <i className="xpri-delete" onClick={e => removeTags(index,e)}></i>
                                                            </Button>
                                                            ))}
                                                        </section>
                                                        <Button variant="outline-primary" className="icon" onClick={addTags}><i className="xpri-plus"></i></Button>
                                                    </Form.Group>

                                                    <fieldset className="d-flex justify-content-end">
                                                        { isCreateNew ? 
                                                        <Dropdown>
                                                            <Dropdown.Toggle as={Button} variant="primary">
                                                                {isSaved ? "Save" : "Saving" } { isSaved ? <span className="icon icon-small ms-1"><FontAwesomeIcon icon={faChevronDown} /></span> : <Spinner animation="border" variant="white" size="sm" className="ms-2"/> }
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-1">
                                                                <Dropdown.Item onClick={e => { submit_content("draft")}}>
                                                                    Save as Draft
                                                                </Dropdown.Item>
                                                                <Dropdown.Item onClick={e => { submit_content("publish")}}>
                                                                    Publish
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                        :
                                                        <Button variant="primary" type="button" onClick={submit_content} className="shadow">
                                                           {isSaved ? "Save" : "Saving" } { !isSaved && <Spinner animation="border" variant="white" size="sm" className="ms-2"/> }
                                                        </Button>
                                                        }
                                                    </fieldset>
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
                                <h2 className="heading-2">SEO</h2>
                                <Form.Group className="mb-3" controlId="DefaultPageTitle">
                                    <Form.Label>Page Title</Form.Label>
                                    <Form.Control type="text" name="PageTitle" defaultValue={item.PageTitle} onChange={e => {updateData(e.target.name,e.target.value)}} placeholder="Enter Page Title"></Form.Control>
                                </Form.Group>
                                
                                <Form.Group className="mb-3" controlId="MetaTagKeywords">
                                    <Form.Label>Keywords</Form.Label>
                                    <Form.Control type="text" name="MetaTagKeywords" defaultValue={item.MetaTagKeywords} onChange={e => {updateData(e.target.name,e.target.value)}} placeholder="Enter Meta Keywords"></Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="MetaTagDescription">
                                    <Form.Label>Meta Tag Description</Form.Label>
                                    <div className="textarea-form-control">
                                        <Form.Control as="textarea" name="MetaTagDescription" defaultValue={item.MetaTagDescription} onChange={e => {updateData(e.target.name,e.target.value)}} placeholder="Enter Meta Description"></Form.Control>
                                    </div>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
            }

            {/* skeleton loader */}
            { !isLoaded &&
                <Row className="mb-5">
                    <Col sm={8}>
                        <Card border="light" className="shadow-sm">
                            <Card.Body>
                                <Row className="justify-content-end align-items-center">
                                    <Col sm={12}>
                                        <div className="mb-4">
                                            <Row className="justify-content-between">
                                                <Col sm={8} className="mb-3">
                                                    <h2 className="heading-2">Details</h2>
                                                    <p className="subheading-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12}>
                                                    <Form.Group className="mb-4">
                                                        <div className="empty w-25 mb-2"></div>
                                                        <div><div className="empty w-50"></div></div>
                                                    </Form.Group>
                                                    <Form.Group className="mb-4">
                                                        <div className="empty w-25 mb-2"></div>
                                                        <div><div className="empty w-75"></div></div>
                                                    </Form.Group>
                                                    <Form.Group className="mb-4">
                                                        <div className="empty w-25 mb-2"></div>
                                                        <div className="empty w-100 fh-250"></div>
                                                    </Form.Group>
                                                    <Form.Group className="mb-4">
                                                        <div className="empty w-25 mb-2"></div>
                                                        <div className="empty"></div>
                                                        <div><div className="empty w-75 mt-2"></div></div>
                                                    </Form.Group>
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
                                <h2 className="heading-2 mb-3">SEO</h2>
                                <div className="empty w-25"></div>
                                <div><div className="empty w-75 mb-3"></div></div>
                                <div className="empty w-25"></div>
                                <div><div className="empty w-50 mb-3"></div></div>
                                <div className="empty w-25"></div>
                                <div className="empty mb-3"></div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            }
        </>
    );
}

export default ListItem;