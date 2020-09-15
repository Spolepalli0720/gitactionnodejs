import React from 'react';
import { Tooltip as OverlayTooltip, OverlayTrigger } from "react-bootstrap";

export default function Infotip(props) {
    return <OverlayTrigger
        placement={props.placement || 'right'}
        overlay={<OverlayTooltip className="studio-infotip">{props.title}</OverlayTooltip>}
    >{props.children}</OverlayTrigger>
}
