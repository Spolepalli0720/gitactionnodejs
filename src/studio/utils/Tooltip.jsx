import React from 'react';
import { Tooltip as OverlayTooltip, OverlayTrigger } from "react-bootstrap";

export default function Tooltip(props) {
    return <OverlayTrigger
        placement={props.placement || 'top'}
        overlay={<OverlayTooltip className="studio-tooltip">{props.title}</OverlayTooltip>}
    >{props.children}</OverlayTrigger>
}
