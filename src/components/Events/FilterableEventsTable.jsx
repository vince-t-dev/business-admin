import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import Footer from "../Footer";

function FilterableEventsTable(props) {
    const [items, setItems] = useState(props.events);
    const [selectedItems, setSelectedItems] = useState([]);

    // get selected items
    const getSelectedItems = e => {
        let selected_item = items.find(a => a.Id == e.target.value);
        // add/remove from selected items list
        if (e.target.checked) {
            selected_item.checked = true;
            if (!selectedItems.filter(item => item.Id == selected_item.Id).length) 
                setSelectedItems(arr => [...arr, selected_item]);
        } else {
            selected_item.checked = false;
            setSelectedItems(selectedItems.filter(item => item.Id != selected_item.Id));
        }
    }

    // toggle all checkboxes
    const toggleAllItems = e => {
        if (e.target.checked) {
            let check_all_items = items.map(a => {a.checked = true;return a;});
            setSelectedItems(check_all_items);
        } else {
            let uncheck_all_items = items.map(a => {a.checked = false;return a;});
            setSelectedItems([]);
        }
    }

    return (
        <>
        <Form>
            {/* list table */}
            <Table responsive="sm">
                <thead>
                    <tr>
                        <th><Form.Check inline onChange={toggleAllItems}/></th>
                        <th className="w-75">Title</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Tickets</th>
                        <th>Payment</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(a => (
                    <tr key={"list-"+a.Id} className={a.checked ? "selected" : null}>
                        <td>
                            <span className="justify-content-start">
                                <Form.Check inline checked={a.checked || false} onChange={getSelectedItems} value={a.Id}/>
                            </span>
                        </td>
                        <td><span><div className="text-truncate" dangerouslySetInnerHTML={{__html: a.Title}}></div></span></td>
                        <td><span className="justify-content-start">{a.CreatedOn}</span></td>
                        <td><span>{a.Location}</span></td>
                        <td><span className="justify-content-center">{a.Tickets}</span></td>
                        <td><span className="text-nowrap">{a.Payment}</span></td>
                        <td>
                            <span>
                                <div className="btn-group">
                                    <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                        <Link to={"/my-business/list/edit/"+a.Id} state={{item: a}} className="btn btn-link"><i data-toggle="tooltip" className="xpri-edit"></i></Link>
                                    </OverlayTrigger>
                                    <OverlayTrigger overlay={<Tooltip>Preview</Tooltip>}>
                                        <a href="" className="btn btn-link" target="_blank"><i data-toggle="tooltip" className="xpri-preview"></i></a>
                                    </OverlayTrigger>
                                    <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                                        <button type="button" className="btn btn-link"><i data-toggle="tooltip" className="xpri-delete"></i></button>
                                    </OverlayTrigger>
                                </div>
                            </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </Table>
        </Form>
        <Footer selectedItems={selectedItems}/>
        </>
    )
}

export default FilterableEventsTable;