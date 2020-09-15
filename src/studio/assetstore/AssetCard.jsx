import React from 'react';
import Aux from '../../hoc/_Aux';
import { Card, Row, Col, CardBody } from 'reactstrap';
// import { CardFooter } from 'reactstrap';
// import Switch from "react-switch";
import Tooltip from '../utils/Tooltip';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { getImage } from '../modeler/StudioImageMap';

import ScraperWizard from './ScraperWizard';

const SELECT_ICON = {
    "Connector": { "icon": <i className="fa fa-plug " aria-hidden="true"></i> },
    "Template": { "icon": <i className="fa fa-object-ungroup" aria-hidden="true"></i> },
    "Scraper": { "icon": <i className="fa fa-object-ungroup" aria-hidden="true"></i> }
}
const MENU_OPTION = [
    { label: "View", key: "view", icon: <i className="far fa-eye" aria-hidden="true"></i> },
    // { label: "Configure", key: "configure", icon: <i className="fa fa-cogs" aria-hidden="true"></i> },
    { label: "Test", key: "test", icon: <i className="far fa-check-circle" aria-hidden="true"></i> },
    { label: "Delete", key: "delete", icon: <i className="far fa-trash-alt" aria-hidden="true"></i> },
]

export default class AssetCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "checked": false,
            'data': this.props.data,
            "isOpen": false,
        };
    }

    switchChange = (checked, ele) => {
        this.state.data.map((val) => {
            if (ele.id === val.id) {
                val.enable = checked;
            }
            let data = this.state.data
            this.setState({ data: data })
            return data
        })
    }

    assetAction = (action, asset) => {
        if (action === "cancel") {
            this.setState({
                action: undefined,
                asset: undefined,
                isOpen: false
            })
        } else if (action === "delete") {
            this.props.cardAction(action, asset)
        } else if (action === "configure" && 'Scraper' === this.props.selected) {
            this.setState({
                action: action,
                asset: asset,
                isOpen: !this.state.isOpen
            })
        } else if (action === "view" && 'Scraper' === this.props.selected) {
            this.setState({
                action: action,
                asset: asset,
                isOpen: !this.state.isOpen
            })
        }
    }

    toggleModal = (e) => {
        e.preventDefault();
        this.setState({
            isOpen: !this.state.isOpen,
            data: this.props.data.scraperConfigValues
        })
    }

    render() {
        return (
            <Aux>
                {this.props.data.map((asset, assetIndex) => {
                    return (
                        <Col key={assetIndex}>
                            <Card className='studio-card'>
                                <div className='mt-1 asset-types pb-0 justify-content-end float-right'>
                                    <div>{SELECT_ICON[this.props.selected]?.icon}&nbsp;&nbsp;{this.props.selected.toUpperCase()}</div>
                                    <div className="dropdown">
                                        <button className="btn p-0 pr-2 dropdown-btnn" type="button" data-toggle="dropdown">
                                            <i className="fa fa-ellipsis-v pl-2 " aria-hidden="true"></i></button>
                                        <ul className="dropdown-menu dropp-menu">
                                            {MENU_OPTION.map((menuItem, menuIndex) =>
                                                <li key={menuIndex} className='menu-list-style'
                                                    onClick={() => this.assetAction(menuItem.key, asset)}
                                                >{menuItem.icon}&nbsp;{menuItem.label}</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className='round-left-split'>
                                    <fieldset className="title">
                                        <legend>
                                            <div className='text-center round-img-border'>
                                                <img className='mt-2 img-icon-size' src={getImage(asset.template)} alt=' ' />
                                            </div>
                                        </legend>
                                    </fieldset>
                                </div>
                                <CardBody className='pt-2 pr-2 pb-0 pl-2'>
                                    <Row className='pt-0 mt-0'>
                                        <Col className='mt-0 pt-0'>
                                            <Row>
                                                <Col className='assets-org text-left pb-0'>
                                                    <p className='pb-0 mb-0'>{asset.organization}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs='10' className='assets-name text-left  pr-0 pt-1 pb-0 mb-0 '>
                                                    <Tooltip title={asset.title}><h5 className=' assets-name-font'>{asset.title}</h5></Tooltip></Col>
                                                <Col xs='2' className='assets-name text-right float-right pl-0 pt-1 pb-0 mb-0 pr-0'><h5 className='assets-name-font'>v{asset.version}</h5></Col>
                                            </Row>
                                            <Row><Col className='pt-1 pr-0'><p className='assets-description mt-1 mb-0 text-justify'>{asset.description}</p></Col></Row>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    )
                })}

                <Modal isOpen={this.state.isOpen && (this.state.action === "configure" || "view") && 'Scraper' === this.props.selected} size={"xl"} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal} >
                        Configure {this.state.asset && this.state.asset.title}
                    </ModalHeader>
                    <ModalBody className="p-0">
                        <ScraperWizard data={this.state.asset} action={this.state.action} assetAction={this.assetAction.bind(this)} />
                    </ModalBody>
                </Modal>
            </Aux>
        )
    }
}
