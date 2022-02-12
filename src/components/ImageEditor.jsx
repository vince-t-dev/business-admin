import React, { useState, useEffect } from "react";
import { Row, Col, Form, Card, Button } from "react-bootstrap";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCropAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../context/auth";
import axios from "axios";

function ImageEditor(props) {
    let auth = useAuth();
    // cropper js
    // media zoom
    const [cropper, setCropper] = useState();
    const [enableCrop, setEnableCrop] = useState(false);
    const [image, setImage] = useState(props.value);
    const zoomMedia = e => {
        let target = e.target;
        const min = target.min;
        const max = target.max;
        const val = target.value;
        target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
        cropper.zoomTo(val);
    }
    
    // convert base64 to blob
    function base64ToBlob(base64, mime) {
        mime = mime || "";
        var sliceSize = 1024;
        var byteChars = window.atob(base64);
        var byteArrays = [];
        for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) { var slice = byteChars.slice(offset, offset + sliceSize);var byteNumbers = new Array(slice.length);for (var i = 0; i < slice.length; i++) { byteNumbers[i] = slice.charCodeAt(i); }var byteArray = new Uint8Array(byteNumbers);byteArrays.push(byteArray); }
        return new Blob(byteArrays, {type: mime});
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
            // upload to server
            uploadFile(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };
    
    // on crop
    const crop = () => {
        if (typeof cropper !== "undefined") {
            let crop_data = cropper.getCroppedCanvas().toDataURL();
            // update crop data and image preview
            cropper.replace(crop_data);
            setImage(crop_data);
            setEnableCrop(false);
            // upload to server
            uploadFile(crop_data);
        }
    };

    // upload file
    const uploadFile = (file) => {
        // get blob data
        let base64_image_content = file.replace(/^data:image\/(png|jpg|jpeg|webp|svg+xml);base64,/, "");
        let image_to_upload = base64ToBlob(base64_image_content, "image/png");   
        // upload file
        let formData = new FormData();
        let timestamp = Math.floor(Date.now() / 1000);
        formData.append("overwrite",0);
        formData.append("unzip",0);
        formData.append("files[]",image_to_upload,"xpr-business-"+timestamp+".png");  

        axios.post("/api/files/",formData, {
            headers: { 
                "xpr-token-backend": auth.user.token,
                "x-xsrf-token": auth.user.xsrf_token,
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        })
        .then(function(response) {
            props.onChange(props.name, { Id: response.data.Id});
        });
    }

    return (
        <>
            <Card className="media-wrapper">
                <div className="image-container">
                    <img src={image} className={enableCrop ? "d-none" : "image-preview"}/>
                    <div className={enableCrop ? "" : "invisible"}>
                        <Cropper
                            src={image}
                            autoCrop={true}
                            autoCropArea={0}
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
                    </div>
                </div>
                <Card.Footer>
                    <Row className="align-items-center justify-content-between">
                        <Col></Col>
                        <Col xs={6} className="text-center">
                            <Form.Range defaultValue="0.5" min="0" max="1" step="0.0001" onChange={zoomMedia} className={enableCrop ? "d-inline" : "d-none"}/>
                        </Col>
                        <Col className="d-flex align-items-center justify-content-end">
                            <Form.Group controlId="crop">
                                <Button variant="primary" className={(enableCrop || !image) ? "d-none" : "icon"} onClick={setEnableCrop}>
                                    <FontAwesomeIcon icon={faCropAlt} size="xs"/>    
                                </Button>
                                <Button variant="primary" className={enableCrop ? "icon bg-cherry" : "d-none"} onClick={e => { setEnableCrop(false) }}>
                                    <i className="xpri-close text-white font-sm"></i>   
                                </Button>
                                <Button variant="primary" className={enableCrop ? "icon bg-green ms-2" : "d-none"} onClick={crop}>
                                    <i className="xpri-check text-white"></i>
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