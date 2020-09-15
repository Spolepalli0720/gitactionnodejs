import React from 'react';
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const ToolTip = (props) => {

    const renderTooltip = (id, label) => {
        return <Tooltip id={id} className="tooltip-top"> {label}</Tooltip>
    }

    return (
        <OverlayTrigger
            placement={props.position || 'top'}
            overlay={renderTooltip(props.tooltip[0], props.tooltip[1])}
        >
            {props.children}
        </OverlayTrigger>
    )
}

export default ToolTip;