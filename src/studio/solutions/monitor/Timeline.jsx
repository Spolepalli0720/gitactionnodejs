import React from "react";
import { Table, Progress } from 'reactstrap';

export default class Timeline extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            slotCount: 12, slotWidth: 80
        }
    }

    getStatusCode(data) {
        let code = 200;
        switch (data.status) {
            case 'STARTED':
            case 'PROCESSING':
            case 'INPROGRESS':
                code = 102;
                break;
            case 'NOTSTARTED':
            case 'WAITING':
                code = 202;
                break;
            case 'ERROR':
                code = 400;
                break;
            default:
                code = 200;
        }
        return code;
    }

    getStatusColor(data) {
        let color = ''
        switch (data.status) {
            case 'STARTED':
            case 'PROCESSING':
            case 'INPROGRESS':
                color = 'info';
                break;
            case 'NOTSTARTED':
            case 'WAITING':
                color = 'secondary';
                break;
            case 'ERROR':
                color = 'danger';
                break;
            default:
                color = 'success';
        }
        return color;
    }

    getStatusIcon(data) {
        let className = ''
        switch (data.status) {
            case 'STARTED':
            case 'PROCESSING':
            case 'INPROGRESS':
                className = 'fa fa-spinner fa-pulse text-' + this.getStatusColor(data);
                break;
            case 'NOTSTARTED':
            case 'WAITING':
                className = 'feather icon-pause-circle text-' + this.getStatusColor(data);
                break;
            case 'ERROR':
                className = 'feather icon-alert-triangle text-' + this.getStatusColor(data);
                break;
            default:
                className = 'feather icon-check-circle text-' + this.getStatusColor(data);
        }
        return <i className={className} />
    }

    getDuration(data) {
        let response = ''
        if (data.duration) {
            let remain = data.duration ? (data.duration * 1) : 0;
            let days = Math.floor(remain / (1000 * 60 * 60 * 24))
            remain = remain % (1000 * 60 * 60 * 24)
            let hours = Math.floor(remain / (1000 * 60 * 60))
            remain = remain % (1000 * 60 * 60)
            let minutes = Math.floor(remain / (1000 * 60))
            remain = remain % (1000 * 60)
            let seconds = Math.floor(remain / (1000))
            remain = remain % (1000)
            let milliseconds = remain

            if (days > 0) {
                response = response + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ' + Math.trunc(milliseconds) + 'ms'
            } else if (hours > 0) {
                response = response + hours + 'h ' + minutes + 'm ' + seconds + 's ' + Math.trunc(milliseconds) + 'ms'
            } else if (minutes > 0) {
                response = response + minutes + 'm ' + seconds + 's ' + Math.trunc(milliseconds) + 'ms'
            } else if (seconds > 0) {
                response = response + seconds + 's ' + Math.trunc(milliseconds) + 'ms'
            } else if (milliseconds > 0) {
                response = response + Math.trunc(milliseconds) + 'ms'
            }
        }
        return response
    }

    getDurationBar(dataItem, timeline) {
        const { slotWidth } = this.state;
        let activityStart = new Date(dataItem.startDate).getTime()

        return <Progress striped title={timeline.data.length > 1 ? this.getDuration({ duration: dataItem.duration }) : dataItem.startDate}
            style={{
                width: (dataItem.duration * slotWidth / timeline.slotDuration),
                height: 15,
                marginLeft: timeline.data.length > 1 ? 0 : (((activityStart - timeline.start) / timeline.slotDuration) * slotWidth)
            }} value={100} color={this.getStatusColor(dataItem)} />
    }

    getTimeline(data, level, timeline) {
        const { slotCount } = this.state;
        data.sort((a, b) => (a.startDate ? new Date(a.startDate) : new Date()) - (b.startDate ? new Date(b.startDate) : new Date()));
        return data.map((dataItem, dataIndex) =>
            <React.Fragment key={dataIndex}>
                <tr className='studio-table-data-row'>
                    <td style={{ paddingLeft: (level * 10) + 10 }} className={'pr-2 pt-0 pb-0 align-middle studio-table-data-col'}>{dataItem.taskName}</td>
                    <td className='pl-2 pr-2 pt-0 pb-0 align-middle studio-table-data-col text-right'>{this.getStatusCode(dataItem)}</td>
                    <td className='pl-2 pr-2 pt-0 pb-0 align-middle studio-table-data-col text-right'>{this.getDuration(dataItem)}</td>
                    <td className='pl-2 pr-2 pt-0 pb-0 align-middle studio-table-data-col text-center'>{this.getStatusIcon(dataItem)}</td>
                    <td colSpan={slotCount} className='p-0 align-middle studio-table-data-col'>
                        {dataItem.startDate && dataItem.duration > 0 && this.getDurationBar(dataItem, timeline)}
                    </td>
                </tr>
            </React.Fragment>
        )
    }

    calculateTimeline(data) {
        const { slotCount } = this.state;
        let activityTimings = [];
        let start = 0, end = 0, totalDuration = 0, slotDuration = 0, slots = undefined;

        data.forEach(dataItem => {
            dataItem.timeline.forEach(timelineData => {
                timelineData.duration = (timelineData.duration || '') * 1;
                if (timelineData.duration > totalDuration) {
                    totalDuration = timelineData.duration
                }
                if (timelineData.startDate) {
                    activityTimings.push(timelineData.startDate);
                }
                if (timelineData.endDate) {
                    activityTimings.push(timelineData.endDate);
                }
            })
        })

        var i;
        if (data.length > 1) {
            if (totalDuration > 0) {
                slots = [];
                slotDuration = totalDuration / slotCount;
                slots.push('0')
                for (i = 1; i <= (slotCount - 2); i++) {
                    slots.push(this.getDuration({ duration: slotDuration * i }))
                }
                slots.push(this.getDuration({ duration: totalDuration }))
            }
        } else if (activityTimings.length > 0) {
            activityTimings = activityTimings.sort((a, b) => new Date(a) - new Date(b));
            start = new Date(activityTimings[0]).getTime()
            end = new Date(activityTimings[activityTimings.length - 1]).getTime()
            totalDuration = end - start
            slotDuration = totalDuration / (slotCount - 1)
            slots = [];
            let isoString = new Date(start).toISOString()
            slots.push(isoString.slice(11, 19) + ' ' + isoString.slice(20, 23) + 'ms')
            for (i = 1; i <= (slotCount - 2); i++) {
                isoString = new Date(start + (slotDuration * i)).toISOString();
                slots.push(isoString.slice(11, 19) + ' ' + isoString.slice(20, 23) + 'ms');
            }
            isoString = new Date(end).toISOString()
            slots.push(isoString.slice(11, 19) + ' ' + isoString.slice(20, 23) + 'ms');
        }

        return {
            data: data, start: start, end: end,
            totalDuration: totalDuration, slotDuration: slotDuration, slots: slots
        }
    }

    render() {
        const { slotCount, slotWidth } = this.state;
        let timeline = this.calculateTimeline(this.props.data);

        return (
            <Table responsive striped bordered hover className="mb-0 studio-table mb-2">
                <thead className='studio-table-head'>
                    <tr className='studio-table-head-row'>
                        <th className='p-2 align-middle studio-table-head-col'>Details</th>
                        <th width='1%' className='p-2 align-middle studio-table-head-col'>Response</th>
                        <th width='1%' className='p-2 align-middle studio-table-head-col text-center'
                            title={'Total: ' + this.getDuration({ duration: timeline.totalDuration }) +
                                ' TimeSlot:' + this.getDuration({ duration: timeline.slotDuration })}>Duration</th>
                        <th width='1%' className='p-2 align-middle studio-table-head-col'>Status</th>
                        {timeline.slots && timeline.slots.map((timeSlot, slotIndex) =>
                            <th key={slotIndex} style={{ width: slotWidth, minWidth: slotWidth, maxWidth: slotWidth, whiteSpace: 'break-spaces' }}
                                className='p-0 align-middle studio-table-head-col text-center'
                                title={'Slot Start: ' + timeSlot}>
                                <span className='text-lowercase'>{timeline.data.length > 1 ? timeSlot : timeSlot.split(' ')[0]}</span>
                            </th>
                        )}
                        {!timeline.slots &&
                            <th style={{ width: slotCount * slotWidth, minWidth: slotCount * slotWidth, maxWidth: slotCount * slotWidth, whiteSpace: 'break-spaces' }}></th>
                        }
                    </tr>
                </thead>
                <tbody className='studio-table-data'>
                    {timeline.data.map((dataItem, dataIndex) =>
                        <React.Fragment key={dataIndex}>
                            {dataItem.id &&
                                <tr className='studio-table-data-row'>
                                    <td className='pl-2 pr-2 pt-0 pb-0 align-middle studio-table-data-col'>
                                        <div className='align-top'>
                                            <span>{dataItem.id}</span>
                                            <i className={'btn p-0 feather icon-chevron-' + (dataItem.collapsed ? 'up' : 'down') + ' mt-1 float-right'}
                                                onClick={() => {
                                                    dataItem.collapsed = !dataItem.collapsed;
                                                    this.setState({ userAction: !this.state.userAction })
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td width='1%' className='pl-2 pr-2 pt-0 pb-0 align-middle studio-table-data-col text-right'>{this.getStatusCode(dataItem)}</td>
                                    <td width='1%' className='pl-2 pr-2 pt-0 pb-0 align-middle studio-table-data-col text-right'>{this.getDuration(dataItem)}</td>
                                    <td width='1%' className='pl-2 pr-2 pt-0 pb-0 align-middle studio-table-data-col text-center'>{this.getStatusIcon(dataItem)}</td>
                                    <td colSpan={slotCount} className='pl-2 pr-2 pt-0 pb-0 align-middle studio-table-data-col'></td>
                                </tr>
                            }
                            {!dataItem.collapsed && this.getTimeline(dataItem.timeline, dataItem.id ? 1 : 0, timeline)}
                        </React.Fragment>
                    )}
                </tbody>
            </Table>
        )
    }
}