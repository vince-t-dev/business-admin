import React,{useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, Button, Row, Col, InputGroup, Form, Card, Table, Badge } from 'react-bootstrap';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

// ckeditor 5
import { CKEditor } from '@ckeditor/ckeditor5-react';
// integrated from online builder
import InlineEditor from 'ckeditor5-custom-build/build/ckeditor';
const editorTextConfig = {
    toolbar: ["bold","italic","underline","undo","redo"]
};
const editorRTEConfig = {
    toolbar: ["bold","italic","underline","link","|","fontSize","alignment","bulletedList","numberedList","blockQuote","|","imageUpload","mediaEmbed","insertTable","undo","redo"],
    image: {
        resizeUnit:"px",
        toolbar: ["imageTextAlternative","imageStyle:alignLeft","imageStyle:full","imageStyle:alignRight"],
        styles: ["full","alignLeft","alignRight"]
    },
    ckfinder: {
        uploadUrl: "/elementAjax/FEE/File Uploader",
        options: {
            resourceType: 'Images'
        }
    }
};

function ListItem(props) {
    const location = useLocation();
    const item = location.state.item;
    
    // cropper media zoom
    const [cropper, setCropper] = useState();
    const zoomMedia = e => {
        let target = e.target;
        const min = target.min;
        const max = target.max;
        const val = target.value;
        target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
        cropper.zoomTo(val);
    }

    return (
        <>
            <div className="d-lg-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-4">
                <div className="mb-4 mb-lg-0">
                    <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/list" }}>Dashboard</Breadcrumb.Item>
                        <Breadcrumb.Item active>Details</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </div>

            <Form className="form-content-update">
                <Row>
                    <Col sm={8}>
                        <Card border="light" className="shadow-sm">
                            <Card.Body>
                                <Row className="justify-content-end align-items-center mb-3">
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
                                                    <Form.Group className="ck-heading mb-4" controlId="title">
                                                        <Form.Label>Title</Form.Label>
                                                        <CKEditor
                                                            editor={ InlineEditor }
                                                            config={ editorTextConfig }
                                                            data={item.Title}
                                                            onReady={ editor => {
                                                                editor.model.schema.extend("paragraph", {isLimit: true});
                                                            } }
                                                            onBlur={ ( event, editor ) => {
                                                                const data = editor.getData();
                                                                console.log( 'Blur.', data );
                                                            } }
                                                        />
                                                    </Form.Group>

                                                    <Form.Group className="mb-4" controlId="description">
                                                        <Form.Label>Description</Form.Label>
                                                        <CKEditor
                                                            editor={ InlineEditor }
                                                            config={ editorRTEConfig }
                                                            data={item.Description}
                                                            onReady={ editor => {
                                                            } }
                                                            onBlur={ ( event, editor ) => {
                                                                const data = editor.getData();
                                                                console.log( 'Blur.', data );
                                                            } }
                                                        />
                                                    </Form.Group>

                                                     { item._embedded.Picture && 
                                                     <Form.Group className="mb-4" controlId="picture">
                                                        <Form.Label>Picture</Form.Label>
                                                        <section className="media-wrapper">
                                                            <Cropper
                                                                src={item._embedded.Picture.SourcePath}
                                                                style={{ height: 300, width: "100%" }}
                                                                initialAspectRatio={16 / 9}
                                                                guides={false}
                                                                background={false}
                                                                dragMode={"crop"}
                                                                viewMode={2}
                                                                onInitialized={(instance) => {
                                                                    setCropper(instance);
                                                                }}
                                                            />
                                                            <footer>
                                                                <Row className="align-items-center justify-content-between">
                                                                    <Col></Col>
                                                                    <Col xs={6} className="text-center"><Form.Range defaultValue="0.5" min="0" max="1" step="0.0001" onChange={zoomMedia}/></Col>
                                                                    <Col className="text-end"><Button variant="primary" type="button" className="icon"><i className="xpri-image"></i></Button></Col>
                                                                </Row>
                                                            </footer>
                                                        </section>
                                                    </Form.Group>}

                                                    <Form.Group className="mb-4" controlId="html">
                                                        <Form.Label>Html</Form.Label>
                                                        <CKEditor
                                                            editor={ InlineEditor }
                                                            config={ editorRTEConfig }
                                                            data={item.Html}
                                                            onReady={ editor => {
                                                            } }
                                                            onBlur={ ( event, editor ) => {
                                                                const data = editor.getData();
                                                                console.log( 'Blur.', data );
                                                            } }
                                                        />
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
                                <h2 className="heading-2">SEO</h2>
                                <Form.Group className="mb-3" controlId="DefaultPageTitle">
                                    <Form.Label>Page Title</Form.Label>
                                    <Form.Control type="text" name="PageTitle" defaultValue={item.PageTitle}></Form.Control>
                                </Form.Group>
                                
                                <Form.Group className="mb-3" controlId="MetaTagKeywords">
                                    <Form.Label>Keywords</Form.Label>
                                    <Form.Control type="text" name="MetaTagKeywords" defaultValue={item.MetaTagKeywords}></Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="MetaTagDescription">
                                    <Form.Label>Meta Tag Description</Form.Label>
                                    <div className="textarea-form-control">
                                        <Form.Control as="textarea" name="MetaTagDescription" defaultValue={item.MetaTagDescription}></Form.Control>
                                    </div>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default ListItem;