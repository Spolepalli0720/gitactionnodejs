import React, { Component } from "react";
import { Row, Col, Card, CardHeader, CardBody, CardFooter } from 'reactstrap';

import { BasicSpinner } from "../utils/BasicSpinner";
import { userService } from "../services/UserService";
import { inputField } from '../utils/StudioUtils';

import './ShareSolution.scss'
export default class ShareSolution extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            notifyUsers: false,
            notifyMessage: '',
            users: [],
            sharedUsers: {},
            selectedUsers: {},
        };
    }

    componentDidMount() {
        const { sharedUsers } = this.state;
        const parent = this;
        (this.props.users || []).forEach(arrayItem => {
            sharedUsers[arrayItem.username] = arrayItem.role;
        })
        let loginUserName = userService.getLoginName();
        userService.getUsers().then(response => {
            let users = response;
            users.forEach(function (user) {
                user.displayName = (user.firstName || user.lastName) ? ((user.firstName || '') + ' ' + (user.lastName || '')).trim()
                    : user.username.split('@')[0];
            })
            users = response.filter(user => user.verified && user.username !== loginUserName).sort((a, b) => a.displayName.localeCompare(b.displayName));
            this.setState({ loading: false, sharedUsers: sharedUsers, users: users });
        }).catch(error => {
            parent.setState({ loading: false, sharedUsers: sharedUsers });
        });
    }

    onChangeInput(name, value) {
        this.setState({ [name]: value })
    }

    addSharedUser(name, value) {
        const { selectedUsers } = this.state;
        selectedUsers[value] = 'Viewer';
        this.setState({ selectedUsers: selectedUsers });
    }

    onChangeRole(username, shareGroup, value) {
        const { sharedUsers, selectedUsers } = this.state;

        if (shareGroup === 'sharedUser') {
            sharedUsers[username] = value;
        } else if (shareGroup === 'selectedUser') {
            selectedUsers[username] = value;
        }
        this.setState({ sharedUsers: sharedUsers, selectedUsers: selectedUsers });
    }

    removeShare(username, shareGroup) {
        const { sharedUsers, selectedUsers } = this.state;

        if (shareGroup === 'sharedUser') {
            delete sharedUsers[username];
        } else if (shareGroup === 'selectedUser') {
            delete selectedUsers[username];
        }
        this.setState({ sharedUsers: sharedUsers, selectedUsers: selectedUsers });
    }

    saveChanges() {
        const { users, sharedUsers, selectedUsers, notifyUsers, notifyMessage } = this.state;
        let updatedUsers = users.filter(user => sharedUsers[user.username] !== undefined)
        updatedUsers = updatedUsers.concat(users.filter(user => selectedUsers[user.username] !== undefined));
        updatedUsers = updatedUsers.map(user => (
            { userId: user.id, username: user.username, role: sharedUsers[user.username] || selectedUsers[user.username] }
        ));

        let payload = {
            users: updatedUsers,
            notify: notifyUsers || false,
            message: notifyMessage || "",
        }

        if (this.props.onSave) {
            this.props.onSave(payload)
        }
    }

    renderUser(user, shareGroup) {
        const { sharedUsers, selectedUsers } = this.state;
        let roles = [
            { value: 'Viewer', label: 'Viewer' },
            { value: 'Commentor', label: 'Commentor' },
            { value: 'Editor', label: 'Editor' }
        ]

        return (
            <Row>
                <Col sm='auto' className='pl-4 pr-0'>
                    <img className='share-avatar' src={userService.getAvatar(user.id)} alt=' ' />
                </Col>
                <Col>
                    <Row xs='1' md='1'>
                        <Col>
                            {user.displayName}
                        </Col>
                        <Col className='text-muted small'>{user.username}</Col>
                    </Row>
                </Col>
                {shareGroup &&
                    <Col sm='auto'>
                        {shareGroup &&
                            <i className='mt-1 ml-0 mr-3 feather icon-x-circle text-danger btn p-0 content-float-right'
                                onClick={() => { this.removeShare(user.username, shareGroup) }} />
                        }
                        {inputField('select', shareGroup, '',
                            shareGroup === 'sharedUser' ? sharedUsers[user.username] : selectedUsers[user.username],
                            this.onChangeRole.bind(this, user.username), { container: 'content-float-right', input: 'w-auto content-border-none text-right' }, roles)
                        }
                    </Col>
                }
            </Row>
        )
    }

    render() {
        const { loading, users, sharedUsers, selectedUsers } = this.state;

        let availableUsers = users.filter(user => sharedUsers[user.username] === undefined)
            .filter(user => selectedUsers[user.username] === undefined).map(user => (
                { value: user.username, label: this.renderUser(user) }
            ));

        return (
            <div>
                {loading &&
                    <Card className='mb-1'>
                        <CardBody>
                            <BasicSpinner />
                        </CardBody>
                    </Card>
                }
                {!loading &&
                    <Card className='studio-card'>
                        <CardHeader className='pb-1'>
                            <Row>
                                <Col>{inputField('select', 'selectedUser', '', '',
                                    this.addSharedUser.bind(this), { selectSearchable: true }, availableUsers)}
                                </Col>
                            </Row>
                        </CardHeader>
                        {Object.keys(selectedUsers).length > 0 &&
                            <CardBody className='pb-1'>
                                <div className='font-weight-bold mb-1'>Selected Users ({Object.keys(selectedUsers).length})</div>
                                <div className='share-selected mb-1'>
                                    {users.filter(user => selectedUsers[user.username] !== undefined).map((user, userIndex) =>
                                        <div key={userIndex} className='mb-2'>{this.renderUser(user, 'selectedUser')}</div>
                                    )}
                                </div>
                                <Row>
                                    <Col xs='auto' className='pr-0' >{inputField('checkbox', 'notifyUsers', 'Notify Users', this.state.notifyUsers,
                                        this.onChangeInput.bind(this), { label: 'ml-1 w-auto' })}</Col>
                                    <Col>{inputField('text', 'notifyMessage', '', this.state.notifyMessage,
                                        this.onChangeInput.bind(this), { container: 'mb-0', label: 'ml-2' })}</Col>
                                </Row>
                            </CardBody>
                        }
                        <CardFooter>
                            {Object.keys(sharedUsers).length === 0 && Object.keys(selectedUsers).length === 0 &&
                                <div className='share-users mb-2'></div>
                            }
                            {Object.keys(sharedUsers).length > 0 &&
                                <div className='font-weight-bold mb-1'>Shared Users ({Object.keys(sharedUsers).length})</div>
                            }
                            {Object.keys(sharedUsers).length > 0 &&
                                <div className='share-users mb-2'>
                                    {users.filter(user => sharedUsers[user.username] !== undefined).map((user, userIndex) =>
                                        <div key={userIndex} className='mb-2'>{this.renderUser(user, 'sharedUser')}</div>
                                    )}
                                </div>
                            }
                            <div>
                                <button className='btn-sm btn-round btn-primary pl-3 pr-3 br-5x content-float-right'
                                    onClick={() => { this.saveChanges() }} >Done</button>
                            </div>
                        </CardFooter>
                    </Card>
                }

            </div>
        )
    }
}