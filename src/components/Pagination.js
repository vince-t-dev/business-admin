import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function CustomPagination(props) {
    const [activeItem, setActiveItem] = useState(Number(props.page));
    const totalPages = props.totalPages;
    const navigate = useNavigate();
  
    useEffect(() => {
        navigate(props.href+activeItem);        
    },[activeItem]);

    const onPrevItem = () => {
        const prevActiveItem = activeItem == 1 ? activeItem : activeItem - 1;
        setActiveItem(prevActiveItem);
    };
  
    const onNextItem = (totalPages) => {
        const nextActiveItem = activeItem == totalPages ? activeItem : activeItem + 1;
        setActiveItem(nextActiveItem);
    };
  
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
        const isItemActive = activeItem == number;
        const handlePaginationChange = () => {
            setActiveItem(number);
            navigate(props.href+number);
        };
        items.push(
            <Pagination.Item active={isItemActive} key={number} onClick={handlePaginationChange}>
                {number}
            </Pagination.Item>
        );
    }

    return (
        <>
            <Pagination>
                <Pagination.Prev onClick={onPrevItem}/>
                {items}
                <Pagination.Next onClick={() => onNextItem(totalPages)}/>
            </Pagination>
        </>
    );
}

export default CustomPagination;