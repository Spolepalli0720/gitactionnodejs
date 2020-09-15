import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import { inputLabel, inputField } from './StudioUtils';

export default function StudioKeyMap(props) {
    let { name, label, value, onChange, style, id } = props;
    const [selectedKey, setSelectedKey] = useState();

    return <Row xs='1' md='2' className={(style ? ` ${style.container || ''}` : '')}>
        <Col className='pl-0 pt-0 pb-0'>
            <div className={'form-group studio'}>
                <i className='feather icon-plus-circle ml-1 mt-1 btn p-0 content-float-right text-primary'
                    onClick={() => {
                        if (!value) {
                            value = {}
                        }
                        let uid = 'name_' + Math.random().toString(36).substr(2, 9);
                        value[uid] = '';
                        setSelectedKey(uid);
                        onChange(name, value);
                    }} />
                {selectedKey &&
                    <i className='feather icon-x-circle mt-1 btn p-0  content-float-right text-danger'
                        onClick={() => {
                            delete value[selectedKey]
                            setSelectedKey(Object.keys(value)[0])
                            onChange(name, value);
                        }} />
                }
                {label && inputLabel(label, 'text-capitalize mb-1 w-auto', style)}
                <select size={5} id={id} name={name} value={selectedKey}
                    className={(style ? ` ${style.input || ''}` : '')}
                    disabled={style ? (style.disabled || false) : false}
                    onChange={(e) => { setSelectedKey(e.target.value) }}
                >
                    {value && Object.keys(value).map((valueName, valueIndex) =>
                        <option key={valueIndex} className='text-truncate' value={valueName}>{valueName}: {value[valueName]}</option>
                    )}
                </select>
            </div>
        </Col>
        {selectedKey && <Col className='pr-0 pt-0 pb-0'>
            {inputField('text', 'name', 'Name', selectedKey, (inputKey, inputValue) => {
                let uid = '*_' + Math.random().toString(36).substr(2, 9);
                value[inputValue || uid] = value[selectedKey]
                delete value[selectedKey]
                setSelectedKey(inputValue || uid)
                onChange(name, value);
            }, { required: true })}
            {inputField('text', 'value', 'Value', value[selectedKey], (inputKey, inputValue) => {
                value[selectedKey] = inputValue
                onChange(name, value);
            }, { container: 'mt-3', required: true })}
        </Col>}
    </Row>
}
