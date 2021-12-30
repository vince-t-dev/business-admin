import React, {useState} from "react";
import { Row, Col, Stack, Form, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Routes } from "../routes";

export default (props) => {
  	const showSettings = props.showSettings;
  	const toggleSettings = (toggle) => {
    	props.toggleSettings(toggle);
  	}

    // modal
    const [modalDeleteItems, setModalDeleteItems] = useState(false);
    const handleClose = () => setModalDeleteItems(false);

    // delete items 
    const openModalDeleteItems = e => {
        setModalDeleteItems(true);
    }

    // toggle status
    const toggleStatus = e => {
        if (e.target.value == "Published") {
            props.selectedItems.map(a => {
                document.getElementById("switch-status-"+a.Id).checked = true;
            });
        }
        if (e.target.value == "Unpublished") {
            props.selectedItems.map(a => {
                document.getElementById("switch-status-"+a.Id).checked = false;
            });
        }
    }  

  	return (
    	<>
        {<footer id="nav-footer" className="footer py-3 px-4">
            <Stack direction="horizontal" gap={3}>
                <p className="text-sm-left text-danger">
                    <button type="button" className="btn btn-link p-0 text-danger" onClick={openModalDeleteItems}>
                        <i className="xpri-delete me-2"></i>
                    </button>
                    Delete Selected ({props.selectedItems.length})
                </p>
                <div className="vr"/>
                <Form.Group className="d-flex align-items-center">
                    <Form.Label className="text-nowrap m-0 me-3">Set Status:</Form.Label>
                    <Form.Select onChange={toggleStatus}>
                        <option>Select</option>
                        <option value="Published">Published</option>
                        <option value="Unpublished">Unpublished</option>
                    </Form.Select>
                </Form.Group>
            </Stack>
            {/* modal: confirm delete items */}
            <Modal centered show={modalDeleteItems} onHide={handleClose}>
                <Modal.Header closeButton closeVariant="white"> 
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete the Article:</p>
                    <ul> {                        
                        props.selectedItems.map((a,index) => (
                            <li key={"li-"+a.Id}>{a.Title}</li>
                        ))
                    }
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </footer>}
        </>
  );
};
