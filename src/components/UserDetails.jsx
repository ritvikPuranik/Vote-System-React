import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

const UserDetails = (props) =>{
    return (<Container className="text-center">
                <h3>Hello, {props.account}</h3>
                <p>Your Funding for this campaign: {props.userFunds} ether</p>
            </Container>);

}

export default UserDetails;