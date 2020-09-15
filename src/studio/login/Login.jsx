import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Aux from "../../hoc/_Aux";
import { inputField } from '../utils/StudioUtils';
import { userService } from "../services/UserService";
import logo from '../../assets/studio/images/logo.png';
import bever from '../../assets/studio/images/bever.png';
import auth_facebook from '../../assets/studio/images/auth_facebook.png';
import auth_gmail from '../../assets/studio/images/auth_gmail.png';
import auth_linkedin from '../../assets/studio/images/auth_linkedIn.png';
import Terms from './Terms';

class Login extends React.Component {
    constructor(props) {
        super(props);

        userService.logout();

        this.state = {
            activeForm: 'signin', containerStyle: 'container',

            firstName: '', lastName: '',
            username: '', password: '', signupName: '',
            changePassword: '', confirmPassword: '',
            rememberMe: false,
            signupTerms: false, signup_success: false,

            processing: false,
            modalEvent: '', showModal: false
        };
    }

    componentDidMount() {
        const rememberedUser = userService.getRememberedUser();
        if (rememberedUser.username) {
            this.setState({ processing: true, username: rememberedUser.username, password: rememberedUser.password, rememberMe: true });
            this.signin(rememberedUser.username, rememberedUser.password, true);
        }
    }

    handleForgotPassword = (e) => {
        e.preventDefault();
        this.setState({ activeForm: 'forgot', submit_success: undefined, submit_error: undefined });
    }

    handleRememberPassword = (e) => {
        e.preventDefault();
        this.setState({ activeForm: 'signin', submit_success: undefined, submit_error: undefined });
    }

    handleSubmit = (e, authMode) => {
        const parent = this;
        e.preventDefault();

        this.setState({ processing: true, submit_success: undefined, submit_error: undefined });

        if (authMode === 'signup') {
            parent.signup(this.state.username, this.state.changePassword, this.state.firstName, this.state.lastName);
        } else if (authMode === 'signin') {
            parent.signin(this.state.username, this.state.password, this.state.rememberMe);
        } else if (authMode === 'change') {
            parent.change(this.state.password, this.state.changePassword);
        } else if (authMode === 'forgot') {
            parent.forgot(this.state.username);
        }
    };

    signup(username, password, firstName, lastName) {
        const parent = this;
        userService.signup(username, password, firstName, lastName).then(user => {
            parent.setState({
                rememberMe: false, password: '', changePassword: '', confirmPassword: '', processing: false,
                signup_success: user.hasOwnProperty('id'), activeForm: 'signin', containerStyle: 'container',
                firstName: '', lastName: '', signupName: username
            });
        }).catch(error => {
            parent.setState({
                password: '', changePassword: '', confirmPassword: '', processing: false,
                submit_error: error, signup_success: false
            });
        });
    }

    signin(username, password, rememberMe) {
        const parent = this;
        userService.login(username, password, rememberMe).then(user => {
            if (user.forcePasswordChange) {
                parent.setState({ processing: false, activeForm: 'change' });
            } else {
                window.location.replace("/home");
            }
        }).catch(error => {
            parent.setState({ processing: false, submit_error: error });
        });
    }

    change(password, changePassword) {
        const parent = this;
        let payload = {
            oldPassword: password,
            newPassword: changePassword
        };
        userService.changePassword(payload).then(user => {
            userService.forgetMe();
            let submit_success = "You've successfully changed your password.  5 seconds to redirect for Sign in";
            parent.setState({ rememberMe: false, password: '', changePassword: '', confirmPassword: '', processing: false, submit_success: submit_success })

            setTimeout(() => {
                parent.setState({ activeForm: 'signin', password: '', changePassword: '', confirmPassword: '', submit_success: undefined });
            }, 5000);
        }).catch(error => {
            parent.setState({ changePassword: '', confirmPassword: '', processing: false, submit_error: error });
        });
    }

    forgot(username) {
        const parent = this;
        userService.forgotPassword(username).then(user => {
            userService.forgetMe();
            let submit_success = "You've successfully reset your password.  Check your email for temporary password.";
            parent.setState({ rememberMe: false, password: '', changePassword: '', confirmPassword: '', processing: false, submit_success: submit_success })

            setTimeout(() => {
                parent.setState({ activeForm: 'signin', password: '', submit_success: undefined });
            }, 10000);
        }).catch(error => {
            parent.setState({ password: '', processing: false, submit_error: error });
        });
    }

    isValidUserName() {
        return this.state.username.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/);
    }

    isValidPassword() {
        return this.state.password.length > 6;
    }

    isValidChangePassword() {
        return this.state.changePassword.length > 6;
    }

    isValidSignUp() {
        return this.state.firstName.length > 0
            && this.state.lastName.length > 0
            && this.isValidUserName()
            && this.isValidChangePassword()
            && this.state.changePassword === this.state.confirmPassword;
        // && this.state.signupTerms;
    }

    isValidSignIn() {
        return this.isValidUserName()
            && this.isValidPassword();
    }

    isValidChange() {
        return this.isValidUserName()
            && this.isValidPassword()
            && this.isValidChangePassword()
            && this.state.changePassword === this.state.confirmPassword;
    }

    getSubmitButton(btnName, btnDisabled) {
        return (
            <button className='login-form-submit' disabled={btnDisabled || this.state.processing}>
                {btnName}
                {this.state.processing && <i className='ml-2 fa fa-spinner fa-spin' />}
            </button>
        )
    }

    getSocialButton() {
        return (
            <div className='social-container text-center mt-1'>
                <img className='invisible' src={auth_facebook} alt='Facebook' title='Facebook' />
                <img className='invisible' src={auth_gmail} alt='Google' title='Google' />
                <img className='invisible' src={auth_linkedin} alt='LinkedIn' title='LinkedIn' />
            </div>
        )
    }

    getSubmitStatus(action_success, action_error) {
        let message = '';
        let msgType = '';
        if (action_success) {
            msgType = 'alert-success';
            message = action_success.message ? action_success.message : action_success.toString();
        } else if (action_error) {
            msgType = 'alert-danger';
            message = action_error.message ? action_error.message : action_error.toString();
        }
        return (
            <div className={`alert ${msgType} text-center mt-1 mb-0 p-0`}>{message}</div>
        );
    }

    onChangeInput(name, value) {
        this.setState({ [name]: value });
    }

    showForm = () => {
        const { activeForm, submit_success, submit_error } = this.state;

        return (
            <div>
                <div className="form-container sign-in-container">
                    <form action='#' onSubmit={(e) => this.handleSubmit(e, 'signin')} className={activeForm !== 'signin' ? 'form-container-hidden' : ''}>
                        <Row xs='1' md='1' className='m-0 text-center mb-4 mt-4 pt-2'>
                            <Col>
                                {/* <i className='studio-primary fa fa-user-circle fa-3x'></i> */}
                                <img className='icon-bever' src={bever} alt=' ' />
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 text-center mb-0 mt-1 pt-1'>
                            <Col><h4>Welcome to Bēver Platform</h4></Col>
                            <Col className='pl-4 pr-4 pt-0 pb-1'>
                                Sign in by entering the information below
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 mt-4'>
                            <Col className='pt-1'>
                                {inputField('email', 'username', 'Login Name', this.state.username, this.onChangeInput.bind(this),
                                    { required: true, help: 'Login Name must be a valid email.' })}
                            </Col>
                            <Col className='pt-1 pr-3'>
                                {inputField('password', 'password', 'Password', this.state.password, this.onChangeInput.bind(this),
                                    { required: true, pattern: '.{7,}', help: 'Must be at least 7 characters.' })}
                            </Col>
                        </Row>
                        <Row xs='1' md='2' className='m-0 mt-1'>
                            <Col>
                                {inputField('checkbox', 'rememberMe', 'Remember Me', this.state.rememberMe, this.onChangeInput.bind(this), { label: 'w-auto' })}
                            </Col>
                            <Col>
                                <Link to="/" className="login-form-link pull-right mt-1" onClick={(e) => this.handleForgotPassword(e)}>Forgot your password?</Link>
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 mt-1'>
                            <Col className='text-center'>{this.getSubmitButton('Sign in', !this.isValidSignIn())}</Col>
                            <Col>
                                {submit_error && this.getSubmitStatus(undefined, submit_error)}
                                {!submit_error && this.getSocialButton()}
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0'>
                            <Col className='p-0'>
                                <div className="login-copyright mt-3 pt-3"><i className='far fa-copyright mr-1'></i>2020 All Rights Reserved by DigitalDots Inc</div>
                            </Col>
                        </Row>
                    </form>
                    <form action='#' onSubmit={(e) => this.handleSubmit(e, 'change')} className={activeForm !== 'change' ? 'form-container-hidden' : ''}>
                        <Row xs='1' md='1' className='m-0 text-center mb-4 mt-4 pt-2'>
                            <Col><i className='studio-primary fa fa-user-circle fa-3x'></i></Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 text-center mb-1 mt-4 pt-2'>
                            <Col><h4>Change Password</h4></Col>
                            <Col className='pl-4 pr-4 pt-2 pb-2'>
                                Your Account password has been reset.  Protect your Account with a stronger password.
                            </Col>
                            <Col className="text-left">
                                <ul className='login-password-hint mb-0'>
                                    <li>Must be at least 7 characters</li>
                                    <li>Contain a mix of lower case, upper case, numbers and symbol characters</li>
                                </ul>
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 mt-2 pt-0'>
                            <Col className='pt-1 pr-3'>
                                {inputField('password', 'changePassword', 'Password', this.state.changePassword, this.onChangeInput.bind(this),
                                    { required: true, pattern: '.{7,}', help: 'Must be at least 7 characters.' })}
                            </Col>
                            <Col className='pt-1 pr-3'>
                                {inputField('password', 'confirmPassword', 'Confirm Password', this.state.confirmPassword, this.onChangeInput.bind(this),
                                    { required: true, help: 'Must match the password.' })}
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 mt-2'>
                            <Col className='text-center'>{this.getSubmitButton('Change Password', !this.isValidChange())}</Col>
                            <Col>{this.getSubmitStatus(submit_success, submit_error)}</Col>
                        </Row>
                    </form>
                    <form action='#' onSubmit={(e) => this.handleSubmit(e, 'forgot')} className={activeForm !== 'forgot' ? 'form-container-hidden' : ''}>
                        <Row xs='1' md='1' className='m-0 text-center mb-4 mt-4 pt-2'>
                            <Col><i className='studio-primary fa fa-user-circle fa-3x'></i></Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 text-center mb-1 mt-4 pt-2'>
                            <Col><h4>Reset Password</h4></Col>
                            <Col className='pl-4 pr-4 pt-2 pb-2'>
                                Resetting your password is a very simple task, and the process should take you a couple of minutes. Let's get started.
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 mt-4 pt-0'>
                            <Col className='pt-1'>
                                {inputField('email', 'username', 'Login Name', this.state.username, this.onChangeInput.bind(this),
                                    { required: true, help: 'Login Name must be a valid email.' })}
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 mt-4 pt-0'>
                            <Col>
                                <Link to="/" className="login-form-link pull-right mt-0" onClick={(e) => this.handleRememberPassword(e)}>
                                    {submit_success ? 'Click here to Sign in' : 'Remember your password?'}
                                </Link>
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 mt-2'>
                            <Col className='text-center'>{this.getSubmitButton('Reset Password', !this.isValidUserName() || submit_success)}</Col>
                            <Col>{this.getSubmitStatus(submit_success, submit_error)}</Col>
                        </Row>
                    </form>
                </div>
                <div className="form-container sign-up-container">
                    <form action="#" onSubmit={(e) => this.handleSubmit(e, 'signup')} className={activeForm !== 'signup' ? 'form-container-hidden' : ''}>
                        <Row xs='1' md='1' className='m-0 text-center mb-4 mt-4 pt-2'>
                            <Col>
                                {/* <i className='studio-primary fa fa-user-plus fa-3x'></i> */}
                                <img className='icon-bever' src={bever} alt=' ' />
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 text-center mb-0 mt-1 pt-1'>
                            <Col><h4>Welcome to Bēver Platform</h4></Col>
                            <Col className='pl-4 pr-4 pt-0 pb-1 mb-2'>
                                Sign up to jump start creating intuitive Digital Solutions
                            </Col>
                        </Row>
                        <Row xs='1' md='2' className='m-0'>
                            <Col className='pt-1 pr-1'>
                                {inputField('text', 'firstName', 'First Name', this.state.firstName, this.onChangeInput.bind(this), { required: true })}
                            </Col>
                            <Col className='pt-1 pl-1'>
                                {inputField('text', 'lastName', 'Last Name', this.state.lastName, this.onChangeInput.bind(this), { required: true })}
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0'>
                            <Col className='pt-1'>
                                {inputField('email', 'username', 'Login Name', this.state.username, this.onChangeInput.bind(this),
                                    { required: true, help: 'Login Name must be a valid email.' })}
                            </Col>
                        </Row>
                        <Row xs='1' md='2' className='m-0'>
                            <Col className='pt-1 pr-1'>
                                {inputField('password', 'changePassword', 'Password', this.state.changePassword, this.onChangeInput.bind(this),
                                    { required: true, pattern: '.{7,}', help: 'Must be at least 7 characters.' })}
                            </Col>
                            <Col className='pt-1 pl-1'>
                                {inputField('password', 'confirmPassword', 'Confirm Password', this.state.confirmPassword, this.onChangeInput.bind(this),
                                    { required: true, help: 'Must match the password.' })}
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 mt-3'>
                            <Col className='text-center'>{this.getSubmitButton('Sign Up', !this.isValidSignUp())}</Col>
                            <Col>
                                {(submit_success || submit_error) && this.getSubmitStatus(submit_success, submit_error)}
                                {!(submit_success || submit_error) && this.getSocialButton()}
                            </Col>
                        </Row>
                    </form>
                </div>
            </div>
        )
    }

    showShifter = () => {
        const { signup_success, activeForm } = this.state;

        return (
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-right pl-0 pr-0">
                        <Row xs='1' md='1' className='m-0 text-center'>
                            <Col>
                                <div className='overlay-logo-outer mb-5'>
                                    {!signup_success &&
                                        <img height='50px' id="main-logo" src={logo} alt="" className="logo" />
                                    }
                                    {signup_success && <i className="fa fa-thumbs-up fa-4x welcomes_icon" />}
                                </div>
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 text-center mb-0 pt-2'>
                            <Col className="p-0">
                                <h3 className="shiter_header login-form-heading">
                                    {signup_success ? 'You have been Registered Successfully' : "Create Account"}
                                </h3></Col>
                            <Col className='pt-0 pl-4 pr-4 pb-3 mb-3'>
                                {signup_success ? `A confirmation email has been sent to ${this.state.signupName}. Post verification, you can Sign in with your credentials to get started.`
                                    : 'On-board the Digital Enablement Platform registering with your email ID'}
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className={'m-0 mt-3' + (signup_success ? ' form-container-hidden' : '')}>
                            <Col className='text-center'>
                                <button className='login-form-submit transparent'
                                    disabled={this.state.processing || activeForm === 'change' || signup_success}
                                    onClick={() => {
                                        this.setState({
                                            activeForm: 'signup', containerStyle: 'container right-panel-active',
                                            firstName: '', lastName: '',
                                            username: '', password: '',
                                            changedPassword: '', confirmPassword: '',
                                            submit_success: undefined, submit_error: undefined,
                                            signup_success: false
                                        })
                                    }}>
                                    Register
                                </button>
                            </Col>
                        </Row>
                    </div>
                    <div className="overlay-panel overlay-left pl-0 pr-0">
                        <Row xs='1' md='1' className='m-0 text-center'>
                            <Col><div className='overlay-logo-outer mb-5'>
                                <img height='50px' id="main-logo" src={logo} alt="" className="logo" />
                            </div></Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 text-center mb-3 pt-2'>
                            <Col className="p-0"><h3 className="shiter_header login-form-heading">Already Signed up?</h3></Col>
                            <Col className='pt-0 pl-4 pr-4 pb-0'>
                                Sign in with your credentials to get started
                            </Col>
                        </Row>
                        <Row xs='1' md='1' className='m-0 mt-3'>
                            <Col className='text-center'>
                                <button className='login-form-submit transparent'
                                    disabled={this.state.processing}
                                    onClick={() => {
                                        this.setState({
                                            activeForm: 'signin', containerStyle: 'container',
                                            firstName: '', lastName: '',
                                            username: '', password: '',
                                            changedPassword: '', confirmPassword: '',
                                            submit_success: undefined, submit_error: undefined
                                        })
                                    }}>
                                    Sign In
                                </button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { showModal, modalEvent } = this.state;
        const toggle = () => this.setState({ showModal: false, modalEvent: undefined });

        return (
            <Aux>
                <div className="login-container">
                    <div className={this.state.containerStyle}>
                        {this.showShifter()}
                        {this.showForm()}
                    </div>
                </div>
                <Modal centered scrollable size={'xl'} isOpen={showModal && modalEvent === 'signupTerms'}>
                    <ModalHeader toggle={toggle} className="p-3">Terms &amp; Conditions</ModalHeader>
                    <ModalBody className="pt-0 pb-0 pl-2 pr-2">
                        <Terms />
                    </ModalBody>
                </Modal>
            </Aux>
        );
    }
}

export default Login;
