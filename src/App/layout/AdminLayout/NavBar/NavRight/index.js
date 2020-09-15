import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Timestamp from "react-timestamp";

import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";

import { userService } from '../../../../../studio/services/UserService';

class NavRight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listOpen: false,
            firebaseMsgUnread: localStorage.getItem('firebaseMsgUnread') === '1',
            firebaseUnreadCtr: 0,
            firebaseMessages: JSON.parse(localStorage.getItem("firebaseMessages")) || [],
        };
    }

    componentDidMount() {
        document.addEventListener('firebaseMessageReceived', (e) => {
            this.setState({
                firebaseMsgUnread: true,
                firebaseUnreadCtr: this.state.firebaseUnreadCtr + 1
            })
        });
    }

    reloadMessages() {
        this.setState({ firebaseMsgUnread: false, firebaseUnreadCtr: 0, firebaseMessages: JSON.parse(localStorage.getItem("firebaseMessages")) || [] })
        localStorage.setItem('firebaseMsgUnread', '0');
    }

    clearMessages() {
        localStorage.setItem("firebaseMessages", JSON.stringify([]))
        localStorage.setItem('firebaseMsgUnread', '0');
        this.setState({ firebaseMsgUnread: false, firebaseMessages: [] });
    }

    onProfileClick(e) {
        e.preventDefault();
        this.props.history.push('/profile');
    }

    render() {
        //console.log(this.props.showChangePassword);
        return (
            <Aux>
                <ul className="navbar-nav ml-auto">
                    <li>
                        {/* STUDIO_CUSTOMIZATION :: PENDING */}
                        <Dropdown alignRight={!this.props.rtlLayout} onClick={() => this.reloadMessages()}>
                            <Dropdown.Toggle variant={'link'} id="dropdown-basic" className={this.state.firebaseMsgUnread ? 'mt-1' : ''}>
                                {/* <i className="feather icon-bell icon" /> */}
                                <i className={"icon feather icon-bell" + (this.state.firebaseMsgUnread ? ' fa-2x btn-outline-danger bg-transparent' : '')} />
                                {this.state.firebaseUnreadCtr > 0 &&
                                    <span className="ml-3">{this.state.firebaseUnreadCtr}</span>
                                }
                            </Dropdown.Toggle>
                            <Dropdown.Menu alignRight className="notification">
                                <div className="noti-head">
                                    <h6 className="d-inline-block m-b-0">{'Notifications (' + this.state.firebaseMessages.length + ')'}</h6>
                                    <div className="float-right">
                                        {/* <a href={DEMO.BLANK_LINK} className="m-r-10">mark as read</a> */}
                                        <button className="btn transparent text-white"
                                            onClick={() => this.clearMessages()}>Clear all</button>
                                    </div>
                                </div>
                                <div style={{ height: '300px' }}>
                                    <PerfectScrollbar>
                                        <ul className="noti-body">
                                            {/* <li className="n-title">
                                                <p className="m-b-0">NEW</p>
                                            </li> */}
                                            {this.state.firebaseMessages.map((message, messageIndex) =>
                                                <li key={messageIndex} className="notification">
                                                    <div className="media">
                                                        {/* <img className="img-radius" src={logo} alt="Generic placeholder" /> */}
                                                        <div className="media-body">
                                                            <p>
                                                                <strong>{message.notification ? message.notification.title || '' : ''}</strong>
                                                                {message.receivedAt &&
                                                                    <span className="n-time text-muted">
                                                                        {/* <i className="icon feather icon-clock m-r-10" /> */}
                                                                        {<Timestamp relative date={message.receivedAt} />}
                                                                    </span>
                                                                }
                                                            </p>
                                                            <p>{message.notification ? message.notification.body || '' : ''}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            )}
                                        </ul>
                                    </PerfectScrollbar>
                                </div>
                                {/* <div className="noti-footer">
                                    <a href={DEMO.BLANK_LINK}>show all</a>
                                </div> */}
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                    <li>
                        {/* STUDIO_CUSTOMIZATION :: PENDING */}
                        <Dropdown alignRight={!this.props.rtlLayout} className="drp-user mr-3">
                            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                                <i className="icon feather icon-user" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu alignRight className="profile-notification">
                                <div className="pro-head">
                                    <img src={userService.getAvatar(userService.getUserId())} className="img-radius" alt=' ' />
                                    <span>{userService.getDisplayName()}</span>
                                    {/* <a href={"/signout"} className="dud-logout" title="Sign out">
                                        <i className="feather icon-log-out" />
                                    </a> */}
                                    <Link to="/signout" className="dud-logout" title="Sign out"><i className="feather icon-log-out" /></Link>
                                </div>
                                <ul className="pro-body">
                                    {/* <li><Link to="/settings" className="dropdown-item"><i className="feather icon-settings" /> Settings</Link></li> */}
                                    <li><Link to="/profile" className="dropdown-item"><i className="feather icon-user" /> Profile</Link></li>
                                    {/* <li><Link to="/changepassword" className="dropdown-item"><i className="fas fa-lock" /> Change Password</Link></li> */}
                                    <li><a href={DEMO.BLANK_LINK} className="dropdown-item" onClick={this.props.showChangePassword}><i className="fas fa-lock" /> Change Password</a></li>
                                    {/* <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i className="feather icon-mail"/> My Messages</a></li> */}
                                    {/* <li><a href={DEMO.BLANK_LINK} className="dropdown-item"><i className="feather icon-lock"/> Lock Screen</a></li> */}
                                </ul>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
            </Aux>
        );
    }
}

// const mapStateToProps = state => {
//     return {
//         firebaseMessages: state.firebaseMessages
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         showNotification: () => dispatch({ type: actionTypes.SHOW_NOTIFICATION })
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(NavRight);
export default withRouter(NavRight);
