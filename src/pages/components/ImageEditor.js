import React, { useState } from "react";
import { Row, Col, Form, Card } from "react-bootstrap";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function ImageEditor(props) {
    // cropper js
    // media zoom
    const [cropper, setCropper] = useState();
    const [image, setImage] = useState(props.src);
    const zoomMedia = e => {
        let target = e.target;
        const min = target.min;
        const max = target.max;
        const val = target.value;
        target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
        cropper.zoomTo(val);
    }
    // on media change
    const onChange = e => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) 
            files = e.dataTransfer.files;
        else if (e.target)
            files = e.target.files;
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    return (
        <>
            <Card className="media-wrapper">
                <Cropper
                    src={image}
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
                <Card.Footer>
                    <Row className="align-items-center justify-content-between">
                        <Col></Col>
                        <Col xs={6} className="text-center"><Form.Range defaultValue="0.5" min="0" max="1" step="0.0001" onChange={zoomMedia}/></Col>
                        <Col className="text-end">
                            <Form.Group controlId="picture-1">
                                <Form.Label className="btn btn-primary icon"><i className="xpri-image text-white"></i></Form.Label>
                                <Form.Control type="file" onChange={onChange} className="d-none"/>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </>
    );
}

export default ImageEditor;