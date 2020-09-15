import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// import config from '../../../../config';
import menuStudio from '../../../../menu-studio';
import menuSolutions from '../../../../menu-solutions';
import menuEnvironments from '../../../../menu-environments';
import DEMO from "../../../../store/constant";
import Aux from "../../../../hoc/_Aux";

class Breadcrumb extends Component {
    state = {
        main: [],
        item: []
    };

    componentDidMount() {
        // STUDIO_CUSTOMIZATION
        const navigation = document.location.pathname.startsWith('/solutions/') ?
            menuSolutions
            :
            document.location.pathname.startsWith('/environments/') ?
                menuEnvironments
                :
                menuStudio;

        navigation.items.map(item => {
            if (item.type && item.type === 'group') {
                this.getCollapse(item);
            }
            return false;
        });
    };

    UNSAFE_componentWillReceiveProps = () => {
        // STUDIO_CUSTOMIZATION
        const navigation = document.location.pathname.startsWith('/solutions/') ?
            menuSolutions
            :
            document.location.pathname.startsWith('/environments/') ?
                menuEnvironments
                :
                menuStudio;

        navigation.items.map(item => {
            if (item.type && item.type === 'group') {
                this.getCollapse(item);
            }
            return false;
        });
    };

    getCollapse = (item) => {
        if (item.children) {
            item.children.filter(collapse => {
                if (collapse.type && collapse.type === 'collapse') {
                    this.getCollapse(collapse);
                } else if (collapse.type && collapse.type === 'item') {
                    // STUDIO_CUSTOMIZATION
                    // if (document.location.pathname === config.basename + collapse.url)
                    let itemURL = collapse.url.split('/');
                    itemURL.forEach((pathItem, pathIndex) => {
                        if (pathItem.startsWith(':')) {
                            itemURL[pathIndex] = document.location.pathname.split('/')[pathIndex]
                        }
                    })
                    if (document.location.pathname === itemURL.join('/')) {
                        this.setState({ item: collapse, main: item });
                    }
                }
                return false;
            });
        }
    };

    render() {
        let main, item;
        let breadcrumb = '';
        let title = 'Welcome';
        // STUDIO_CUSTOMIZATION
        if (this.state.main && (this.state.main.type === 'collapse' || document.location.pathname.split('/')[2])) {
            main = (
                <li className="breadcrumb-item">
                    {/* STUDIO_CUSTOMIZATION */}
                    <a href={this.state.main.url || DEMO.BLANK_LINK}>{this.state.main.title}</a>
                </li>
            );
        }

        if (this.state.item && this.state.item.type === 'item') {
            title = this.state.item.title;
            item = (
                <li className="breadcrumb-item">
                    <a href={DEMO.BLANK_LINK}>{title}</a>
                </li>
            );

            if (this.state.item.breadcrumbs !== false) {
                breadcrumb = (
                    <div className="page-header">
                        <div className="page-block">
                            <div className="row align-items-center">
                                <div className="col-md-12">
                                    {/* STUDIO_CUSTOMIZATION */}
                                    {/* <div className="page-header-title">
                                        <h5 className="m-b-10">{title}</h5>
                                    </div> */}
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link to="/home"><i className="feather icon-home" /></Link>
                                        </li>
                                        {main}
                                        {item}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }

        // STUDIO_CUSTOMIZATION
        // document.title = title + ' | Able Pro Premium React + Redux Admin Template';
        document.title = `DigitalDots Studio`;

        return (
            <Aux>
                {breadcrumb}
            </Aux>
        );
    }
}

export default Breadcrumb;
