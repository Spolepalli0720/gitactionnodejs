import React from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Switch from "react-switch";
import Select from "react-select";

import StudioKeyMap from './StudioKeyMap';
import Tooltip from './Tooltip';
import Infotip from './Infotip';

export const ACTION_BUTTON = {
    PRIMARY: 'btn-primary', SECONDARY: 'btn-secondary', SUCCESS: 'btn-success',
    INFO: 'btn-info', WARNING: 'btn-warning', DANGER: 'btn-danger',
    LIGHT: 'btn-light', DARK: 'dark'
}

export function actionButton(title, btnAction, btnStyle, iconStyle, titleAsText, disabled, btnType) {

    if (titleAsText) {
        return <button onClick={(e) => { btnAction() }} disabled={!!disabled}
            className={(btnType ? ('btn-sm btn-round ' + btnType + ' br-5x ') : 'btn p-0 ') + btnStyle} >
            {iconStyle && <i className={iconStyle + (iconStyle.includes('icon-trash') ? ' text-danger' : (btnType ? '' : ' studio-primary'))} />}
            <span className={(iconStyle ? 'ml-1' : '') + (btnType ? (title.length < 6 ? ' pl-3 pr-3' : '') : '')}>{title}</span>
        </button>
    } else {
        return <Tooltip title={title}>
            <button onClick={(e) => { btnAction() }} disabled={!!disabled} className={'btn p-0 ' + btnStyle}>
                {iconStyle && <i className={iconStyle + (iconStyle.includes('icon-trash') ? ' text-danger' : ' studio-primary')} />}
            </button>
        </Tooltip>
    }
}

/*
    style = {
        container: 'Style, Margin, Position, etc.,',
        label: 'Style, Margin, Position, etc.,',
        input: 'Style, Margin, Position, etc.,',
        min, max, step, size, maxLength,
        disabled: false, readOnly: false required: false,
        pattern, placeholder, autoFocus,
        rows: 3, cols,
        checkboxLabelBefore: true/false,
        switchHeight: 28,
        switchWidth: 28,
        switchTextOn: 'YES',
        switchTextOff: 'NO'
        selectMultiple: true/false,
        selectSearchable: true/false,
    }
    inputField('checkbox', 'name', 'label', false, onChange.bind(this), )
    inputField('checkbox', 'name', 'label', 'value', onChange.bind(this), )
*/
export function inputLabel(label, className, style) {
    return <label className={className + (style && style.label ? ` ${style.label || ''}` : '')}>{label}
        {style && style.required && <sup className='ml-1 align-middle text-danger'>*</sup>}
        {style && style.help && <Infotip title={style.help}>
            <span className='ml-1 align-top feather icon-help-circle text-dark small' /></Infotip>}
    </label>
}
export function inputField(type, name, label, value, onChange, style, selectOptions, id) {

    if ('checkbox' === type.toLowerCase()) {
        return <div className={'form-group studio' + (style ? ` ${style.container || ''}` : '')}>
            {label && style?.checkboxLabelBefore && inputLabel(label, 'text-capitalize p-0 m-0 mb-0', style)}
            <input id={id} type={type} name={name} checked={value || false}
                className={(style ? ` ${style.input || ''}` : '')}
                disabled={style?.disabled} readOnly={style?.readOnly}
                onChange={(e) => onChange(name, e.target.checked)} />
            {label && !style?.checkboxLabelBefore && inputLabel(label, 'text-capitalize p-0 m-0 mb-0', style)}
        </div>
    } else if ('switch' === type.toLowerCase()) {
        let switchWidth = style?.switchWidth || style?.switchHeight || 28;

        return <div className={'form-group studio' + (style ? ` ${style.container || ''}` : '')}>
            {label && inputLabel(label, 'text-capitalize p-0 mr-3 mb-0 w-auto', style)}
            <div className={'studio-switch' + (style ? ` ${style.input || ''}` : '')} >
                <Switch className='react-switch'
                    id={id}
                    checked={value || false}
                    onChange={(checked) => onChange(name, checked)}
                    onColor="#0e90ff"
                    disabled={style?.disabled || false}
                    height={style?.switchHeight || 28}
                    width={(switchWidth * 2)}
                    handleDiameter={(style?.switchHeight || 28) - 5}
                    checkedIcon={style?.switchTextOn ? getSwitchIconText(style.switchTextOn) : false}
                    uncheckedIcon={style?.switchTextOff ? getSwitchIconText(style.switchTextOff) : false}
                />
            </div>
        </div>
    } else if ('select' === type.toLowerCase()) {
        return <div className={'form-group studio' + (style ? ` ${style.container || ''}` : '')}>
            {label && inputLabel(label, 'text-capitalize mb-1', style)}
            {style && style.selectMultiple &&
                <Select
                    isMulti={style.selectMultiple || false}
                    id={id} name={name}
                    value={value && selectOptions.filter(option => value.indexOf(option.value) >= 0)}
                    options={selectOptions}
                    className={'studio-select-custom' + (style ? ` ${style.input || ''}` : '')}
                    isDisabled={style?.disabled || false}
                    onChange={(selectedOption) => onChange(name, selectedOption ? selectedOption.map(option => (option.value)) : [])}
                    isSearchable={true}
                />
            }
            {style && !style.selectMultiple && style.selectSearchable &&
                <Select
                    id={id} name={name}
                    value={selectOptions.filter(option => option.value === value)}
                    options={selectOptions}
                    className={'studio-select-custom' + (style ? ` ${style.input || ''}` : '')}
                    isDisabled={style?.disabled || false}
                    onChange={(selectedOption) => onChange(name, selectedOption.value)}
                    isSearchable={true}
                />
            }
            {!(style && (style.selectMultiple || style.selectSearchable)) &&
                <select id={id} name={name} value={value || ''}
                    className={(style ? ` ${style.input || ''}` : '')}
                    disabled={style ? (style.disabled || false) : false}
                    onChange={(e) => onChange(name, e.target.value)}
                >
                    {selectOptions && selectOptions.map((selectOption, selectIndex) =>
                        <option key={selectIndex} value={selectOption.value}>{selectOption.label}</option>
                    )}
                </select>
            }
        </div>
    } else if ('keymap' === type.toLowerCase()) {
        return <StudioKeyMap name={name} label={label} value={value} onChange={onChange} style={style} id={id} />
    } else if ('textarea' === type.toLowerCase()) {
        return <div className={'form-group studio' + (style ? ` ${style.container || ''}` : '')}>
            {label && inputLabel(label, 'text-capitalize mb-1', style)}
            <textarea id={id} name={name} value={value || ''}
                className={'form-control' + (style ? ` ${style.input || ''}` : '')}
                placeholder={label ? undefined : style?.placeholder}
                rows={style?.rows || style?.textareaRows || 3} cols={style?.cols || style?.textareaCols}
                maxLength={style?.maxLength}
                disabled={style?.disabled} readOnly={style?.readOnly} required={style?.required}
                autoFocus={style?.autoFocus}
                onChange={(e) => onChange(name, e.target.value)} />
        </div>
    } else if ('password' === type.toLowerCase()) {
        let toggleId = id || generateUUID();
        return <div className={'form-group studio password-container' + (style ? ` ${style.container || ''}` : '')}>
            {label && inputLabel(label, 'text-capitalize mb-1', style)}
            <input id={toggleId} type={type} name={name} value={value || ''}
                className={'form-control' + (style ? ` ${style.input || ''}` : '')}
                placeholder={label ? undefined : style?.placeholder}
                size={style?.size} maxLength={style?.maxLength} pattern={style?.pattern}
                disabled={style?.disabled} readOnly={style?.readOnly} required={style?.required}
                autoFocus={style?.autoFocus}
                onChange={(e) => onChange(name, e.target.value)} />
            <span id={toggleId + '-toggle'} className="password-toggle feather icon-eye" title='Show Password'
                onClick={() => { togglePassword(toggleId) }} />
        </div>
    } else {
        return <div className={'form-group studio' + (style ? ` ${style.container || ''}` : '')}>
            {label && inputLabel(label, 'text-capitalize mb-1', style)}
            <input id={id} type={type} name={name} value={'file' === type.toLowerCase() ? undefined : (value || '')}
                className={'form-control' + (style ? ` ${style.input || ''}` : '')}
                placeholder={label ? undefined : style?.placeholder}
                checked={style?.checked}
                accept={style?.accept}
                min={style?.min} max={style?.max} step={style?.step}
                size={style?.size} maxLength={style?.maxLength} pattern={style?.pattern}
                disabled={style?.disabled} readOnly={style?.readOnly} required={style?.required}
                autoFocus={style?.autoFocus} multiple={style?.multiple}
                onChange={(e) => onChange(name, 'file' === type.toLowerCase() ? e.target.files : 'number' === type.toLowerCase() ? (e.target.value * 1) : e.target.value)} />
        </div>
    }
}

function getSwitchIconText(text) {
    return <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            color: "#fff",
            fontSize: '90%',
            textTransform: 'uppercase'
        }}
    >{text}</div>
}

function togglePassword(toggleId) {
    let userPassword = document.getElementById(toggleId);
    let userPasswordToggle = document.getElementById(toggleId + '-toggle');
    if (userPassword && userPasswordToggle && userPassword.type === 'password') {
        userPassword.type = 'text';
        userPasswordToggle.className = 'password-toggle feather icon-eye-off';
        userPasswordToggle.title = 'Hide Password'
    } else if (userPassword && userPasswordToggle && userPassword.type === 'text') {
        userPassword.type = 'password';
        userPasswordToggle.className = 'password-toggle feather icon-eye';
        userPasswordToggle.title = 'Show Password'
    }
}

export function generateUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
    });
    return uuid;
}

export function confirmWarning(title, text) {
    return withReactContent(Swal).fire({
        title: title,
        text: text,
        icon: 'warning',
        buttonsStyling: true,
        showConfirmButton: false,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'OK',
        focusCancel: false,
        allowOutsideClick: false,
    });
}

export function confirmAction(title) {
    return withReactContent(Swal).fire({
        title: title ? title + '?' : 'Are you sure?',
        input: 'text',
        inputPlaceholder: 'Comment',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        inputValidator: (value) => {
            if (!value) {
                return 'Comment is required'
            }
        },
        buttonsStyling: true,
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
    });
}

export function confirmDelete(title) {
    return withReactContent(Swal).fire({
        title: title ? title + '?' : 'Are you sure?',
        text: 'Once deleted, you will not be able to recover this record',
        input: 'text',
        inputPlaceholder: 'Comment',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        inputValidator: (value) => {
            if (!value) {
                return 'Comment is required'
            }
        },
        // type: 'warning',
        buttonsStyling: true,
        showConfirmButton: true,
        focusConfirm: false,
        showCancelButton: true,
        focusCancel: true,
        allowOutsideClick: false,
    });
}

export function confirmDeploy(title) {
    return withReactContent(Swal).fire({
        title: title,
        html:
            '<select id="swal-input1" class="swal2-input">' +
            '<option value="">Select Deployment Option</option>' +
            '<option value="DEV">Development</option>' +
            '<option value="QA">Quality Assurance</option>' +
            '<option value="UAT">User Acceptance</option>' +
            '<option value="SANDBOX">Sandbox</option>' +
            '</select>' +
            '<input id="swal-input2" class="swal2-input" placeholder="Title of Deployment" />',
        reverseButtons: true,
        buttonsStyling: true,
        showConfirmButton: true,
        confirmButtonText: 'Deploy',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
        allowOutsideClick: false,
        preConfirm: () => {
            let environment = document.getElementById('swal-input1').value;
            let name = document.getElementById('swal-input2').value;
            if (environment === '') {
                Swal.showValidationMessage(`Environment is required`)
            } else if (name === '') {
                Swal.showValidationMessage(`Name is required`)
            }
            return { environment: environment, name: name }
        },
    });
}


export function requestSigninPassword(title) {
    return withReactContent(Swal).fire({
        title: title,
        input: 'password',
        inputPlaceholder: 'Password',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        inputValidator: (value) => {
            if (!value) {
                return 'Password is required'
            }
        },
        buttonsStyling: true,
        showConfirmButton: true,
        confirmButtonText: 'SIGN IN',
        showCancelButton: false,
        showCloseButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
    });
}

export function badgeStyle(status) {
    if ("ACTIVE" === status) {
        return "badge-primary";
    } else if ("NEW" === status) {
        return "badge-secondary";
    } else if ("DRAFT" === status) {
        return "badge-secondary";
    } else if ("APPROVED" === status) {
        return "badge-success";
    } else if ("PENDING" === status) {
        return "badge-secondary";
    } else if ("DISABLED" === status) {
        return "badge-warning";
    } else if ("ARCHIVED" === status) {
        return "badge-danger";
    } else {
        // return "badge-dark";
        return "badge-secondary";
    }
}

