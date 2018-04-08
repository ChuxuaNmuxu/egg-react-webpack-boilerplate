// import React, { PropTypes } from 'react';
import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import styles from './loginPage.scss';

import Login from './login';

const LoginPage = (props) => {
    return (
        <div className='login-page' styleName='login-page'>
            <div className='login-area'><Login location={props.location} /></div>
        </div>
    )
};

LoginPage.propTypes = {
    location: PropTypes.object
}

export default connect()(CSSModules(LoginPage, styles));
