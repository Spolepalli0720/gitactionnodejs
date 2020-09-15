import React from 'react';
import { Row, Col, Card, CardBody, CardFooter, Modal, ModalHeader, ModalBody } from 'reactstrap';

import Tooltip from "../utils/Tooltip";
import StudioFilter from "../utils/StudioFilter";
import StoreConfig from './StoreConfig';

import { getImage } from '../modeler/StudioImageMap';
import { dataStoreService } from '../services/DataStoreService';
import { notifySuccess, notifyError } from '../utils/Notifications';
import { confirmDelete, actionButton, ACTION_BUTTON } from "../utils/StudioUtils";
import { BasicSpinner } from "../utils/BasicSpinner";

import './Stores.scss';

export default class Stores extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            templates: [],
            filteredTemplates: [],
            templateLayout: 0,
            templateLoading: true,

            dataStores: [],
            filteredStores: [],
            dataLayout: 0,
            dataLoading: true,

            showModal: false,
            storeAction: '',
            storeConfig: undefined
        }
    }

    componentDidMount() {
        const parent = this;
        dataStoreService.getTemplates().then(response => {
            this.setState({ templateLoading: false, templates: response });
        }).catch(error => {
            parent.setState({ templateLoading: false });
            console.error('dataStoreService.getTemplates:', error);
            notifyError('Unable to retrieve templates', error.message);
        });

        dataStoreService.getDataStores().then(response => {
            this.setState({ dataLoading: false, dataStores: response });
        }).catch(error => {
            parent.setState({ dataLoading: false });
            console.error('dataStoreService.getDatastores:', error);
            notifyError('Unable to retrieve datastores', error.message);
        });

    }

    onChangeDataStoresFilter(filteredData) {
        this.setState({ filteredStores: filteredData })
    }

    onChangeTemplatesFilter(filteredData) {
        this.setState({ filteredTemplates: filteredData })
    }

    addDataStore() {
        this.setState({ storeAction: 'addDataStore', showModal: true })
    }

    createDataStore(template) {
        let dataStore = JSON.parse(JSON.stringify(template))
        delete dataStore.id;
        this.setState({ storeAction: 'create', storeConfig: dataStore });
    }

    editDataStore(dataStore) {
        this.setState({ storeAction: 'update', storeConfig: dataStore });
    }

    cancelStoreConfig() {
        this.setState({ storeAction: '', storeConfig: undefined });
    }

    saveStoreConfig(storeConfig) {
        const { storeAction, dataStores } = this.state;
        if ('create' === storeAction) {
            dataStoreService.createDataStore(storeConfig).then(response => {
                dataStores.push(response);
                this.setState({ dataStores: dataStores, storeAction: '', storeConfig: undefined })
            }).catch(error => {
                console.error('dataStoreService.createDataStore:', error);
                notifyError('Unable to create DataStore', error.message);
            });
        } else if ('update' === storeAction) {
            dataStoreService.updateDataStore(storeConfig).then(response => {
                let dataStore = dataStores.filter(arrayItem => arrayItem.id === storeConfig.id)[0]
                Object.keys(response).forEach(function (dataKey) {
                    dataStore[dataKey] = response[dataKey];
                });
                this.setState({ dataStores: dataStores, storeAction: '', storeConfig: undefined })
            }).catch(error => {
                console.error('dataStoreService.updateDataStore:', error);
                notifyError('Unable to update DataStore', error.message);
            });
        }
    }

    deleteDataStore(storeId) {
        const { dataStores } = this.state;
        const parent = this;
        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                // let actionComment = userInput.value;
                dataStoreService.deleteDataStore(storeId).then(resp => {
                    notifySuccess('Delete DataStore', 'DataStore has been permanently removed');
                    let dataStore = dataStores.filter(dataStore => dataStore.id === storeId)[0];
                    dataStore.status = "ARCHIVED";
                    parent.setState({ dataStores: dataStores });
                }).catch(error => {
                    console.error('dataStoreService.deleteDataStore:', error);
                    notifyError('Unable to delete DataStore', error.message);
                });
            }
        });
    }

    getDataStoreCard(dataStore) {
        const { dataLayout } = this.state;
        return <Card className="studio-card mb-1">
            <CardBody>
                <Row>
                    <Col className='font-weight-bold'>{dataStore.dataSource}</Col>
                    {dataLayout === 0 && <Col className='text-right text-muted small text-uppercase'>{dataStore.type}</Col>}
                </Row>
                <Row>
                    <Col sm='auto'><img className='datastore-icon' src={getImage(dataStore.dataSource)} alt=' ' /></Col>
                    <Col className='pt-0'>
                        <p className='mt-1 mb-2 font-weight-bold text-truncate'>{dataStore.title}</p>
                        <p className='mb-0 text-truncate'>{dataStore.properties['Connection'].filter(arrayItem => arrayItem.id === 'url')[0].value}</p>
                    </Col>
                </Row>
            </CardBody>
            <CardFooter>
                <Row>
                    <Col className='text-right'>
                        {actionButton('Delete', this.deleteDataStore.bind(this, dataStore.id), 'mt-1 ml-1 mr-1', 'feather icon-trash-2', true)}
                        {actionButton('Configure', this.editDataStore.bind(this, dataStore), 'mt-1 ml-1 mr-1', 'feather icon-edit', true)}
                    </Col>
                </Row>
            </CardFooter>
        </Card>
    }

    renderStores() {
        const { dataLayout, dataStores, filteredStores } = this.state;
        let storeGroups = filteredStores.map(arrayItem => arrayItem.type !== undefined && (arrayItem.type)).filter((value, index, self) => self.indexOf(value) === index);

        let filterKeys = [
            { label: 'Data Source', key: 'dataSource' },
            {
                label: 'Type', key: 'type', options: [
                    { label: 'NoSQL', value: 'nosql' },
                    { label: 'SQL', value: 'sql' }
                ]
            },
            { label: 'Active', key: 'active' },
            { label: 'Created By', key: 'createdBy' },
            { label: 'Modified By', key: 'modifiedBy' }
        ];


        return <div>
            <Row xs="1" md="1">
                <Col>
                    {actionButton('Configure', this.addDataStore.bind(this), 'content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)}

                    <StudioFilter
                        // searchKeys={searchKeys}
                        filterKeys={filterKeys}
                        data={dataStores.filter(dataStore => dataStore.status !== 'ARCHIVED')}
                        // defaultFilter={defaultFilter}
                        onChangeFilter={this.onChangeDataStoresFilter.bind(this)} />
                    {dataLayout === 0 &&
                        actionButton('List View', () => { this.setState({ dataLayout: 1 }) }, 'm-0 mt-1 content-float-right', 'feather icon-list')
                    }
                    {dataLayout === 1 &&
                        actionButton('Grid View', () => { this.setState({ dataLayout: 0 }) }, 'm-0 mt-1 content-float-right', 'feather icon-grid')
                    }
                </Col>
            </Row>
            {dataLayout === 0 &&
                <Row xs="1" md={3}>
                    {filteredStores.map((dataStore, storeIndex) =>
                        <Col className="cards-container" key={storeIndex}>
                            {this.getDataStoreCard(dataStore)}
                        </Col>
                    )}
                </Row>
            }
            {dataLayout === 1 && storeGroups.map((group, groupIndex) =>
                <div key={groupIndex}>
                    <Row><Col className='text-uppercase'>{group}</Col></Row>
                    <Row xs="1" md={3}>
                        {filteredStores.map((dataStore, storeIndex) => dataStore.type === group &&
                            <Col className="cards-container" key={storeIndex}>
                                {this.getDataStoreCard(dataStore)}
                            </Col>
                        )}
                    </Row>
                </div>
            )}
        </div>
    }

    getTemplateCard(template) {
        const { templateLayout } = this.state;
        return <Tooltip title='Click to add from Template'>
            <Card className={"studio-card" + (templateLayout === 0 ? ' mb-2' : ' mb-3')} onClick={() => { this.createDataStore(template) }}>
                <CardBody>
                    {templateLayout === 0 &&
                        <Row><Col className='text-right small text-uppercase'>{template.type}</Col></Row>
                    }
                    <Row>
                        <Col sm='auto'><img className='datastore-icon' src={getImage(template.dataSource)} alt=' ' /></Col>
                        <Col className='mt-2 pt-1'><p>{template.dataSource}</p></Col>
                    </Row>
                </CardBody>
            </Card>
        </Tooltip>
    }

    renderTemplates() {
        const { templateLayout, templates, filteredTemplates } = this.state;
        let templateGroups = filteredTemplates.map(arrayItem => arrayItem.type !== undefined && (arrayItem.type)).filter((value, index, self) => self.indexOf(value) === index);

        let filterKeys = [
            {
                label: 'Type', key: 'type', options: [
                    { label: 'NoSQL', value: 'nosql' },
                    { label: 'SQL', value: 'sql' }
                ]
            }
        ];

        return <div>
            <Row xs="1" md="1" className={'ml-0 mr-0' + (templateLayout === 0 ? ' mb-2' : '')}>
                <Col className='pl-1 pr-1'>
                    <StudioFilter
                        // searchKeys={searchKeys}
                        filterKeys={filterKeys}
                        data={templates.filter(template => template.status !== 'ARCHIVED')}
                        // defaultFilter={defaultFilter}
                        onChangeFilter={this.onChangeTemplatesFilter.bind(this)} />

                    {templateLayout === 0 &&
                        actionButton('List View', () => { this.setState({ templateLayout: 1 }) }, 'm-0 mt-1 content-float-right', 'feather icon-list')
                    }
                    {templateLayout === 1 &&
                        actionButton('Grid View', () => { this.setState({ templateLayout: 0 }) }, 'm-0 mt-1 content-float-right', 'feather icon-grid')
                    }
                </Col>
            </Row>
            {templateLayout === 0 &&
                <Row xs="1" md={3} className='ml-0 mr-0 mb-2'>
                    {filteredTemplates.map((template, templateIndex) =>
                        <Col className="cards-container pl-2 pr-2 mb-2" key={templateIndex}>
                            {this.getTemplateCard(template)}
                        </Col>
                    )}
                </Row>
            }
            {templateLayout === 1 && templateGroups.map((group, groupIndex) =>
                <div key={groupIndex} className='mb-2'>
                    <Row className='ml-0 mr-0 mb-1'><Col className='pt-0 pr-2 pb-2 pl-2 text-uppercase'>{group}</Col></Row>
                    <Row xs="1" md={3} className='ml-0 mr-0 mb-2'>
                        {templates.map((template, templateIndex) => template.type === group &&
                            <Col className="cards-container pl-2 pr-2" key={templateIndex}>
                                {this.getTemplateCard(template)}
                            </Col>
                        )}
                    </Row>
                </div>
            )}
        </div>
    }

    render() {
        const { templateLoading, dataLoading, showModal, storeConfig, storeAction } = this.state;
        const toggleModal = () => this.setState({ showModal: false, storeAction: '' });

        return (
            <section className="studio-container p-0">
                {(templateLoading || dataLoading) &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!(templateLoading || dataLoading) && ['create', 'update'].indexOf(storeAction) < 0 &&
                    this.renderStores()
                }
                {['create', 'update'].indexOf(storeAction) >= 0 && storeConfig &&
                    <StoreConfig
                        data={storeConfig}
                        onCancel={this.cancelStoreConfig.bind(this)}
                        onSave={this.saveStoreConfig.bind(this)}
                    />
                }
                <Modal scrollable centered size={'xl'} isOpen={showModal && storeAction === 'addDataStore'}>
                    <ModalHeader toggle={toggleModal} className="p-3">{'Add Data Store'}</ModalHeader>
                    <ModalBody className='p-2'>
                        {this.renderTemplates()}
                    </ModalBody>
                </Modal>
            </section>
        )
    }
}
