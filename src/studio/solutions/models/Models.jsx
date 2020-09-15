import React, { Component } from "react";
//import ModelsList from "./ModelsList/ModelsList";
import { Row, Col, Card, CardBody, CardFooter, Label } from 'reactstrap';
import Timestamp from "react-timestamp";

import { modelService } from '../../services/ModelService';
import Tooltip from '../../utils/Tooltip';
import StudioFilter from '../../utils/StudioFilter';
import StudioTable from '../../utils/StudioTable';
import {  actionButton, ACTION_BUTTON,inputField } from "../../utils/StudioUtils";
import { notify, notifyError } from "../../utils/Notifications";
import { BasicSpinner } from "../../utils/BasicSpinner";

import './Models.scss';

const MODEL_TYPE = {
    'deep learning': { label: 'deep learning ', image: require('../../../assets/studio/svg/deep-learning.svg') },
    'machine learning': { label: 'machine learning', image: require('../../../assets/studio/svg/ai-powered.svg') },
    
};
class Models extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            renderLayout: 0,
            filteredData:[],
            models: [],
          renderForm: 0,
        };
    }
    componentDidMount(){
        const { solutionId } = this.props.match.params;
        const parent = this;
         modelService.getModels(solutionId).then(response => {
            let models = response.filter(model => model.status !== 'ARCHIVED').sort((a, b) => a.status.localeCompare(b.status));
            this.setState({ loading: false, models: models ,filteredData:models});
        }).catch(error => {
            parent.setState({ loading: false });
            console.error('modelService.getModels:', error);
            notifyError('Unable to retrieve modelss', error.message);
        });
    }
    tableView = () =>{
        const {filteredData}=this.state;
        filteredData.forEach((ele)=>{
            ele["accuracy"]=ele.metrics.accuracy
            ele["f1"]=ele.metrics.f1;
            ele['precision']=ele.metrics.precision;
            ele["recall"]=ele.metrics.recall;
         })
         this.setState({renderLayout:1})
    }
    initiateCreateModel = () =>{
        this.setState({  mode: 'new', renderForm: 0 })
    }
    onChangeFilter(filteredData) {
        this.setState({ filteredData: filteredData })
    }
    onChangeInputField =(name,value)=>{
        //Need to Change with API 
        const { models } = this.state;
        let modelId=name.split('_')[1];
        let model = models.filter(model => model.id === modelId)[0];
        model.enabled=value;
       this.setState({models:models})
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
    triggerexportModel = (model) =>{
        var encodedData = encodeURIComponent(JSON.stringify(model));
        const newAnchorTag = document.createElement('a');
        const filename = model.id + ".json";
        newAnchorTag.setAttribute('href', 'data:application/json;charset=UTF-8,' + encodedData);
        newAnchorTag.setAttribute('download', filename);
        newAnchorTag.dataset.downloadurl = ['application/json', newAnchorTag.download, newAnchorTag.href].join(':');
        notify('Export Model', 'Model details published for download');
        newAnchorTag.click();
    }
 
    deleteModel = () =>{

    }
    editModel = () =>{

    }
    linkAction = () =>{

    }
    inputAction = (rowData) =>{
      
    }
    triggerEditModel = () =>{

    }
    triggerDeleteModel = () =>{

    }
    triggerHistoryModel = () =>{

    }
    
    render() {
        const { loading, renderLayout, filteredData,renderForm ,models} = this.state;
        let tableActions = [
            {
                btnTitle: 'Export', btnClass: 'task-input-btn', iconClass: 'feather icon-download',
                btnAction: this.triggerexportModel.bind(this),
            },
            {
                btnTitle: 'Configure', btnClass: 'btn-success', iconClass: 'feather icon-edit',
                btnAction: this.triggerEditModel.bind(this),
            },
            {
                btnTitle: 'Delete', btnClass: 'btn-danger', iconClass: 'feather icon-trash-2',
                btnAction: this.triggerDeleteModel.bind(this)
            },
            {
                btnTitle: 'History', btnClass: 'btn-danger', iconClass: 'fa fa-history',
                btnAction: this.triggerHistoryModel.bind(this)
            },
        ]
        let tableHeader = [
            { label: 'Name', key: 'title',dataFormat: 'linkAction', linkTitle: 'Title', linkAction: this.linkAction.bind(this)  },
            { label: 'Version', key: 'version' },
            { label: 'Category', key: 'category' },
            {label:'Type',key:'type'},
            { label: 'Accuracy', key: 'accuracy' },
            { label: 'Recall', key: 'recall' },
            { label: 'Precision', key: 'precision' },
            { label: 'F1', key: 'f1' },
            { label: 'Enabled', key: 'enabled' },
            {label:'CreatedAt',key:'createdAt',dataFormat: 'relativeTimestamp'},
            {label:'ModifiedAt',key:'modifiedAt',dataFormat: 'relativeTimestamp'},
            { label: 'Status', key: 'status' },
           
        ];

        let searchKeys = ['title', 'category','type'];

        let filterKeys = [
            { label: 'Name', key: 'title'},
            { label: 'Category', key: 'category' },
            {label:'Type',key:'type'},
            { label: 'Accuracy', key: 'accuracy' },
            { label: 'Precision', key: 'precision' },
            { label: 'Recall', key: 'recall' },
            { label: 'F1', key: 'f1' },
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
                            {actionButton('Create', this.initiateCreateModel.bind(this),
                                'ml-1 content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)}

                            <StudioFilter
                                searchKeys={searchKeys}
                                filterKeys={filterKeys}
                                data={models}
                                onChangeFilter={this.onChangeFilter.bind(this)} />

                            {renderLayout === 0 &&
                                actionButton('List View', () =>this.tableView() ,
                                    'm-0 mt-1 content-float-right', 'feather icon-list')
                            }
                            {renderLayout === 1 &&
                                actionButton('Grid View', () =>  {this.setState({ renderLayout: 0 })} ,
                                    'm-0 mt-1 content-float-right', 'feather icon-grid')
                            }
                            <h3 className="pt-1">{'Models'+
                                (models.length > 0 ?
                                    ` (${models.length})` : '')
                                    }
                            </h3>
                        </Col>
                    </Row>
                    {renderLayout === 0 &&
                        <Row xs="1" md="3">
                            {filteredData.map((model, modelIndex) =>
                                <Col className="cards-container" key={modelIndex + 1}>
                                <Card className="studio-card mb-1">
                               {model.gpu===true?<div className='text-center round-img-border'>
                                            <label className='text-white'>GPU</label>
                                </div>:''}
                                    <CardBody className="p-0 pt-2">
                                        <Row xs="1" md="1">
                                            <Col className="text-left pb-0">
                                              {inputField('switch',`enabled_${model.id}`,'',model.enabled,this.onChangeInputField.bind(this),{
                                                        input: 'content-float-right pt-1 text-center',
                                                        switchHeight:15,switchWidth:15,
                                                        },)}
                                                <Tooltip title='Version'>
                                                    <label className="badge badge-light  content-float-right text-center">v{model.version}</label>
                                                </Tooltip>
                                               <img height='16px' width='16px' src={MODEL_TYPE[model.type].image} alt={MODEL_TYPE[model.type].label} />
                                                <span className='ml-1 mb-0'>{model.category}</span>
                                            </Col>
                                        </Row>
                                        <Row xs="1" md="1">
                                            <Col className="text-left pt-0 pb-0">
                                                <h5 className="mt-0 mr-0 model-name">{model.title}</h5>
                                            </Col>
                                            <Col className="text-left pt-0 pb-0 badge-status-ellipsis">
                                                <h5 className="mt-0 mr-0">
                                                    <span className="badge badge-light-secondary pl-0 mr-0"
                                                        title={'Created by ' + model.createdBy}>
                                                        <label className={"mr-1 badge " + this.getBadgeType(model.status || '') + " mb-0 pull-left"}>
                                                            {model.status || ''}
                                                        </label>
                                                        <Timestamp relative date={model.modifiedAt || model.createdAt} /> by {model.modifiedBy}
                                                    </span>
                                                </h5>
                                            </Col>
                                            <Col className="text-center pt-0 pb-0">
                                                {actionButton('Export', () => this.triggerexportModel(model),
                                                    'mt-1 ml-1 mr-2', 'feather icon-download', true)}
                                                {actionButton('Delete', () => this.deleteModel(model.id),
                                                    'mt-1 ml-1 mr-2', 'feather icon-trash-2', true)}
                                                {actionButton('Configure', () => this.editModel(model),
                                                    'mt-1 ml-1 mr-2', 'feather icon-edit', true)}
                                                {actionButton('History', () => { console.log("History") },
                                                    'mt-1 ml-1 mr-2', 'fa fa-history', true)}
                                            </Col>
                                        </Row>
                                        <Row xs="1" md="1" className='mb-1'>
                                            <Col>
                                                <p className="content-description text-justify mb-0 pt-1 pb-1 pl-1 pr-3">{model.description}</p>
                                            </Col>
                                            <Col className="text-left pt-0 pb-0">
                                                    <h5 className="mt-0">
                                                        {Object.keys(model.tags).map((tag, tagIndex) =>
                                                            <span key={tagIndex} className="key-tag-item">{model.tags[tag] || ''}</span>
                                                        )}
                                                    </h5>
                                                </Col>
                                        </Row>
                                    </CardBody>
                                    <CardFooter className="p-0">
                                        <Row xs="5" md="5">
                                            <Col className="text-center pt-1 pb-0 ">
                                                <p className='align-top mb-0'>{model["metrics"].accuracy}</p>
                                                <Label>Accuracy</Label>
                                            </Col>
                                            <Col className="text-center pt-1 pb-0 box-border">
                                                <p className='align-top mb-0'>{model["metrics"].precision} </p>
                                                <Label>Precision</Label>
                                            </Col>
                                            <Col className="text-center pt-1 pb-0 box-border">
                                                <p className='align-top  mb-0'>{model["metrics"].recall} </p>
                                                <Label> Recall </Label>
                                            </Col>
                                            <Col className="text-center pt-1 pb-0 box-border">
                                                <p className='align-top mb-0'>{model["metrics"].f1} </p>
                                                <Label> f1 </Label>
                                            </Col>
                                            <Col className="text-center pt-1 pb-0  box-border">
                                                <Tooltip title="Explore">
                                                    <button className='btn p-0 mt-2 mb-2 ml-1 mr-0'
                                                        onClick={() => { console.log("Explore") }} >
                                                        <span className='align-top'>Explore</span>
                                                        <i className='studio-primary feather icon-chevrons-right icon-explore-right' />
                                                    </button>
                                                </Tooltip>
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                                </Col>
                            )}
                        </Row>
                    }
                    {renderForm === 0 && renderLayout === 1&&
                        <StudioTable customClass="p-0"
                            hideTableName={true}
                            hideTableSearch={true}
                            tableHeader={tableHeader}
                            tableData={filteredData}
                            tableActions={tableActions}
                            defaultSort={{ sortIndex: 9, sortOrder: 0 }}
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

export default Models;