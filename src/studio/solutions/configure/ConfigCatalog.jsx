import React from 'react';
import { Row, Col, Card, CardBody, CardFooter, Modal, ModalHeader, ModalBody } from 'reactstrap';

import Tooltip from "../../utils/Tooltip";
import StudioFilter from "../../utils/StudioFilter";
import ConfigProperties from './ConfigProperties';
import ScraperWizard from "./ScraperWizard";

import { getImage } from '../../modeler/StudioImageMap';
import { BasicSpinner } from "../../utils/BasicSpinner";
import { confirmDelete, actionButton, ACTION_BUTTON } from "../../utils/StudioUtils";
import { notifySuccess, notifyError } from '../../utils/Notifications';

import './ConfigCatalog.scss';
export default class ConfigCatalog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            templates: [],
            filteredTemplates: [],
            templateLayout: 0,
            templateLoading: true,

            catalogData: [],
            filteredData: [],
            dataLayout: 0,
            dataLoading: true,

            showModal: false,
            catalogAction: '',
            catalogConfig: undefined
        }
    }

    componentDidMount() {
        const parent = this;
        this.getTemplates().then(response => {
            this.setState({ templateLoading: false, templates: response });
        }).catch(error => {
            parent.setState({ templateLoading: false });
            console.error('getTemplates:', error);
            notifyError('Unable to retrieve templates', error.message);
        });

        this.getData().then(response => {
            this.setState({ dataLoading: false, catalogData: response });
        }).catch(error => {
            parent.setState({ dataLoading: false });
            console.error('getData', error);
            notifyError('Unable to retrieve data', error.message);
        });
    }

    onChangeCatalogFilter(filteredData) {
        this.setState({ filteredData: filteredData })
    }

    onChangeTemplatesFilter(filteredData) {
        this.setState({ filteredTemplates: filteredData })
    }

    selectTemplate() {
        this.setState({ catalogAction: 'selectTemplate', showModal: true })
    }

    createCatalogItem(template) {
        let catalogItem = JSON.parse(JSON.stringify(template))
        delete catalogItem.id;
        Object.keys(catalogItem.design.layout).forEach(function (layoutKey) {
            catalogItem.design.layout[layoutKey].forEach(function (layoutItem) {
                if (layoutItem['value'] !== undefined && catalogItem.properties[layoutItem.key] === undefined) {
                    catalogItem.properties[layoutItem.key] = layoutItem.value;
                }
            })
        })
        this.setState({ catalogAction: 'create', catalogConfig: catalogItem });
    }

    configureCatalogItem(catalogItem) {
        const { templates } = this.state;
        let template = templates.filter(template => template.template === catalogItem.template && template.templateVersion === catalogItem.templateVersion)[0];
        catalogItem.design = JSON.parse(JSON.stringify(template)).design;
        Object.keys(catalogItem.design.layout).forEach(function (layoutKey) {
            catalogItem.design.layout[layoutKey].forEach(function (layoutItem) {
                if (layoutItem['value'] !== undefined && catalogItem.properties[layoutItem.key] === undefined) {
                    catalogItem.properties[layoutItem.key] = layoutItem.value;
                }
            })
        })
        this.setState({ catalogAction: 'update', catalogConfig: catalogItem });
    }

    saveCatalogItem(catalogConfig) {
        const { catalogData, catalogAction, templates } = this.state;
        delete catalogConfig.design
        this.onSave(catalogAction, catalogConfig).then(response => {
            if ('create' === catalogAction) {
                catalogData.push(response);
                notifySuccess(`Create ${catalogConfig.category}`, `${catalogConfig.template} has been successfully created`);
            } else {
                let catalogItem = catalogData.filter(arrayItem => arrayItem.id === catalogConfig.id)[0]
                Object.keys(response).forEach(function (dataKey) {
                    catalogItem[dataKey] = response[dataKey];
                });
                notifySuccess(`Update ${catalogConfig.category}`, `${catalogConfig.template} has been successfully updated`);
            }
            this.setState({ catalogData: catalogData, catalogAction: '', catalogConfig: undefined })
        }).catch(error => {
            let template = templates.filter(template => template.template === catalogConfig.template && template.templateVersion === catalogConfig.templateVersion)[0];
            catalogConfig.design = JSON.parse(JSON.stringify(template)).design;
            console.error('onSave', error);
            notifyError('Unable to save catalog item', error.message);
        });
    }

    deleteCatalogItem(catalogItemId) {
        const { catalogData } = this.state;
        const parent = this;
        confirmDelete().then(function (userInput) {
            if (!userInput.dismiss) {
                // let actionComment = userInput.value;
                parent.onDelete(catalogItemId).then(response => {
                    notifySuccess('Delete Catalog Item', 'Configuration permanently removed');
                    let catalogItem = catalogData.filter(catalogItem => catalogItem.id === catalogItemId)[0];
                    catalogItem.status = "ARCHIVED";
                    parent.setState({ catalogData: catalogData });
                }).catch(error => {
                    console.error('onDelete', error);
                    notifyError('Unable to delete catalog item', error.message);
                });
            }
        });
    }

    cancelChanges() {
        this.setState({ catalogAction: '', catalogConfig: undefined });
    }

    getDataCard(catalogItem) {
        const { dataLayout } = this.state;
        return <Card className="studio-card mb-1">
            <CardBody>
                <Row>
                    <Col className='font-weight-bold'>{catalogItem.template}</Col>
                    {dataLayout === 0 && <Col className='text-right text-muted small text-uppercase'>{catalogItem.type}</Col>}
                </Row>
                <Row>
                    <Col sm='auto'><img className='catalog-item-icon' src={getImage(catalogItem.template)} alt=' ' /></Col>
                    <Col className='pt-0'>
                        <p className='mt-1 mb-2 font-weight-bold text-truncate'>{catalogItem.title}</p>
                        <p className='mb-0 text-truncate' title={catalogItem.description}>{catalogItem.description}</p>
                    </Col>
                </Row>
            </CardBody>
            <CardFooter>
                <Row>
                    <Col className='text-right'>
                        {actionButton('Delete', this.deleteCatalogItem.bind(this, catalogItem.id), 'mt-1 ml-1 mr-2', 'feather icon-trash-2', true)}

                        {actionButton('Configure', this.configureCatalogItem.bind(this, catalogItem), 'mt-1 ml-1 mr-2', 'feather icon-edit', true)}
                    </Col>
                </Row>
            </CardFooter>
        </Card>
    }

    renderData() {
        const { dataLayout, catalogData, filteredData } = this.state;
        let catalogGroups = filteredData.map(arrayItem => arrayItem.type !== undefined && (arrayItem.type)).filter((value, index, self) => self.indexOf(value) === index);

        let filterKeys = this.getDataFilters ? this.getDataFilters() : undefined;

        return <div>
            <Row xs="1" md="1">
                <Col>
                    {actionButton('Configure', this.selectTemplate.bind(this),
                        'ml-1 content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)}

                    <StudioFilter
                        // searchKeys={searchKeys}
                        filterKeys={filterKeys}
                        data={catalogData.filter(catalogItem => catalogItem.status !== 'ARCHIVED')}
                        // defaultFilter={defaultFilter}
                        onChangeFilter={this.onChangeCatalogFilter.bind(this)} />
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
                    {filteredData.map((catalogItem, catalogIndex) =>
                        <Col className="cards-container" key={catalogIndex}>
                            {this.getDataCard(catalogItem)}
                        </Col>
                    )}
                </Row>
            }
            {dataLayout === 1 && catalogGroups.map((group, groupIndex) =>
                <div key={groupIndex}>
                    <Row><Col className='text-uppercase'>{group}</Col></Row>
                    <Row xs="1" md={3}>
                        {filteredData.map((catalogItem, catalogIndex) => catalogItem.type === group &&
                            <Col className="cards-container" key={catalogIndex}>
                                {this.getDataCard(catalogItem)}
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
            <Card className={"studio-card" + (templateLayout === 0 ? ' mb-2' : ' mb-3')} onClick={() => { this.createCatalogItem(template) }}>
                <CardBody>
                    {templateLayout === 0 &&
                        <Row><Col className='text-right small text-uppercase'>{template.type}</Col></Row>
                    }
                    <Row>
                        <Col sm='auto'><img className='catalog-item-icon' src={getImage(template.template)} alt=' ' /></Col>
                        <Col className='mt-2 pt-1'><p>{template.template}</p></Col>
                    </Row>
                </CardBody>
            </Card>
        </Tooltip>
    }

    renderTemplates() {
        const { templateLayout, templates, filteredTemplates } = this.state;
        let templateGroups = filteredTemplates.map(arrayItem => arrayItem.type !== undefined &&
            (arrayItem.type)).filter((value, index, self) => self.indexOf(value) === index);

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
        const { templateLoading, dataLoading, showModal, catalogConfig, catalogAction } = this.state;
        const toggleModal = () => this.setState({ showModal: false, catalogAction: '' });

        return (
            <section className="studio-container p-0">
                {(templateLoading || dataLoading) &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!(templateLoading || dataLoading) && ['create', 'update'].indexOf(catalogAction) < 0 &&
                    this.renderData()
                }
                {['create', 'update'].indexOf(catalogAction) >= 0 && catalogConfig && catalogConfig.design.type === "form" &&
                    <ConfigProperties
                        data={catalogConfig}
                        onCancel={this.cancelChanges.bind(this)}
                        onSave={this.saveCatalogItem.bind(this)}
                    />
                }
                {['create', 'update'].indexOf(catalogAction) >= 0 && catalogConfig && catalogConfig.design.type === "wizard" &&
                    <div>
                        <div className="form-close-btn mt-1">
                            <Tooltip title="Cancel" placement='left'>
                                <button className="content-float-right btn p-0" onClick={() => this.setState({ catalogAction: "" })}><i className='feather icon-x-circle fa-2x' /></button>
                            </Tooltip>
                        </div>
                        <ScraperWizard
                            data={catalogConfig || {}}
                            onCancel={this.cancelChanges.bind(this)}
                            onSave={this.saveCatalogItem.bind(this)} />
                    </div>
                }
                <Modal scrollable centered size={'xl'} isOpen={showModal && catalogAction === 'selectTemplate'}>
                    <ModalHeader toggle={toggleModal} className="p-3">{'Select Template'}</ModalHeader>
                    <ModalBody className='p-2'>
                        {this.renderTemplates()}
                    </ModalBody>
                </Modal>
            </section>
        )
    }
}
