import React, { useState } from "react";
import { Row, Col, Form, Card, Button } from "react-bootstrap";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCropAlt } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from "../context/auth";
import axios from "axios";

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
    // convert base64 to blob
    function base64ToBlob(base64, mime) {
        mime = mime || "";
        var sliceSize = 1024;
        var byteChars = window.atob(base64);
        var byteArrays = [];
        for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) { var slice = byteChars.slice(offset, offset + sliceSize);var byteNumbers = new Array(slice.length);for (var i = 0; i < slice.length; i++) { byteNumbers[i] = slice.charCodeAt(i); }var byteArray = new Uint8Array(byteNumbers);byteArrays.push(byteArray); }
        return new Blob(byteArrays, {type: mime});
    }
    let auth = useAuth();
    // on crop
    const crop = () => {
        if (typeof cropper !== "undefined") {
            let crop_data = cropper.getCroppedCanvas().toDataURL();
            cropper.replace(crop_data);
            let base64_image_content = crop_data.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            let image_to_upload = base64ToBlob(base64_image_content, "image/jpeg");   
            props.updateData(props.name, image_to_upload);



            let formData = new FormData();
            
		formData.append("uri" ,"/files/");
		formData.append("action", "postData");
        formData.append("upload", image_to_upload, "rc-image-1.jpeg");
    console.log('formData',formData);    
		axios.post("/__xpr__/pub_engine/business-admin/element/ajax_handler",formData, {
			headers: { 
                Auth: auth.user.token,
                "Content-Type": "multipart/form-data" 
            },
			withCredentials: true
		})
        .then(function(response) {
            console.log('response!',response);
        });
        


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