import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import AssetCard from './AssetCard';
import { confirmDelete, inputField } from "../utils/StudioUtils";
import { BasicSpinner } from "../utils/BasicSpinner"
import { notifySuccess, notifyError } from '../utils/Notifications';
import NewScraper from './NewScraper';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { assetStoreService } from "../services/AssetStoreService";

import './AssetStore.scss';

export default class AssetStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            data: [],
            selected: '',
            loading: true,
            isOpen: false,
        }
    }

    componentDidMount() {
        assetStoreService.getTemplates().then(response => {
            let options = response.map(arrayItem => arrayItem.type !== undefined && (arrayItem.category)).filter((value, index, self) => self.indexOf(value) === index).sort().map(option => ({ label: option, value: option }));
            options = options.filter(option => ['Dataset', 'Model'].indexOf(option.value) < 0)
            this.setState({
                loading: false,
                options: options,
                data: response,
                selected: options[0]?.value
            })
        }).catch(error => {
            this.setState({ loading: false })
            console.error('AssetStoreService.getTemplates:', error);
            notifyError('Unable to retrieve Templates', error.message);
        })
    }

    onChangeInputField = (key, value) => {
        this.setState({ [key]: value, isOpen: false })
    }

    cardAction = (action, cardElement) => {
        if (action === "delete") {
            confirmDelete().then(userInput => {
                if (!userInput.dismiss) {
                    notifySuccess('Delete Asset', 'Asset has been permanently removed');
                }
            })
        }
    }

    toggleModal = (e) => {
        e.preventDefault();
        this.setState({
            isOpen: !this.state.isOpen,
        })
    }

    render() {
        const { options, loading } = this.state;

        return (
            <section className="studio-container">
                {loading &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!loading &&
                    <div>
                        <h3 className='studio-primary pt-3 pl-2'>Assets Store</h3>
                        <Row className='mt-1'>
                            <Col>
                                {inputField('select', 'selected', '', this.state.selected, this.onChangeInputField.bind(this), {
                                    container: 'float-left'
                                }, options)}
                                <button
                                    className="btn-sm btn-round btn-primary ml-1 pr-2 pl-2 content-float-right"
                                    onClick={this.toggleModal}>
                                    <i className="feather icon-plus fa-lg mr-1"></i>Create
                                </button>
                            </Col>
                        </Row>
                        <Row xs='1' md='3'>
                            <AssetCard
                                data={this.state.data.filter(dataItem => dataItem.category === this.state.selected)}
                                selected={this.state.selected}
                                cardAction={(ele) => this.cardAction.bind(this)}
                            />
                        </Row>
                    </div>
                }
                <Modal isOpen={this.state.isOpen && this.state.selected === 'Scraper'} size={"xl"}>
                    <ModalHeader toggle={this.toggleModal} >
                        Create Scraper
                    </ModalHeader>
                    <ModalBody>
                        <NewScraper />
                    </ModalBody>
                </Modal>
            </section>
        )
    }
}
