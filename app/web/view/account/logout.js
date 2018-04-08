// import React, {Component, PropTypes} from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import { logout } from '../../actions/account';

class Logout extends Component {
    componentDidMount () {
        const { dispatch } = this.props;
        dispatch(logout());
        browserHistory.push('/');
    }

    render () {
        return (
            <div className='logout' />
        )
    }
}

Logout.propTypes = {
    dispatch: PropTypes.func
}

export default connect()(Logout);
