import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Fullscreen from "react-full-screen";
import windowSize from 'react-window-size';
import ReactNotification from 'react-notifications-component';

import Navigation from './Navigation';
import NavBar from './NavBar';
// import Breadcrumb from './Breadcrumb';
import Configuration from './Configuration';
import Loader from "../Loader";
import Aux from "../../../hoc/_Aux";
import * as actionTypes from "../../../store/actions";
import { userService } from '../../../studio/services/UserService'
import ChangePassword from '../../../studio/profile/ChangePassword';

import { Modal, ModalHeader, ModalBody } from "reactstrap";

//import '../../../app.scss';

class AdminLayout extends Component {

    state = {
        showModal: false
    }

    fullScreenExitHandler = () => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            this.props.onFullScreenExit();
        }
    };

    UNSAFE_componentWillMount() {
        if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
            this.props.onUNSAFE_componentWillMount();
        }
    }

    mobileOutClickHandler() {
        if (this.props.windowWidth < 992 && this.props.collapseMenu) {
            this.props.onUNSAFE_componentWillMount();
        }
    }


    render() {
        const toggle = () => this.setState({ showModal: false });

        const showChangePassword = () => {
            this.setState({
                showModal: true,
            })
        }

        const cancelChangePass = () => {
            this.setState({ showModal: false })
        }

        // STUDIO_CUSTOMIZATION
        if (!userService.isAuthenticated()) {
            this.props.history.push('/');
            window.location.reload();
            return;
        }

        /* full screen exit call */
        document.addEventListener('fullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('webkitfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('mozfullscreenchange', this.fullScreenExitHandler);
        document.addEventListener('MSFullscreenChange', this.fullScreenExitHandler);

        // STUDIO_CUSTOMIZATION :: Filter Access Routes based on User Role
        // const menu = routes.map((route, index) => {
        //     return (route.component) ? (
        //         <Route
        //             key={index}
        //             path={route.path}
        //             exact={route.exact}
        //             name={route.name}
        //             render={props => (
        //                 <route.component {...props} />
        //             )} />
        //     ) : (null);
        // });
        const access_routes = userService.getAccessRoutes();
        const menu = access_routes.map((route, index) => {
            return (route.component) ? (
                <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                        (props.studioRouter = route,
                        <route.component {...props} />)
                    )} />
            ) : (null);
        });

        let mainClass = ['pcoded-wrapper'];
        if (this.props.layout === 'horizontal' && this.props.subLayout === 'horizontal-2') {
            mainClass = [...mainClass, 'container'];
        }
        return (
            <Aux>
                <Fullscreen enabled={this.props.isFullScreen}>
                    {/* Menu Items */}
                    <Navigation />
                    <NavBar showChangePassword={() => {
                        showChangePassword()
                    }} />
                    {/* STUDIO_CUSTOMIZATION */}
                    <ReactNotification />
                    <div className="pcoded-main-container" onClick={() => this.mobileOutClickHandler}>
                        <div className={mainClass.join(' ')}>
                            <div className="pcoded-content">
                                <div className="pcoded-inner-content">
                                    {/* STUDIO_CUSTOMIZATION */}
                                    {/* <Breadcrumb /> */}
                                    <div className="main-body">
                                        <div className="page-wrapper">
                                            <Suspense fallback={<Loader />}>
                                                <Switch>
                                                    {menu}
                                                    <Redirect from="/" to={this.props.defaultPath} />
                                                </Switch>
                                            </Suspense>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Configuration />
                </Fullscreen>
                <Modal centered size={'lg'} isOpen={this.state.showModal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>
                        Change Password
                    </ModalHeader>
                    <ModalBody>
                        <ChangePassword cancel={() => cancelChangePass()} />
                    </ModalBody>
                </Modal>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        defaultPath: state.defaultPath,
        isFullScreen: state.isFullScreen,
        collapseMenu: state.collapseMenu,
        layout: state.layout,
        subLayout: state.subLayout
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFullScreenExit: () => dispatch({ type: actionTypes.FULL_SCREEN_EXIT }),
        onUNSAFE_componentWillMount: () => dispatch({ type: actionTypes.COLLAPSE_MENU })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(AdminLayout));
