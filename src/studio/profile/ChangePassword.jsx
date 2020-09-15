import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { notifyError, notifySuccess } from '../utils/Notifications';
import { inputField, actionButton, ACTION_BUTTON } from '../utils/StudioUtils';
import { userService } from '../services/UserService';


class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changePasswordConfigForm: {
                cpassword: "",
                npassword: "",
                cnpassword: "",
            },
            errors: true

        }
    }

    handleChange = (propName, propValue) => {
        const { changePasswordConfigForm } = this.state;
        changePasswordConfigForm[propName] = propValue;
        let error = this.checkValidation(changePasswordConfigForm);
        this.setState({ changePasswordConfigForm: changePasswordConfigForm, errors: error });
    }

    checkValidation = (changePasswordConfigForm) => {
        let error = false;
        if (changePasswordConfigForm.cpassword === '' || changePasswordConfigForm.npassword === '' || changePasswordConfigForm.cnpassword === '') {
            error = true
        }

        if ((changePasswordConfigForm.npassword && changePasswordConfigForm.cnpassword) && (changePasswordConfigForm.npassword !== changePasswordConfigForm.cnpassword)) {
            error = true;
        }

        return error;
    }



    handleSubmit = () => {
        const { cpassword, npassword } = this.state.changePasswordConfigForm;
        let formData = {
            oldPassword: cpassword,
            newPassword: npassword
        }
        userService.changePassword(formData)
            .then(res => {
                this.props.cancel();
                userService.logout();
                notifySuccess('Success', 'Password changed successfully. Redirecting. Please login to continue');
                setTimeout(() => {
                    window.location.replace("/signout");
                }, 4000);

            })
            .catch(err => {
                console.error('Change password error', err);
                notifyError('Error', err.message);
            })

    }

    render() {
        const { changePasswordConfigForm, errors } = this.state;
        return (
            <Row xs="1" md="1">
                <Col>
                    <Card>
                        <CardBody>
                            <Row xs="1" md="1" className="mb-2">
                                <Col>
                                    {inputField('password', 'cpassword', 'Current Password', changePasswordConfigForm.cpassword,
                                        this.handleChange.bind(this), { label: '', input: '', required: true })}
                                </Col>
                                <Col>
                                    {inputField('password', 'npassword', 'New Password', changePasswordConfigForm.npassword,
                                        this.handleChange.bind(this), { label: '', input: '', required: true })}
                                </Col>
                                <Col>
                                    {inputField('password', 'cnpassword', 'Re-Type New Password', changePasswordConfigForm.cnpassword,
                                        this.handleChange.bind(this), { label: '', input: '', required: true })}
                                </Col>
                            </Row>
                            <Row xs="1" md="1" className="mb-2">
                                <Col className="text-right">
                                    {actionButton('Cancel', this.props.cancel.bind(this),
                                        'ml-2', '', true, false, ACTION_BUTTON.DANGER)}
                                    {actionButton('Change password', this.handleSubmit.bind(this),
                                        'ml-2', '', true, errors, ACTION_BUTTON.PRIMARY)}
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>

                </Col>
            </Row>
        )
    }
}

export default ChangePassword;