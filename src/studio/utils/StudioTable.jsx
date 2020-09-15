import React, { Component } from "react";
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import { clear as domClear } from 'min-dom';
import Timestamp from "react-timestamp";

import Tooltip from './Tooltip';
import StudioFilter from './StudioFilter';

import { badgeStyle, generateUUID, inputField } from './StudioUtils';
import { actionButton, ACTION_BUTTON } from './StudioUtils';

/*
Usage:
<StudioTable tableName={'Users'} hideTableName={false}
    tableHeader={gridHeader}
    tableData={gridData}
    createAction={this.createAction.bind(this)}
    createLabel={'Create'}
    tableActions={gridActions}
    styleActions={false}
    defaultSort={{ sortIndex: 0, sortOrder: 0 }}
    defaultRows={'5' / '10' / '15' / '25' / '50' / '100'}
    // Properties for Search and Filter
    searchKeys: [ 'name', 'description', 'tags' ]
    filterKeys: [ { label: 'Status', key: 'status' }, { label: 'Type', key: 'type', options: [ { label: 'Integration', value: 'INTEGRATION' }, ...] }, ... ]
    defaultFilter: [ { key: 'status', values: [ 'INPROGRESS', 'ERROR' ] }, ...]
/>

tableHeader = [
    key ==> column
    { label: 'Name',     key: 'name' },
    { label: 'Status',   key: 'status' },
    { label: 'Date',     key: 'date',       dataFormat: 'relativeTimestamp' },
    { label: 'Text',     key: 'comment',    dataFormat: 'input', type: 'checkbox / text / number / date / etc..', changeAction: this.changeAction.bind(this) },
    { label: 'Number',   key: 'value',      dataFormat: 'input', type: 'select', selectValues: [{label:'A', value:'a'}] changeAction: this.changeAction.bind(this) },
    { label: 'Activity', key: 'activity',   dataFormat: 'linkAction',   linkTitle: 'Title' linkAction: this.linkAction.bind(this) },
    { label: 'Status',   key: 'status',     dataFormat: 'dataAction',   dataActions: [ ... same as tableActions ...]},
    { label: 'Status',   key: 'status',     dataFormat: 'statusAction', dataActions: [ ... same as tableActions ...]},
]

tableActions = [
    {
        btnTitle: 'Edit', btnClass: 'text-success', iconClass: 'feather icon-edit',
        btnAction: this.editAction.bind(this), btnCondition: this.actionToggle.bind(this)
    },
    {
        btnTitle: 'Delete', btnClass: 'text-danger', iconClass: 'feather icon-trash-2',
        btnAction: this.deleteAction.bind(this)
    }
]
*/
class StudioTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            containerId: generateUUID(),
            filteredData: [], displayOffset: 0, displayLimit: '10',
        };
    }

    componentDidMount() {
        const { hideTableName, hideTableSearch, tableHeader, tableData, tableActions, defaultSort, defaultRows } = this.props;

        let gridHeader = [];
        if (tableHeader) {
            gridHeader = tableHeader;
        } else if (tableData && tableData.length > 0) {
            let firstRecord = tableData[0];
            Object.keys(firstRecord).forEach(function (recordKey) {
                gridHeader.push({ label: recordKey, key: recordKey });
            });
        }

        let sortIndex = defaultSort ? defaultSort.sortIndex || 0 : 0;
        let gridSort = {
            sortIndex: (sortIndex < 0 || sortIndex >= gridHeader.length) ? 0 : sortIndex,
            ascending: defaultSort && defaultSort.sortOrder === 1 ? false : true
        }

        this.setState({
            hideGridName: !!hideTableName, hideGridSearch: !!hideTableSearch, gridHeader: gridHeader, gridActions: tableActions,
            displayLimit: defaultRows || this.state.displayLimit,
            gridSort: gridSort, readOnlyGrid: (tableActions && tableActions.length > 0) ? false : true
        });
    }

    onChangeFilter(filteredData) {
        this.setState({ filteredData: filteredData })
    }

    componentWillUnmount() {
        const { containerId } = this.state;
        var tableContainer = document.getElementById(containerId);
        if (tableContainer) {
            domClear(tableContainer);
        }
    }


    getSortedData() {
        const { gridHeader, gridSort, filteredData, hideGridSearch } = this.state;
        // const gridData = this.props.tableData || [];
        const gridData = (hideGridSearch ? this.props.tableData : filteredData) || [];

        if (!gridHeader || !gridSort || gridData.length === 0) {
            return gridData
        } else if (gridSort.ascending) {
            if ('number' === typeof gridData[0][gridHeader[gridSort.sortIndex].key]) {
                return gridData.sort((a, b) => (a[gridHeader[gridSort.sortIndex].key] || 0) - (b[gridHeader[gridSort.sortIndex].key]) || 0);
            } else {
                return gridData.sort((a, b) => this.getSortingValue(a[gridHeader[gridSort.sortIndex].key]).toString()
                    .localeCompare(this.getSortingValue(b[gridHeader[gridSort.sortIndex].key]).toString()));
            }
        } else {
            if ('number' === typeof gridData[0][gridHeader[gridSort.sortIndex].key]) {
                return gridData.sort((a, b) => (b[gridHeader[gridSort.sortIndex].key] || 0) - (a[gridHeader[gridSort.sortIndex].key]) || 0);
            } else {
                return gridData.sort((a, b) => this.getSortingValue(b[gridHeader[gridSort.sortIndex].key] || '').toString()
                    .localeCompare(this.getSortingValue(a[gridHeader[gridSort.sortIndex].key] || '').toString()));
            }
        }
    }

    getSortingValue(cellData) {
        if (cellData && 'object' === typeof cellData) {
            let cellKeys = Object.keys(cellData).filter(dataKey => !this.isImageContent(cellData[dataKey]))
            if (cellKeys.length === 0) {
                return ''
            } else {
                return cellData[cellKeys[0]] || '';
            }
        } else {
            return cellData || '';
        }
    }

    isImageContent(value) {
        if (value && (
            value.toString().startsWith('data:image/') ||
            value.toString().startsWith('http://') || value.toString().startsWith('https://') ||
            value.toString().endsWith('.svg') ||
            value.toString().endsWith('.png') ||
            value.toString().endsWith('.ico') ||
            value.toString().endsWith('.jpg') || value.toString().endsWith('.jpeg')
        )) {
            return true;
        } else {
            return false;
        }
    }

    renderDataContent(cellData) {
        let cellContent = cellData;

        if (!cellData) {
            cellContent = '';
        } else if (cellData instanceof Array) {
            return (
                <div>
                    {Object.keys(cellData).map((dataKey, keyIndex) => 'string' === typeof cellData[dataKey] &&
                        <span key={keyIndex} className={"mr-1 mb-1 p-1 badge " + badgeStyle(cellData[dataKey])}>{cellData[dataKey]}</span>
                    )}
                </div>
            )
        } else if ('boolean' === typeof cellData) {
            cellContent = cellData ? 'Yes' : '';
        } else if ('number' === typeof cellData) {
            return (<div className="text-right">{cellData}</div>);
        } else if (cellContent && cellContent.toString().match(/^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?$/)) {
            // Currency
            return (<div className="text-right">{cellData}</div>);
        } else if (this.isImageContent(cellData)) {
            return (<img className="align-top mr-1 grid-avatar" alt=' ' src={cellData}></img>);
        } else if ('object' === typeof cellData) {
            return (
                <div className="d-inline-block align-middle">
                    {Object.keys(cellData).map((dataKey, keyIndex) => this.isImageContent(cellData[dataKey]) &&
                        <img key={keyIndex} className="align-top mr-1 grid-avatar" alt=' ' src={cellData[dataKey]}></img>
                    )}
                    <div className="d-inline-block">
                        {Object.keys(cellData).map((dataKey, keyIndex) => !this.isImageContent(cellData[dataKey]) && 'object' !== typeof cellData[dataKey] &&
                            <div key={keyIndex} className={keyIndex === 0 ? 'h5' : 'h6'}>{cellData[dataKey]}</div>
                        )}
                    </div>
                    {Object.keys(cellData).map((dataKey, keyIndex) => 'object' === typeof cellData[dataKey] &&
                        <div key={keyIndex} className="d-inline-block ml-2">{this.renderDataContent(cellData[dataKey])}</div>
                    )}
                </div>
            )
        }
        return cellContent;
    }

    onChangeRowData(headerInfo, rowData, key, value) {
        if (headerInfo.changeAction) {
            headerInfo.changeAction(rowData, key, value);
        }
    }

    renderDataInput(headerInfo, rowData) {
        if ('checkbox' === headerInfo.type.toLowerCase()) {
            return inputField(headerInfo.type, headerInfo.key, '', !!rowData[headerInfo.key], this.onChangeRowData.bind(this, headerInfo, rowData),
                { container: 'text-center' });
        } else if ('switch' === headerInfo.type.toLowerCase()) {
            return inputField(headerInfo.type, headerInfo.key, '', !!rowData[headerInfo.key], this.onChangeRowData.bind(this, headerInfo, rowData),
                { container: 'text-center', input: 'mt-2', switchHeight: 15 });
        } else if ('select' === headerInfo.type.toLowerCase()) {
            return inputField(headerInfo.type, headerInfo.key, '', rowData[headerInfo.key], this.onChangeRowData.bind(this, headerInfo, rowData),
                { input: 'component-stretched' }, headerInfo.selectValues);
        } else {
            return inputField(headerInfo.type, headerInfo.key, '', rowData[headerInfo.key], this.onChangeRowData.bind(this, headerInfo, rowData),
                { input: 'component-stretched' });
        }
    }

    renderStatusAction(headerInfo, rowData) {
        //TODO :: Revisit this to externalise
        let cellData = (rowData[headerInfo.key] || '').toUpperCase();
        let cellColor = '', cellIcon = '';
        if (['STARTED', 'PROCESSING', 'INPROGRESS'].indexOf(cellData) >= 0) {
            cellColor = 'text-info';
            cellIcon = 'fa fa-spinner fa-pulse'
        } else if (['COMPLETE', 'COMPLETED'].indexOf(cellData) >= 0) {
            cellColor = 'text-success';
            cellIcon = 'feather icon-check'
        } else if (['ERROR', 'FAILED'].indexOf(cellData) >= 0) {
            cellColor = 'text-danger';
            cellIcon = 'feather icon-alert-triangle'
        }
        return (
            <div className={cellColor} >
                <i className={cellIcon} /><span className='ml-1 mr-1'>{rowData[headerInfo.key] || ''}</span>
                {this.renderDataActions(rowData, headerInfo.dataActions)}
            </div>
        )
    }

    renderDataActions(rowData, gridActions) {
        const { styleActions } = this.props;
        return gridActions && gridActions.length > 0 && gridActions.map((actionItem, actionIndex) =>
            <span key={actionIndex} className='align-top'>
                {actionButton(actionItem.btnTitle, () => { actionItem.btnAction(rowData) },
                    'align-top mr-1' + (actionItem.btnCondition && actionItem.btnCondition(rowData, actionItem) === false ? ' grid-action-hidden ' : ' grid-action-button') +
                    (!!styleActions && actionItem.btnClass ? ' ' + actionItem.btnClass : ''), actionItem.iconClass)}
            </span>
        )
    }

    renderLinkAction(headerInfo, rowData) {
        return (
            <Tooltip title={headerInfo.linkTitle || ''}>
                <button className='btn transparent p-0 grid-action-link' onClick={() => { headerInfo.linkAction(rowData, headerInfo.key) }}>
                    {rowData[headerInfo.key] || ''}
                </button>
            </Tooltip>
        )
    }

    renderGridActions(rowData) {
        const { gridActions } = this.state;
        return (
            <div className="align-top text-center">
                {this.renderDataActions(rowData, gridActions)}
            </div>
        );
    }

    renderGridData(headerInfo, rowData) {
        if (headerInfo.dataFormat === 'relativeTimestamp' && rowData[headerInfo.key]) {
            return <Timestamp relative date={rowData[headerInfo.key]} />
        } else if (headerInfo.dataFormat === 'linkAction') {
            return this.renderLinkAction(headerInfo, rowData)
        } else if (headerInfo.dataFormat === 'dataAction') {
            return <div className="align-top text-center">{this.renderDataActions(rowData, headerInfo.dataActions)}</div>
        } else if (headerInfo.dataFormat === 'statusAction') {
            return this.renderStatusAction(headerInfo, rowData)
        } else if (headerInfo.dataFormat === 'input' && headerInfo.type) {
            return this.renderDataInput(headerInfo, rowData)
        } else {
            return this.renderDataContent(headerInfo.key === 'status' ? [rowData[headerInfo.key]] : rowData[headerInfo.key])
        }
    }

    navigatePage(btnTitle) {
        const { displayOffset, displayLimit, filteredData } = this.state;

        // let pageCount = Math.ceil((this.props.tableData || []).length / displayLimit);
        let pageCount = Math.ceil((filteredData || []).length / displayLimit);
        if ('Prev' === btnTitle || 'Previous' === btnTitle) {
            this.setState({ displayOffset: displayOffset > 0 ? displayOffset - 1 : 0 })
        } else if ('Next' === btnTitle) {
            this.setState({ displayOffset: (displayOffset + 1) < pageCount ? displayOffset + 1 : displayOffset })
        } else {
            this.setState({ displayOffset: btnTitle - 1 })
        }
    }

    sortGridColumn(sortIndex) {
        const { gridSort } = this.state;

        if (sortIndex === gridSort.sortIndex) {
            gridSort.ascending = !gridSort.ascending;
        } else {
            gridSort.sortIndex = sortIndex;
            gridSort.ascending = true;
        }
        this.setState({ gridSort: gridSort });
    }

    getGridData() {
        const { displayOffset, displayLimit } = this.state;
        const gridData = this.getSortedData();
        if (gridData.length === 0) {
            return gridData;
        } else {
            return gridData.slice(displayOffset * (displayLimit * 1), ((displayOffset * (displayLimit * 1)) + (displayLimit * 1)));
        }
    }

    render() {
        const { containerId, hideGridName, hideGridSearch, gridHeader, gridSort, readOnlyGrid, filteredData, displayOffset, displayLimit } = this.state;
        const { createAction, createLabel, tableName, tableData } = this.props;
        const searchKeys = this.props.searchKeys || (gridHeader ? gridHeader.map((headerInfo) => (headerInfo.key)) : []);
        const filterKeys = this.props.filterKeys || gridHeader || [];
        const gridData = this.getGridData();

        let pageCount = Math.ceil((filteredData || []).length / displayLimit);
        var navButtons = [];
        if (pageCount > 1) {
            navButtons.push({ btnTitle: 'Prev' });
            for (var pageNumber = 0; pageNumber < pageCount; pageNumber++) {
                navButtons.push({ btnTitle: (pageNumber + 1) });
            }
            navButtons.push({ btnTitle: 'Next' });
        }

        return (
            <section id={containerId} className={"studio-container p-0" + (this.props.customClass ? (' ' + this.props.customClass) : '')}>
                {!hideGridName &&
                    <Row xs="1" md="1">
                        <Col className="text-left">
                            {createAction &&
                                actionButton(createLabel || 'Create', () => { createAction() },
                                    'ml-1 content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)
                                // <button className="btn-sm btn-round btn-primary pull-right"
                                //     onClick={() => { createAction() }}><i className="feather icon-plus fa-lg" /> {createLabel || 'Create'}</button>
                            }
                            <h3>{tableName || 'Studio Table'}</h3>
                        </Col>
                    </Row>
                }
                <Row xs="1" md="1">
                    <Col className="p-0">
                        <Card className="mb-0">
                            <CardBody className="p-1">
                                <div className="text-left align-middle">
                                    {hideGridName && createAction &&
                                        actionButton(createLabel || 'Create', () => { createAction() },
                                            'ml-1 content-float-right', 'feather icon-plus', true, false, ACTION_BUTTON.PRIMARY)
                                        // <button className="ml-1 btn-sm btn-round btn-primary pull-right"
                                        //     onClick={() => { createAction() }}><i className="feather icon-plus fa-lg" /> {createLabel || 'Create'}</button>
                                    }
                                    {!hideGridSearch && gridHeader && <StudioFilter
                                        searchKeys={searchKeys}
                                        filterKeys={filterKeys}
                                        data={tableData || []}
                                        defaultFilter={this.props.defaultFilter || []}
                                        onChangeFilter={this.onChangeFilter.bind(this)} />
                                    }
                                    <div className="pt-0 pr-2 pb-0 pl-2">
                                        Show
                                        <select className="ml-2 mr-2 br-5x text-right" name="displayLimit" value={displayLimit}
                                            onChange={(e) => { this.setState({ displayOffset: 0, displayLimit: e.target.value }) }}>
                                            {['5', '10', '15', '25', '50', '100'].map((optionValue, valueIndex) =>
                                                <option key={valueIndex} value={optionValue}>{optionValue}</option>)}
                                        </select>
                                        rows
                                    </div>
                                </div>

                                <Table responsive striped bordered hover className="mb-0 studio-table" id={"table-" + containerId}>
                                    <thead className='studio-table-head'>
                                        <tr className='studio-table-head-row'>
                                            {gridHeader && gridHeader.length > 0 && gridHeader.map((headerInfo, headerIndex) =>
                                                <th key={headerIndex}
                                                    className={'p-2 studio-table-head-col ' + (headerInfo.customClass ? 'text-center ' : '') + 'table-sorting '
                                                        + ((!gridSort || gridSort.sortIndex !== headerIndex) ? 'table-sorting-none'
                                                            : (gridSort.ascending ? 'table-sorting-asc' : 'table-sorting-desc'))}
                                                    onClick={() => { this.sortGridColumn(headerIndex) }}
                                                >{headerInfo.label}</th>
                                            )}
                                            {!readOnlyGrid &&
                                                <th width="1%" className="p-2 text-center studio-table-head-col">ACTIONS</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody className='studio-table-data'>
                                        {gridData.map((rowData, rowIndex) =>
                                            <tr key={rowIndex} className='studio-table-data-row'>
                                                {gridHeader && gridHeader.length > 0 && gridHeader.map((headerInfo, headerIndex) =>
                                                    <td key={headerIndex}
                                                        className={(headerInfo.dataFormat === 'input' ? 'p-1 ' : 'p-2 ') + "content-wrapped studio-table-data-col" + (headerInfo.customClass ? (' ' + headerInfo.customClass) : '')}
                                                    >{this.renderGridData(headerInfo, rowData)}</td>
                                                )}
                                                {!readOnlyGrid &&
                                                    <td className="p-2 studio-table-data-col" >{this.renderGridActions(rowData)}</td>
                                                }
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>

                                {pageCount > 1 &&
                                    <div className="text-left align-middle mt-1">
                                        <div className="content-float-right table-nav-container">
                                            {navButtons.map((buttonInfo, btnIndex) =>
                                                <button key={btnIndex} onClick={() => { this.navigatePage(buttonInfo.btnTitle) }}
                                                    className={'btn' + (buttonInfo.btnTitle === (displayOffset + 1) ? ' btn-primary' : ' btn-transparent')}
                                                >{buttonInfo.btnTitle}</button>
                                            )}
                                        </div>
                                        <div className="p-1 pl-2">
                                            {'Showing ' + (displayOffset * (displayLimit * 1) + 1) + ' to ' +
                                                (((displayOffset * (displayLimit * 1)) + (displayLimit * 1)) < filteredData.length ? ((displayOffset * (displayLimit * 1)) + (displayLimit * 1)) : filteredData.length) +
                                                ' of ' + filteredData.length + ' rows'
                                            }
                                        </div>
                                    </div>
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </section>
        )
    }
}
export default StudioTable;