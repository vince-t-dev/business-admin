import React, {useState} from "react";
import { Stack, Form, Modal, Button } from 'react-bootstrap';

export default (props) => {
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
        {<footer className={"footer py-3 px-4 "+ (props.selectedItems.length ? "active": "")}>
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
            <Modal centered show={modalDeleteItems} onHide={handleClose} size="md">
                <Modal.Header closeButton closeVariant="white"> 
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete the Article:</p>
                    <ul> {                        
                        props.selectedItems.map((a,index) => (
                            <li key={"li-"+a.Id} dangerouslySetInnerHTML={{__html: a.Title || a.Name || a.FirstName || "Id: "+a.Id}}></li>
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
