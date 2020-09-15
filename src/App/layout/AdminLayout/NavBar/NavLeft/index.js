import React, { Component } from 'react';
import { connect } from 'react-redux';
import windowSize from 'react-window-size';
import { Modal } from 'reactstrap';

import NavSearch from './NavSearch';
import Aux from "../../../../../hoc/_Aux";
import * as actionTypes from "../../../../../store/actions";
import DEMO from "../../../../../store/constant";

import About from '../../../../../studio/home/About';

class NavLeft extends Component {
    state = {
        showAboutModal: false
    }

    render() {
        const toggleAboutModal = () => this.setState({ showAboutModal: false });
        return (
            <Aux>
                <ul className="navbar-nav mr-auto">
                    {/* STUDIO_CUSTOMIZATION */}
                    <li className="nav-item">
                        <a href={DEMO.BLANK_LINK} onClick={() => this.setState({ showAboutModal: true })}>
                            <i className="fas fa-info-circle mr-3" />
                        </a>
                    </li>
                    <li className="nav-item"><NavSearch /></li>
                </ul>
                <Modal centered size={'xl'} isOpen={this.state.showAboutModal} toggle={toggleAboutModal}>
                    <About />
                </Modal>
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        isFullScreen: state.isFullScreen,
        rtlLayout: state.rtlLayout
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFullScreen: () => dispatch({ type: actionTypes.FULL_SCREEN }),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(NavLeft));
