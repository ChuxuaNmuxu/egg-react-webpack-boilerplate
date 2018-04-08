// import React, {Component, PropTypes} from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { browserHistory } from 'react-router';
import { Spin } from 'antd';
import CSSModules from 'react-css-modules';

import styles from './login.scss';
import authentication from '../../../components/Auth/authentication'

@authentication
class Login extends Component {
    componentDidMount () {
        this.checkDirect();
    }

    checkDirect () {
        const {url} = this.props.location.query;
        const {history} = this.props;

        let directUrl = url || '/';
        history.push(directUrl);
    }

    render () {
        return (
            <div className='login' styleName='login'>
                <Spin size='large' className='login-spin' loading />
            </div>
        )
    }
}

Login.propTypes = {
    location: PropTypes.object
}

export default connect()(CSSModules(Login, styles));
