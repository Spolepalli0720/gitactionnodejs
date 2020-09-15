import React from "react";
import { Row, Col } from 'reactstrap';
import { OverlayTrigger, Popover } from "react-bootstrap";
import isEqual from "lodash.isequal";

/*
<StudioFilter
    searchKeys: [ 'name', 'description', 'tags' ]
    filterKeys: [ { label: 'Status', key: 'status' }, { label: 'Type', key: 'type', options: [ { label: 'Integration', value: 'INTEGRATION' }, ...] }, ... ]
    defaultFilter: [ { key: 'status', values: [ 'INPROGRESS', 'ERROR' ] }, ...]
    data={this.props.tableData}
    onChangeFilter={this.onChangeFilter.bind(this)}
/>
*/

export default class StudioFilter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            filterCols: {}
        }
    }

    componentDidMount() {
        const defaultFilter = this.props.defaultFilter || [];
        let filterCols = {};
        defaultFilter.forEach(function (filter) {
            filterCols[filter.key] = filter.values;
        })
        this.setState({ filterCols: filterCols });

        this.applyFilter();
    }

    componentDidUpdate(prevProps, prevState) {
        this.applyFilter();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.searchText !== nextState.searchText
            || !isEqual(this.state.filterCols, nextState.filterCols)
            || !isEqual(this.props.data || [], nextProps.data || []);
    }

    render() {
        const { filterCols } = this.state;
        var filterEnabled = (Object.keys(filterCols).length > 0);
        return (
            <div>
                <input className="content-search ml-0 mr-1 mt-0 mb-1 content-float-right" type="text"
                    placeholder="Search" onChange={(e) => { this.setState({ searchText: e.target.value }) }}
                />
                <sup title='Clear Filters'
                    onClick={() => this.setState({ filterCols: {} })}
                    className={'fa btn p-0 mt-1 mr-1 content-float-right ' + (Object.keys(filterCols).length > 0 ? 'studio-secondary' : 'content-transparent')}>x</sup>
                <OverlayTrigger rootClose
                    trigger="click" placement={this.props.placement || 'left'}
                    overlay={this.showFilters()}>
                    <i title='Filter' className={'feather icon-filter studio-primary btn p-0 ml-1 mr-0 mt-2 mb-1 content-float-right' + (filterEnabled ? ' studio-primary' : '')} />
                </OverlayTrigger>
            </div>
        )
    }

    showFilters() {
        const { filterCols } = this.state;
        const data = this.props.data || [];
        const filterKeys = this.props.filterKeys || (data.length > 0 ? Object.keys(data[0]).map((dataKey) => ({ key: dataKey })) : []);
        const columnKeys = filterKeys.map((filterInfo) => (filterInfo.key));

        return <Popover className='studio-filter-popover'>
            <Popover.Title className='text-left'>Data Filters</Popover.Title>
            <Popover.Content>
                <Row xs={1} md={5} className='justify-content-md-center'>
                    {filterKeys.map((filterInfo, filterIndex) =>
                        <Col key={filterIndex} className='text-center p-1 ml-1 mr-1'>
                            {this.getFilterColumn(filterInfo, filterIndex)}
                        </Col>
                    )}
                </Row>
                <hr className='mt-1' />
                <Row xs={1} md={5} className='justify-content-md-center'>
                    {Object.keys(filterCols).map((filterKey, keyIndex) => filterCols[filterKey].map((filterValue, valueIndex) =>
                        <Col key={keyIndex + '_' + valueIndex} className='text-center p-1 ml-2 mr-2'>
                            <label title={filterValue} className={'text-truncate selected-filter-value idx' + columnKeys.indexOf(filterKey)}>
                                {filterValue}
                            </label>
                            <sup className='selected-filter-delete fa-1x studio-secondary ml-0 mr-0 btn p-0'
                                onClick={() => {
                                    const updatedFilter = JSON.parse(JSON.stringify(filterCols));
                                    updatedFilter[filterKey].splice(valueIndex, 1);
                                    if (updatedFilter[filterKey].length === 0) {
                                        delete updatedFilter[filterKey];
                                    }
                                    this.setState({ filterCols: updatedFilter })
                                }}>x</sup>
                        </Col>
                    ))}
                </Row>
            </Popover.Content>
        </Popover>
    }

    getFilterColumn(filterInfo, filterIndex) {
        const { filterCols } = this.state;
        const data = this.props.data || [];
        let colValues = data.map(arrayItem => arrayItem[filterInfo.key] !== undefined && 'object' !== typeof arrayItem[filterInfo.key] && (arrayItem[filterInfo.key]));
        //Filter Unique Values
        colValues = colValues.filter((value, index, self) => self.indexOf(value) === index)
        colValues = colValues.sort();
        return <select className={'filter-column idx' + filterIndex + ' component-stretched ml-2 mb-1'} onChange={(e) => {
            const updatedFilter = JSON.parse(JSON.stringify(filterCols));
            if (!updatedFilter[filterInfo.key]) {
                updatedFilter[filterInfo.key] = [];
            }
            updatedFilter[filterInfo.key].push(e.target.value);
            this.setState({ filterCols: updatedFilter });
        }}>
            <option value=''>
                {filterInfo.label || filterInfo.key.match(/[A-Z]+[^A-Z]*|[^A-Z]+/g).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
            {filterInfo.options && filterCols[filterInfo.key] &&
                filterInfo.options.map((option, optionIndex) => filterCols[filterInfo.key].indexOf(option.value) < 0 && 
                <option key={optionIndex} value={option.value}>{option.label}</option>)
            }
            {filterInfo.options && !filterCols[filterInfo.key] &&
                filterInfo.options.map((option, optionIndex) => <option key={optionIndex} value={option.value}>{option.label}</option>)
            }
            {!filterInfo.options && filterCols[filterInfo.key] &&
                colValues.map((value, valueIndex) => filterCols[filterInfo.key].indexOf('' + value) < 0 &&
                <option key={valueIndex} value={value}>{'' + value}</option>
            )}
            {!filterInfo.options && !filterCols[filterInfo.key] &&
                colValues.map((value, valueIndex) => <option key={valueIndex} value={value}>{'' + value}</option>)
            }
        </select>
    }

    applyFilter() {
        const { searchText, filterCols } = this.state;
        let filteredData = this.props.data || [];

        if (Object.keys(filterCols).length > 0) {
            filteredData = filteredData.filter(arrayItem => this.isMatchingFilter(arrayItem))
        }

        if (searchText.length > 0) {
            filteredData = filteredData.filter(arrayItem => this.isMatchingSearch(arrayItem))
        }

        if (this.props.onChangeFilter) {
            this.props.onChangeFilter(filteredData)
        }
    }

    isMatchingFilter(dataObject) {
        const { filterCols } = this.state;
        let response = true;

        Object.keys(filterCols).forEach(function (key) {
            if (dataObject[key] && filterCols[key].indexOf(dataObject[key].toString()) < 0) {
                response = false;
            }
        })
        return response
    }

    isMatchingSearch(dataObject) {
        const { searchText } = this.state;
        const parent = this;
        const searchKeys = this.props.searchKeys || [];
        const matchKeys = searchKeys.length > 0 ? searchKeys : Object.keys(dataObject);
        let response = false;

        matchKeys.forEach(function (matchKey) {
            let dataElement = dataObject[matchKey] || '';
            if (!response && 'object' === typeof dataElement) {
                response = parent.isMatchingContent(dataElement);
            } else if (dataElement.toString().search(new RegExp(searchText, "i")) >= 0) {
                response = true;
            }
        })
        return response;
    }

    isMatchingContent(dataObject) {
        const { searchText } = this.state;
        const parent = this;
        let response = false;

        let objectKeys = Object.keys(dataObject).filter(objectKey => !this.isImageContent(dataObject[objectKey]));
        objectKeys.forEach(function (objectKey) {
            let dataElement = dataObject[objectKey] || '';
            if (!response && 'object' === typeof dataElement) {
                if (parent.isMatchingContent(dataElement)) {
                    response = true;
                }
            } else if (dataElement.toString().search(new RegExp(searchText, "i")) >= 0) {
                response = true;
            }
        })
        return response;
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

}