import React from 'react';
import Avatar from 'react-avatar';
import { Card,CardBody,Row,Col } from 'reactstrap';
import './user-management.scss';


class ProfileSummary extends React.Component {

    uploadImage = () => {
        document.getElementById('uploadimage').click();
    }

    render() {
        const { firstName, lastName, email, imageUrl, handleFileChange, profileDetails } = this.props.profileData;
        return (
            <Card className="custom-top">
                <CardBody className="p-0 mt-2">
                    <Row xs="1" md="1">
                        <Col>
                            <div className="text-center">
                                <input className="hidden" type="file" accept="image/*" onChange={handleFileChange} id="uploadimage" />
                                {imageUrl ?
                                    <img src={imageUrl} className="profilephoto" alt=""/>
                                    :
                                    <Avatar value={!firstName && !lastName ? ' ' : `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`.toUpperCase()} size={120} round={true} />
                                }
                                <span className={`profile-camera fa fa-camera`} onClick={this.uploadImage}></span>
                            </div>
                        </Col>
                    </Row>
                    <Row xs="1" md="1">
                        <Col className="pb-0">
                            <h5 className="text-center mt-1 mb-0">{`${firstName} ${lastName}`}</h5>
                        </Col>
                        <Col className="pt-0">
                            <p className="text-muted mt-0 text-center">{email}</p>
                        </Col>
                    </Row>
                    <Row xs="1" md="1">
                        <Col>
                            <ul className="mt-1 mb-5 custom-ul">
                               {profileDetails.map((profileDetail) => <li key={profileDetail.title} className="custom-li">{profileDetail.title}<span className="float-right">{profileDetail.count}</span></li>)}
                            </ul>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}

export default ProfileSummary;