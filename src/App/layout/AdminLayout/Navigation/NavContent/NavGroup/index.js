import React from 'react';
import Aux from "../../../../../../hoc/_Aux";
import NavCollapse from './../NavCollapse';
import NavItem from './../NavItem';
import { userService } from "../../../../../../studio/services/UserService";

const navGroup = (props) => {
    let navItems = '';
    if (props.group.children) {
        // STUDIO_CUSTOMIZATION :: Filter Menu Items based on User Role
        // const groups = props.group.children;
        const access_routes = userService.getAccessRoutes().map((route) => route.id);
        const groups = props.group.children.filter(function (childItem) { return access_routes.indexOf(childItem.id) >= 0 });

        navItems = Object.keys(groups).map(item => {
            item = groups[item];
            switch (item.type) {
                case 'collapse':
                    return <NavCollapse key={item.id} collapse={item} type="main" />;
                case 'item':
                    return <NavItem layout={props.layout} key={item.id} item={item} />;
                default:
                    return false;
            }
        });
    }

    let childItemBack = props.group.children.filter(function (childItem) { return childItem.title === 'Back' });
    let groupBackItem;
    if (childItemBack.length > 0) {
        groupBackItem = JSON.parse(JSON.stringify(childItemBack[0]));
        groupBackItem.title = props.group.title;
    }

    let propsGroupTitle = props.group.title;
    try {
        const dashboard_toggler = document.getElementById('mobile-collapse1');
        if (dashboard_toggler && 'mobile-menu on' === dashboard_toggler.className) {
            propsGroupTitle = propsGroupTitle.split(' ')[1]
        }
    } catch (error) {
        console.error(error);
    }

    return (
        <Aux>
            {/* STUDIO_CUSTOMIZATION */}
            {groupBackItem && 'L1' !== props.group.id ?
                <NavItem item={groupBackItem} />
            :
                <li key={props.group.id} className="nav-item pcoded-menu-caption">
                    <span className="pcoded-mtext">{propsGroupTitle}</span>
                </li>
            }
            {/* <li key={props.group.id} className="nav-item pcoded-menu-caption"><label>{props.group.title}</label></li> */}
            {navItems}
        </Aux>
    );
};

export default navGroup;