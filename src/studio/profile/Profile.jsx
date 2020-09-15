import React from 'react';
import { Row, Col, Card, CardBody, CardFooter, CardHeader } from 'reactstrap';
import { userService } from '../services/UserService';
import { notifySuccess, notifyError } from '../utils/Notifications';
import { inputField, actionButton, ACTION_BUTTON } from '../utils/StudioUtils';
import { BasicSpinner } from '../utils/BasicSpinner';
import ProfileCover from '../../assets/theme/images/profile/47.jpg';
import ProfileSummary from './ProfileSummary';
import './user-management.scss';



let ACCOUNT_SETTINGS = {};
const CHANGE_PASSWORD = {
    cpassword: '',
    npassword: '',
    cnpassword: ''
};

const NOTIFICATIONS = {
    slackWorkSpace: '',
    notificationEmail: '',
    notificationPhoneNum: '',
    notificationSkype: '',
    isAllNotificationEnabled: false,
    isPhoneNotificationEnabled: false,
    isEmailNotificationEnabled: false,
    isSlackNotificationEnabled: false,
    isSkypeNotificationEnabled: false,
}



class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataLoading: true,
            profileConfigForm: {
                accountsettings: {},
                changePassword: {},
                notifications: {}
            },
            errors: {
                accountsettings: false,
                changePassword: true,
                notifications: false

            },
            image: '',
            isPersonalEdit: false,
            isChangePasswordEdit: false,
            isNotificationEdit: false,
            profileDetails: [{ title: 'My Solutions', count: 5 }, { title: 'Profile Views', count: 30 }],
            tabs: [{ title: 'Account Settings', destinationUrl: 'accountsettings' }, { title: 'Change Password', destinationUrl: 'changepassword' }, { title: 'Notifications', destinationUrl: 'notifications' }]
        }
    }

    // SERVER ERRORS

    componentDidMount() {
        const parent = this;
        const { profileConfigForm } = this.state;
        userService.getProfile().then(res => {
            ACCOUNT_SETTINGS = res;
            profileConfigForm['accountsettings'] = JSON.parse(JSON.stringify(ACCOUNT_SETTINGS));
            profileConfigForm['changePassword'] = JSON.parse(JSON.stringify(CHANGE_PASSWORD));
            profileConfigForm['notifications'] = JSON.parse(JSON.stringify(NOTIFICATIONS));
            parent.setState({
                dataLoading: false,
                image: userService.getAvatar(res.id),
                profileConfigForm: profileConfigForm
            })

        }).catch(error => {
            console.error('Get User profile error', error);
            notifyError('Error', error.message);
            parent.setState({ dataLoading: false });

        })
    }



    handleSubmit = () => {
        const { profileConfigForm, isPersonalEdit, isChangePasswordEdit } = this.state;
        if (isPersonalEdit) {
            let accountSettingsField = profileConfigForm['accountsettings'];
            userService.updateProfile(accountSettingsField)
                .then(res => {
                    ACCOUNT_SETTINGS = res;
                    profileConfigForm['accountsettings'] = JSON.parse(JSON.stringify(ACCOUNT_SETTINGS));
                    this.setState({ profileConfigForm: profileConfigForm, isPersonalEdit: false });
                    notifySuccess('Success', 'Profile updated successfully');
                })
                .catch(error => {
                    console.error('Update profile error', error);
                    notifyError('Error', error.message);
                })
        } else if (isChangePasswordEdit) {
            let formData = {
                oldPassword: profileConfigForm['changePassword'].cpassword,
                newPassword: profileConfigForm['changePassword'].npassword
            }
            userService.changePassword(formData)
                .then(res => {
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
        } else {
            // api to be integrated for notifications
            console.log('notifications submit', profileConfigForm['notifications']);
            profileConfigForm['notifications'] = JSON.parse(JSON.stringify(NOTIFICATIONS));
            this.setState({ isNotificationEdit: false })
        }
    }

    handleChange = (propName, propValue) => {
        const { profileConfigForm } = this.state;
        let errors;
        const propPath = propName.split('.');
        if (propPath.length === 2) {
            if (propPath[1] === 'isAllNotificationEnabled') {
                (profileConfigForm[propPath[0]])['isSlackNotificationEnabled'] = propValue;
                (profileConfigForm[propPath[0]])['isEmailNotificationEnabled'] = propValue;
                (profileConfigForm[propPath[0]])['isPhoneNotificationEnabled'] = propValue;
                (profileConfigForm[propPath[0]])['isSkypeNotificationEnabled'] = propValue;
            }
            (profileConfigForm[propPath[0]])[propPath[1]] = propValue;
            errors = this.checkValidation(profileConfigForm);
            this.setState({ profileConfigForm: profileConfigForm, errors: errors })
        } else {
            profileConfigForm[propName] = propValue;
            errors = this.checkValidation(profileConfigForm);
            this.setState({ profileConfigForm: profileConfigForm, errors: errors })
        }



    };

    checkValidation = (profileConfigForm) => {
        let errors = { accountsettings: false, changePassword: false, notifications: false }
        // validation for account settings
        if (profileConfigForm['accountsettings'].firstName === '' || profileConfigForm['accountsettings'].lastName === '') {
            errors.accountsettings = true;
        }

        // validations for change password
        if (profileConfigForm['changePassword'].cpassword === '' || profileConfigForm['changePassword'].npassword === '' || profileConfigForm['changePassword'].cnpassword === '') {
            errors.changePassword = true;
        }

        if ((profileConfigForm['changePassword'].npassword && profileConfigForm['changePassword'].cnpassword) && profileConfigForm['changePassword'].npassword !== profileConfigForm['changePassword'].cnpassword) {
            errors.changePassword = true;
        }

        // check validation for notifications

        return errors;
    }




    handleFileChange = (event) => {
        const parent = this;
        const { profileConfigForm } = this.state;
        var userAvatar = event.target.files[0]
        if (userAvatar && userAvatar.size < 20000) {
            userService.updateAvatar(profileConfigForm['accountsettings'].id, userService.getDisplayName(), userAvatar).then(avatarId => {
                profileConfigForm['accountsettings'].avatar = avatarId;
                notifySuccess("SUCCESS", "Image uploaded")
                parent.setState({ image: userService.getAvatar(profileConfigForm['accountsettings'].id), profileConfigForm: profileConfigForm })
            }).catch(error => {
                console.log('userService.updateAvatar', error);
                notifyError('Update Avatar', error.message);
            });
        } else {
            notifyError("ERROR", "The file size should be less than 20kb")
        }
    }



    onEditBtnClick = (name, value) => {
        const { profileConfigForm } = this.state;
        if (name === 'isPersonalEdit' && value === true) {
            let errors = this.checkValidation(profileConfigForm);
            this.setState({ isPersonalEdit: value, isNotificationEdit: false, isChangePasswordEdit: false, errors: errors });
        } else if (name === 'isChangePasswordEdit' && value === true) {
            let errors = this.checkValidation(profileConfigForm);
            this.setState({ isPersonalEdit: false, isNotificationEdit: false, isChangePasswordEdit: value, errors: errors });
        } else if (name === 'isNotificationEdit' && value === true) {
            let errors = this.checkValidation(profileConfigForm);
            this.setState({ isPersonalEdit: false, isNotificationEdit: value, isChangePasswordEdit: false, errors: errors });
        } else {
            if (name === 'isPersonalEdit') {
                profileConfigForm['accountsettings'] = JSON.parse(JSON.stringify(ACCOUNT_SETTINGS));
            } else if (name === 'isChangePasswordEdit') {
                profileConfigForm['changePassword'] = JSON.parse(JSON.stringify(CHANGE_PASSWORD));
            } else if (name === 'isNotificationEdit') {
                profileConfigForm['notifications'] = JSON.parse(JSON.stringify(NOTIFICATIONS));
            }
            this.setState({ [name]: value, profileConfigForm: profileConfigForm });
        }
    }

    generateForm = (type) => {
        const { isPersonalEdit, profileConfigForm, isChangePasswordEdit, isNotificationEdit } = this.state;
        if (type === 'accountsettings') {
            return (
                <React.Fragment key={type}>
                    <div id={type} className="spyscroll">
                        <Row xs="2" md="2">
                            <Col>
                                <h5>Account Settings</h5>
                            </Col>
                            <Col className="text-right">
                                {actionButton(`${isPersonalEdit ? 'Cancel' : 'Edit'}`, this.onEditBtnClick.bind(this, 'isPersonalEdit', !isPersonalEdit),
                                    '', `${isPersonalEdit ? 'feather icon-x' : 'feather icon-edit'}`, false, false, ACTION_BUTTON.PRIMARY)}
                            </Col>
                        </Row>
                        <Row xs="1" md="2">
                            <Col>
                                {isPersonalEdit &&
                                    inputField('text', 'accountsettings.firstName', 'First Name', profileConfigForm.accountsettings.firstName,
                                        this.handleChange.bind(this), { label: '', input: '', required: true })
                                }
                                {!isPersonalEdit &&
                                    <div>
                                        <label className="mb-1">First Name</label>
                                        <label className={`${!profileConfigForm.accountsettings.firstName ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.accountsettings.firstName ? <strong>{profileConfigForm.accountsettings.firstName}</strong> : <em className="custom-display">First Name</em>}</label>
                                    </div>
                                }
                            </Col>
                            <Col>
                                {isPersonalEdit &&
                                    inputField('text', 'accountsettings.lastName', 'Last Name', profileConfigForm.accountsettings.lastName,
                                        this.handleChange.bind(this), { label: '', input: '', required: true })
                                }
                                {!isPersonalEdit &&
                                    <div>
                                        <label className="mb-1">Last Name</label>
                                        <label className={`${!profileConfigForm.accountsettings.lastName ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.accountsettings.lastName ? <strong>{profileConfigForm.accountsettings.lastName}</strong> : <em>Last Name</em>}</label>
                                    </div>
                                }
                            </Col>
                            <Col>
                                {isPersonalEdit &&
                                    inputField('email', 'accountsettings.username', 'Email', profileConfigForm.accountsettings.username,
                                        this.handleChange.bind(this), { label: '', input: '', required: true, disabled: true })
                                }
                                {!isPersonalEdit &&
                                    <div>
                                        <label className="mb-1">Email</label>
                                        <label className={`${!profileConfigForm.accountsettings.username ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.accountsettings.username ? <strong>{profileConfigForm.accountsettings.username}</strong> : <em>Email</em>}</label>
                                    </div>
                                }
                            </Col>
                            <Col>
                                {isPersonalEdit &&
                                    inputField('select', 'accountsettings.gender', 'Gender', profileConfigForm.accountsettings.gender,
                                        this.handleChange.bind(this), { label: '', input: '' }, [{ label: '', value: '' }, { label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }])
                                }
                                {!isPersonalEdit &&
                                    <div>
                                        <label className="mb-1">Gender</label>
                                        <label className={`${!profileConfigForm.accountsettings.gender ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.accountsettings.gender ? <strong>{profileConfigForm.accountsettings.gender}</strong> : <em>Gender</em>}</label>
                                    </div>
                                }
                            </Col>
                            <Col>
                                {isPersonalEdit &&
                                    inputField('date', 'accountsettings.dateOfBirth', 'Birth Date', profileConfigForm.accountsettings.dateOfBirth,
                                        this.handleChange.bind(this), { label: '', input: '' })
                                }
                                {!isPersonalEdit &&
                                    <div>
                                        <label className="mb-1">Birth Date</label>
                                        <label className={`${!profileConfigForm.accountsettings.dateOfBirth ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.accountsettings.dateOfBirth ? <strong>{profileConfigForm.accountsettings.dateOfBirth}</strong> : <em>Birth Date</em>}</label>
                                    </div>
                                }
                            </Col>
                            <Col>
                                {isPersonalEdit &&
                                    inputField('tel', 'accountsettings.phoneNo', 'Phone', profileConfigForm.accountsettings.phoneNo,
                                        this.handleChange.bind(this), { label: '', input: '' })
                                }
                                {!isPersonalEdit &&
                                    <div>
                                        <label className="mb-1">Phone</label>
                                        <label className={`${!profileConfigForm.accountsettings.phoneNo ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.accountsettings.phoneNo ? <strong>{profileConfigForm.accountsettings.phoneNo}</strong> : <em>Phone</em>}</label>
                                    </div>
                                }
                            </Col>
                        </Row>
                        <Row xs="1" md="1">
                            <Col>
                                {isPersonalEdit &&
                                    inputField('textarea', 'accountsettings.address', 'Address', profileConfigForm.accountsettings.address,
                                        this.handleChange.bind(this), { label: '', input: 'component-stretched' })
                                }
                                {!isPersonalEdit &&
                                    <div>
                                        <label className="mb-1">Address</label>
                                        <label className={`${!profileConfigForm.accountsettings.address ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.accountsettings.address ? <strong>{profileConfigForm.accountsettings.address}</strong> : <em>Address</em>}</label>
                                    </div>
                                }
                            </Col>
                        </Row>
                    </div>
                    <hr />
                </React.Fragment>
            )
        } else if (type === 'changepassword') {
            return (
                <React.Fragment key={type}>
                    <div id={type} className="spyscroll">
                        <Row xs="2" md="2">
                            <Col>
                                <h5>Change Password</h5>
                            </Col>
                            <Col className="text-right">
                                {actionButton(`${isChangePasswordEdit ? 'Cancel' : 'Edit'}`, this.onEditBtnClick.bind(this, 'isChangePasswordEdit', !isChangePasswordEdit),
                                    '', `${isChangePasswordEdit ? 'feather icon-x' : 'feather icon-edit'}`, false, false, ACTION_BUTTON.PRIMARY)}
                            </Col>
                        </Row>
                        <Row xs="1" md="1">
                            <Col>
                                {isChangePasswordEdit &&
                                    inputField('password', 'changePassword.cpassword', 'Current Password', profileConfigForm.changePassword.cpassword,
                                        this.handleChange.bind(this), { label: '', input: '', required: true })
                                }
                                {!isChangePasswordEdit &&
                                    <div>
                                        <label className="mb-1">Current Password</label>
                                        <label className={`${!profileConfigForm.changePassword.cpassword ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.changePassword.cpassword ? <strong>{profileConfigForm.changePassword.cpassword}</strong> : <em>Current Password</em>}</label>
                                    </div>
                                }
                            </Col>
                            <Col>
                                {isChangePasswordEdit &&
                                    inputField('password', 'changePassword.npassword', 'New Password', profileConfigForm.changePassword.npassword,
                                        this.handleChange.bind(this), { label: '', input: '', required: true })
                                }
                                {!isChangePasswordEdit &&
                                    <div>
                                        <label className="mb-1">New Password</label>
                                        <label className={`${!profileConfigForm.changePassword.npassword ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.changePassword.npassword ? <strong>{profileConfigForm.changePassword.npassword}</strong> : <em>New Password</em>}</label>
                                    </div>
                                }
                            </Col>
                            <Col>
                                {isChangePasswordEdit &&
                                    inputField('password', 'changePassword.cnpassword', 'Re-Type New Password', profileConfigForm.changePassword.cnpassword,
                                        this.handleChange.bind(this), { label: '', input: '', required: true })
                                }
                                {!isChangePasswordEdit &&
                                    <div>
                                        <label className="mb-1">Re-Type New Password</label>
                                        <label className={`${!profileConfigForm.changePassword.cnpassword ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.changePassword.cnpassword ? <strong>{profileConfigForm.changePassword.cnpassword}</strong> : <em>Confirm New Password</em>}</label>
                                    </div>
                                }
                            </Col>
                        </Row>
                    </div>
                    <hr />
                </React.Fragment>
            )
        } else if (type === 'notifications') {
            return (
                <React.Fragment key={type}>
                    <div id={type} className="spyscroll">
                        <Row xs="2" md="2">
                            <Col>
                                <h5>Notifications</h5>
                            </Col>
                            <Col className="text-right">
                                {actionButton(`${isNotificationEdit ? 'Cancel' : 'Edit'}`, this.onEditBtnClick.bind(this, 'isNotificationEdit', !isNotificationEdit),
                                    '', `${isNotificationEdit ? 'feather icon-x' : 'feather icon-edit'}`, false, false, ACTION_BUTTON.PRIMARY)}
                            </Col>
                        </Row>
                        <Row xs="1" md="2">
                            <Col>
                            </Col>
                            <Col className="text-right">
                                {inputField('switch', 'notifications.isAllNotificationEnabled', '', profileConfigForm.notifications.isAllNotificationEnabled,
                                    this.handleChange.bind(this), { label: 'component-stretched', input: 'component-stretched', switchTextOn: 'YES', switchTextOff: 'NO', disabled: !isNotificationEdit })
                                }
                            </Col>
                        </Row>
                        <Row xs="1" md="2">
                            <Col>
                                {isNotificationEdit &&
                                    inputField('text', 'notifications.slackWorkSpace', 'Slack', profileConfigForm.notifications.slackWorkSpace,
                                        this.handleChange.bind(this), { label: '', input: '' })
                                }
                                {!isNotificationEdit &&
                                    <div>
                                        <label className="mb-1"><i className="fab fa-slack" /> Slack</label>
                                        <label className={`${!profileConfigForm.notifications.slackWorkSpace ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.notifications.slackWorkSpace ? <strong>{profileConfigForm.notifications.slackWorkSpace}</strong> : <em>Slack Workspace</em>}</label>
                                    </div>
                                }
                            </Col>
                            <Col className="text-right">
                                {inputField('switch', 'notifications.isSlackNotificationEnabled', `${isNotificationEdit ? profileConfigForm.notifications.isSlackNotificationEnabled ? 'Enabled' : 'Disabled' : ''}`, profileConfigForm.notifications.isSlackNotificationEnabled,
                                    this.handleChange.bind(this), { label: 'component-stretched', input: 'component-stretched', disabled: !isNotificationEdit })
                                }
                            </Col>
                            <Col>
                                {isNotificationEdit &&
                                    inputField('email', 'notifications.notificationEmail', 'Email', profileConfigForm.notifications.notificationEmail,
                                        this.handleChange.bind(this), { label: '', input: '' })
                                }
                                {!isNotificationEdit &&
                                    <div>
                                        <label className="mb-1"><i className="fa fa-envelope" /> Email</label>
                                        <label className={`${!profileConfigForm.notifications.notificationEmail ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.notifications.notificationEmail ? <strong>{profileConfigForm.notifications.notificationEmail}</strong> : <em>Email</em>}</label>
                                    </div>
                                }
                            </Col>
                            <Col className="text-right">
                                {inputField('switch', 'notifications.isEmailNotificationEnabled', `${isNotificationEdit ? profileConfigForm.notifications.isEmailNotificationEnabled ? 'Enabled' : 'Disabled' : ''}`, profileConfigForm.notifications.isEmailNotificationEnabled,
                                    this.handleChange.bind(this), { label: 'component-stretched', input: 'component-stretched', disabled: !isNotificationEdit })
                                }
                            </Col>
                            <Col>
                                {isNotificationEdit &&
                                    inputField('tel', 'notifications.notificationPhoneNum', 'Phone number', profileConfigForm.notifications.notificationPhoneNum,
                                        this.handleChange.bind(this), { label: '', input: '' })
                                }
                                {!isNotificationEdit &&
                                    <div>
                                        <label className="mb-1"><i className="fa fa-mobile" /> Phone number</label>
                                        <label className={`${!profileConfigForm.notifications.notificationPhoneNum ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.notifications.notificationPhoneNum ? <strong>{profileConfigForm.notifications.notificationPhoneNum}</strong> : <em>Phone Number</em>}</label>
                                    </div>
                                }
                            </Col>
                            <Col className="text-right">
                                {inputField('switch', 'notifications.isPhoneNotificationEnabled', `${isNotificationEdit ? profileConfigForm.notifications.isPhoneNotificationEnabled ? 'Enabled' : 'Disabled' : ''}`, profileConfigForm.notifications.isPhoneNotificationEnabled,
                                    this.handleChange.bind(this), { label: 'component-stretched', input: 'component-stretched', disabled: !isNotificationEdit })
                                }
                            </Col>
                            <Col>
                                {isNotificationEdit &&
                                    inputField('text', 'notifications.notificationSkype', 'Skype', profileConfigForm.notifications.notificationSkype,
                                        this.handleChange.bind(this), { label: '', input: '' })
                                }
                                {!isNotificationEdit &&
                                    <div>
                                        <label className="mb-1"><i className="fab fa-skype" /> Skype</label>
                                        <label className={`${!profileConfigForm.notifications.notificationSkype ? 'text-muted' : ""} mt-1 custom-display`}>{profileConfigForm.notifications.notificationSkype ? <strong>{profileConfigForm.notifications.notificationSkype}</strong> : <em>Skype Id</em>}</label>
                                    </div>
                                }
                            </Col>
                            <Col className="text-right">
                                {inputField('switch', 'notifications.isSkypeNotificationEnabled', `${isNotificationEdit ? profileConfigForm.notifications.isSkypeNotificationEnabled ? 'Enabled' : 'Disabled' : ''}`, profileConfigForm.notifications.isSkypeNotificationEnabled,
                                    this.handleChange.bind(this), { label: 'component-stretched', input: 'component-stretched', disabled: !isNotificationEdit })
                                }
                            </Col>
                        </Row>
                    </div>
                </React.Fragment>
            )
        }
    }

    spyScroll = () => {
        //console.log('entered spy scroll');
        var section = document.querySelectorAll(".spyscroll");
        var sections = {};
        var i = 0;
        Array.prototype.forEach.call(section, function (e) {
            sections[e.id] = e.offsetTop;
        });

        var scrollPosition = document.getElementById('scroll').scrollTop;

        for (i in sections) {
            if (sections[i] <= scrollPosition + 270) {
                document.querySelector('.currently-selected').setAttribute('class', ' ');
                document.querySelector('a[href*=' + i + ']').setAttribute('class', 'currently-selected');
            }
        }

    }

    render() {
        const { dataLoading, tabs, isPersonalEdit, isChangePasswordEdit, isNotificationEdit, profileConfigForm, profileDetails, image, errors } = this.state;
        return (
            <section className="studio-container p-0">
                {dataLoading &&
                    <Card>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }

                {!dataLoading &&
                    <div>
                        <Row xs="1" md="1" className="mt-0">
                            <Col className="p-0">
                                <section className="profile-cover">
                                    <img src={ProfileCover} className="cover-img" alt="User profile Cover" />
                                </section>
                            </Col>
                        </Row>
                        <Row xs="1" md="2">
                            <Col md={3}>
                                <ProfileSummary profileData={
                                    {
                                        firstName: profileConfigForm['accountsettings'].firstName,
                                        lastName: profileConfigForm['accountsettings'].lastName,
                                        email: profileConfigForm['accountsettings'].username,
                                        imageUrl: image,
                                        handleFileChange: this.handleFileChange,
                                        profileDetails: profileDetails
                                    }
                                } />
                            </Col>
                            <Col md={9} className="custom-top">
                                <Card>
                                    <CardHeader className="wrapper">
                                        {tabs.map((tab, i) => {
                                            if (i === 0) {
                                                return <a key={tab.title} href={`#${tab.destinationUrl}`} className="currently-selected">{tab.title}</a>
                                            } else {
                                                return <a key={tab.title} href={`#${tab.destinationUrl}`}>{tab.title}</a>
                                            }
                                        })}

                                    </CardHeader>
                                    <CardBody className="p-2 studio-container-full-view" id="scroll" onScroll={this.spyScroll}>
                                        {tabs.map((tab) => this.generateForm(tab.destinationUrl))}
                                    </CardBody>
                                    <CardFooter className={isPersonalEdit || isChangePasswordEdit || isNotificationEdit ? '' : 'hidden'}>
                                        <Row xs="1" md="1">
                                            <Col className="text-right">
                                                {actionButton('Update', this.handleSubmit.bind(this),
                                                    '', '', true, isPersonalEdit ? errors.accountsettings : isChangePasswordEdit ? errors.changePassword : errors.notifications, ACTION_BUTTON.PRIMARY)}
                                            </Col>
                                        </Row>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                }

            </section>
        )
    }
}

export default Profile;