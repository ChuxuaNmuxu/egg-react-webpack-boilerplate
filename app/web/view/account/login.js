// import React, {Component, PropTypes} from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import url from 'url';
import Cookies from 'js-cookie';

import Login from '../../components/Login';
import styles from './login.scss';

import { login as loginAction, loginRedirect, logout } from '../../actions/account';
window.url = url;

class LoginPage extends Component {
    constructor (props) {
        super(props);

        this.onLogin = this.onLogin.bind(this);
        this.onRedirect = this.onRedirect.bind(this);
    }

    componentWillMount () {
        const {location, dispatch} = this.props;
        const token = Cookies.get('token');
        const relogin = location && location.query.relogin;
        relogin && token && dispatch(logout(true));
        relogin || (token && this.onRedirect());
    }

    componentWillReceiveProps (nextProps) {
        Cookies.get('token') && this.onRedirect();
    }

    onLogin (loginInfo) {
        const {dispatch} = this.props;
        dispatch(loginAction(loginInfo));
    }

    onRedirect () {
        const {dispatch, location} = this.props;
        return dispatch(loginRedirect(location && location.query && location.query.url));
    }

    render () {
        const {error} = this.props;
        return (
            <div>
                <Login onLogin={this.onLogin} error={error && error.data} visible={this.props.visible} />
            </div>
        )
    }
}

LoginPage.propTypes = {
    dispatch: PropTypes.func,
    location: PropTypes.object,
    error: PropTypes.any,
    visible: PropTypes.bool
}

const mapStateToProps = (state, ownProps) => {
    const {visitor, error} = state.account;
    return {
        visitor,
        error
    };
}

export default connect(mapStateToProps)(CSSModules(LoginPage, styles));
