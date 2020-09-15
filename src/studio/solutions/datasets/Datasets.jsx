import React, { Component } from "react";
import { Row, Col, Card, CardBody, CardFooter, } from 'reactstrap';
import Timestamp from "react-timestamp";

import { datasetService } from '../../services/DatasetService';
import Tooltip from '../../utils/Tooltip';
import StudioFilter from '../../utils/StudioFilter';
import StudioTable from '../../utils/StudioTable';
import { actionButton, ACTION_BUTTON, } from "../../utils/StudioUtils";
import {notify, notifyError } from "../../utils/Notifications";
import { BasicSpinner } from "../../utils/BasicSpinner";

import './Datasets.scss';

class Datasets extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            renderLayout: 0,
            filteredData: [],
            datasets: [],
            renderForm: 0,
        };
    }
    componentDidMount() {
        const { solutionId } = this.props.match.params;
        const parent = this;
     datasetService.getDatasets(solutionId).then(response => {
            let datasets = response.filter(dataset => dataset.status !== 'ARCHIVED').sort((a, b) => a.status.localeCompare(b.status));
            datasets.forEach(datasetelement => {
                datasetelement.size=this.formatBytes(datasetelement.size);
            });
            this.setState({ loading: false, datasets: datasets, filteredData: datasets });
        }).catch(error => {
            parent.setState({ loading: false });
            console.error('datasetService.getDatasets:', error);
            notifyError('Unable to retrieve datasets', error.message);
        });
    }
    onChangeFilter(filteredData) {
        this.setState({ filteredData: filteredData })
    }
    initiateCreateDataset = () => {

    }
    getBadgeType(status) {
        switch(status){
            case "ACTIVE":
                return "badge-primary";
            case "NEW":
                return "badge-secondary";
            case "DRAFT":
                return "badge-secondary";
            case "APPROVED":
                return "badge-success";
            case "PENDING":
                return "badge-info";
            case "DISABLED":
                return "badge-warning";
            case "ARCHIVED":
                return "badge-danger";                 
            default :
            return "badge-dark";
        }
    }
    triggerexportDataset= (dataset)=>{
        var encodedData = encodeURIComponent(JSON.stringify(dataset));
        const newAnchorTag = document.createElement('a');
        const filename = dataset.id + ".json";
        newAnchorTag.setAttribute('href', 'data:application/json;charset=UTF-8,' + encodedData);
        newAnchorTag.setAttribute('download', filename);
        newAnchorTag.dataset.downloadurl = ['application/json', newAnchorTag.download, newAnchorTag.href].join(':');
        notify('Export Dataset', 'Dataset details published for download');
        newAnchorTag.click();
    }
    triggerEditDataset = () =>{

    }
    triggerDeleteDataset = () =>{
        
    }
    triggerPreviewDataset = () =>{
        
    }
    triggerSplitDataset = () =>{

    }
    linkAction = () => {

    }
 formatBytes=(bytes, decimals = 2)=> {
        if (bytes === 0) return '0 Bytes';
    console.log(bytes);
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    

    render() {
        const { loading, renderLayout, filteredData, renderForm, datasets } = this.state;
        let tableActions = [
            
            {
                btnTitle: 'Split', btnClass: 'task-input-btn', iconClass: 'fa fa-code-fork',
                btnAction: this.triggerSplitDataset.bind(this),
            },
            {
                btnTitle: 'Export', btnClass: 'task-input-btn', iconClass: 'feather icon-download',
                btnAction: this.triggerexportDataset.bind(this),
            },
            {
                btnTitle: 'Configure', btnClass: 'btn-success', iconClass: 'feather icon-edit',
                btnAction: this.triggerEditDataset.bind(this),
            },
            {
                btnTitle: 'Delete', btnClass: 'btn-danger', iconClass: 'feather icon-trash-2',
                btnAction: this.triggerDeleteDataset.bind(this)
            },
            {
                btnTitle: 'Preview', btnClass: 'btn-danger', iconClass: 'far fa-eye',
                btnAction: this.triggerPreviewDataset.bind(this)
            },
        ]
        let tableHeader = [
            { label: 'Name', key: 'title', dataFormat: 'linkAction', linkTitle: 'Title', linkAction: this.linkAction.bind(this) },
            { label: 'Version', key: 'version' },
            { label: 'Category', key: 'category' },
            { label: 'Type', key: 'type' },
            { label: 'Size', key: 'size' },
            {label:'CreatedAt',key:'createdAt',dataFormat: 'relativeTimestamp'},
            {label:'ModifiedAt',key:'modifiedAt',dataFormat: 'relativeTimestamp'},
            { label: 'Status', key: 'status' },
        ]
        let searchKeys = ['title', 'category', 'type'];

        let filterKeys = [
            { label: 'Name', key: 'title' },
            { label: 'Category', key: 'category' },
            { label: 'Type', key: 'type' },
            { label: 'Size', key: 'size' },
            { label: 'Status', key: 'status' },

        ];
        return (
            <section className="studio-container" >
                {loading &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!loading && renderForm === 0 && <>
                    <Row xs="1" md="1">
                        <Col className="text-left mt-0">
                            {actionButton('Create', this.initiateCreateDataset.bind(this),
                                'ml-1 content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)}
                            <StudioFilter
                                searchKeys={searchKeys}
                                filterKeys={filterKeys}
                                data={datasets}
                                onChangeFilter={this.onChangeFilter.bind(this)} />

                            {renderLayout === 0 &&
                                actionButton('List View', () => { this.setState({ renderLayout: 1 }) },
                                    'm-0 mt-1 content-float-right', 'feather icon-list')
                            }
                            {renderLayout === 1 &&
                                actionButton('Grid View', () => { this.setState({ renderLayout: 0 }) },
                                    'm-0 mt-1 content-float-right', 'feather icon-grid')
                            }
                            <h3 className="pt-1">{'Datasets' +
                                (datasets.length > 0 ?
                                    ` (${datasets.length})` : '')}
                            </h3>
                        </Col>
                    </Row>
                    {renderLayout === 0 &&
                        <Row xs="1" md="3">
                            {filteredData.map((dataset, datasetIndex) =>
                                <Col className="cards-container" key={datasetIndex + 1}>
                                    <Card className="studio-card mb-1">
                                        <CardBody className="p-0 pt-2 pl-2">
                                            <Row xs="1" md="1">
                                                <Col className="text-left pb-0">
                                                    <Tooltip title='Version'>
                                                        <label className="badge badge-light  content-float-right text-center">v{dataset.version}</label>
                                                    </Tooltip>
                                                    {dataset.secure === true ? <i className="fa fa-lock  pt-1 content-float-right" aria-hidden="true"></i> : ''}
                                                    <i className='fa fa-files-o fa-2x' aria-hidden="true"></i>
                                                    <span className='ml-1 mb-0'>{dataset.category}</span>
                                                </Col>
                                            </Row>
                                            <Row xs="1" md="1">
                                                <Col className="text-left pt-0 pb-0">
                                                    <h5 className="mt-0 mr-0 dataset-name content-float-left">{dataset.title}</h5>
                                                </Col>
                                                <Col className="text-left pt-0 pb-0 badge-status-ellipsis">
                                                    <h5 className="mt-0 mr-0">
                                                        <span className="badge badge-light-secondary pl-0 mr-0"
                                                            title={'Created by ' + dataset.createdBy}>

                                                            <label className={"mr-1 badge " + this.getBadgeType(dataset.status || '') + " mb-0 pull-left"}>
                                                                {dataset.status || ''}
                                                            </label>
                                                            <Timestamp relative date={dataset.modifiedAt || dataset.createdAt} /> by {dataset.modifiedBy}
                                                        </span>
                                                        <Tooltip title='Size'>
                                                        <span className='content-float-right text-muted size-text pr-1'>{dataset.size}</span>
                                                        </Tooltip>
                                                    </h5>
                                                </Col>

                                            </Row>
                                            <Row xs="1" md="1" className='mb-1'>
                                                <Col>
                                                    <p className="content-description text-justify mb-0 pt-1 pb-1 pl-1 pr-3">{dataset.description}</p>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                        <CardFooter className="p-0">
                                            <Row>
                                                <Col className=" text-left">
                                                    {actionButton('Split', () => this.splitDataset(dataset.id),
                                                        'mt-1 ml-1 mr-2', 'fa fa-code-fork', true)}
                                                </Col>
                                                <Col className="text-center">
                                                    {actionButton('Export', () => this.triggerexportDataset(dataset),
                                                        'mt-1 ml-1 mr-2', 'feather icon-download', true)}
                                                </Col>
                                                <Col className="text-center ">
                                                    {actionButton('Delete', () => this.deleteDataset(dataset.id),
                                                        'mt-1 ml-1 mr-2', 'feather icon-trash-2', true)}
                                                </Col>
                                                <Col className="text-right">
                                                    {actionButton('Preview', () => this.previewDataset(dataset),
                                                        'mt-1 ml-1 mr-2', 'far fa-eye', true)}
                                                </Col>
                                            </Row>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    }
                    {renderForm === 0 && renderLayout === 1 &&
                        <StudioTable customClass="p-0"
                            hideTableName={true}
                            hideTableSearch={true}
                            tableHeader={tableHeader}
                            tableData={filteredData}
                            tableActions={tableActions}
                            defaultSort={{ sortIndex: 5, sortOrder: 0 }}
                            searchKeys={searchKeys}
                            filterKeys={filterKeys}
                        />
                    }
                </>
                }
            </section >
        );
    }

}
export default Datasets;