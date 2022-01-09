import React, { useEffect, useState } from "react";
import { Link, useLocation, useMatch } from "react-router-dom";
import { Breadcrumb, Button, Row, Col, Form, Card, CardGroup } from "react-bootstrap";
import TextEditor from "./components/TextEditor";
import ImageEditor from "./components/ImageEditor";

function ListItem(props) {
    const location = useLocation();
    const match = useMatch("/my-business/list/edit/:id");

    // fetch data from location or api
    const [error, setError] = useState(null);
    const [item, setItem] = useState(null);
    const [jsonData, setJsonData] = useState({});
    useEffect(() => {
        if (location.state) {
            let data = location.state.item;
            setItem(data);
        } else {
            fetch(`/__xpr__/pub_engine/business-admin/element/article_json?id=`+match.params.id)
                .then(res => res.json())
                .then(
                (result) => {
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
        let data = updateObject(jsonData, name, value);
        setJsonData(data);
    }

    // upload image
    function base64ToBlob(base64, mime) {
        mime = mime || "";
        var sliceSize = 1024;
        var byteChars = window.atob(base64);
        var byteArrays = [];
        for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) { var slice = byteChars.slice(offset, offset + sliceSize);var byteNumbers = new Array(slice.length);for (var i = 0; i < slice.length; i++) { byteNumbers[i] = slice.charCodeAt(i); }var byteArray = new Uint8Array(byteNumbers);byteArrays.push(byteArray); }
        return new Blob(byteArrays, {type: mime});
    }

    // TODO: submit form
    const submit = e => {
        e.preventDefault();
        console.log('jsonData',jsonData);
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
            <Form className="form-content-update" onSubmit={submit}>
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
                                                        <TextEditor name="Title" data={item.Title} updateData={updateData}/>
                                                    </Form.Group>

                                                    <Form.Group className="mb-4" controlId="description">
                                                        <Form.Label>Description</Form.Label>
                                                        <TextEditor name="Description" data={item.Description} rte={true} updateData={updateData}/>
                                                    </Form.Group>
                                                    
                                                    {/* image editor */}
                                                    <Form.Group className="mb-4">
                                                        <Form.Label>Picture</Form.Label>
                                                        <ImageEditor name="_embedded.Picture" data={item._embedded && item._embedded.Picture ? item._embedded.Picture.SourcePath : null} updateData={updateData}/>
                                                    </Form.Group>

                                                    <Form.Group className="mb-4" controlId="html">
                                                        <Form.Label>Html</Form.Label>
                                                        <TextEditor name="Html" data={item.Html} rte={true} updateData={updateData}/>
                                                    </Form.Group>
                                                 
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
                                                        <Button type="submit" variant="primary" className="shadow">Submit</Button>
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
                                    <Form.Control type="text" name="MetaTagKeywords" defaultValue={item.MetaTagKeywords} placeholder="Enter Meta Keywords"></Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="MetaTagDescription">
                                    <Form.Label>Meta Tag Description</Form.Label>
                                    <div className="textarea-form-control">
                                        <Form.Control as="textarea" name="MetaTagDescription" defaultValue={item.MetaTagDescription} placeholder="Enter Meta Description"></Form.Control>
                                    </div>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
            }
        </>
    );
}

export default ListItem;