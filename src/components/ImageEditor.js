import React, { useState } from "react";
import { Row, Col, Form, Card, Button } from "react-bootstrap";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCropAlt } from '@fortawesome/free-solid-svg-icons';

function ImageEditor(props) {
    // cropper js
    // media zoom
    const [cropper, setCropper] = useState();
    const [image, setImage] = useState(props.value);
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
    // on crop
    const crop = () => {
        if (typeof cropper !== "undefined") {
            let crop_data = cropper.getCroppedCanvas().toDataURL();
            cropper.replace(crop_data);
            let base64_image_content = crop_data.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            props.updateData(props.name, base64_image_content);
        }
    };

    return (
        <>
            <Card className="media-wrapper">
                <Cropper
                    src={image}
                    autoCrop={true}
                    autoCropArea={1}
                    style={{ height: 300, width: "100%" }}
                    //initialAspectRatio={16 / 9}
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
                        <Col className="d-flex align-items-center justify-content-end">
                            <Form.Group controlId="crop">
                                <Button variant="primary" className="icon" onClick={crop}>
                                    <FontAwesomeIcon icon={faCropAlt} size="xs"/>    
                                </Button>
                            </Form.Group>
                            <Form.Group controlId="picture-1">
                                <Form.Label className="btn btn-primary icon m-0 ms-2"><i className="xpri-image text-white"></i></Form.Label>
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