// import React, { PropTypes } from 'react';
import React from 'react';
import PropTypes from 'prop-types'
import Cookies from 'js-cookie';
import {Base64} from 'js-base64';
import { withRouter } from 'react-router'
// import {browserHistory} from 'react-router';

import {connect} from 'react-redux';
import {omit, isEqual} from 'lodash';

import {
    gotoLogin,
    fetchVisitor,
    fetchVisitorSuccess
} from '../../actions/account';
import {SiteHelper} from '../../../config/helper';
import Utils from '../../utils';

const authentication = options => Component => {
    class Authentication extends React.PureComponent {
        constructor (props) {
            super(props)

            this.state = {
                isLoggedIn: !!Cookies.get('token')
            };

            this.authenticate(this.props)
        }

        componentWillReceiveProps (nextProps) {
            this.authenticate(nextProps)
        }

        shouldComponentUpdate (nextProps, nextState) {
            return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
        }

        async authenticate (props) {
            const {history}  = props;
            if (!SiteHelper.getSiteInfo().needLogin) {
                return;
            }
            let {location: {query}, dispatch} = props;
            const token = query.t || Cookies.get('token');
            let visitor = query.u || Cookies.get('visitor');
            if (token) {
                (token !== Cookies.get('token')) && Utils.setTopLevelCookie('token', token);
                try {
                    visitor = JSON.parse(Base64.decode(visitor.replace(/ /g, '+')));
                    if (visitor && !isEqual(visitor, props.visitor)) {
                        dispatch(fetchVisitorSuccess(visitor));
                    }
                } catch (e) {
                    await dispatch(fetchVisitor());
                }
                const {pathname, query} = history.getCurrentLocation();
                if (query.t || query.u) {
                    history.replace({
                        pathname: pathname,
                        query: omit(query, ['t', 'u'])
                    });
                }
            } else {
                if (options && options.gotoLogin) {
                    options.gotoLogin(null, null, history);
                } else {
                    let query = {};
                    if (props.isLoggedOut) {
                        query.relogin = true;
                    }
                    gotoLogin('', query, history);
                }
            }
            !!token !== this.state.isLoggedIn && this.setState({isLoggedIn: !!token});
        }

        render () {
            if (SiteHelper.getSiteInfo().needLogin && (!this.state.isLoggedIn || !this.props.visitor)) {
                return null
            }
            return (
                <Component {...this.props} />
            )
        }
    }

    Authentication.propTypes = {
        visitor: PropTypes.object,
        isLoggedOut: PropTypes.bool,
        location: PropTypes.object,
        dispatch: PropTypes.func
    }

    Authentication.displayName = `Authentication(${Component.displayName || Component.name})`;

    const mapStateToProps = (state, ownProps) => {
        const {visitor, isLoggedOut} = state.account;
        return {
            visitor,
            isLoggedOut
        }
    }
    return connect(mapStateToProps)(Authentication);
}

export default withRouter(authentication)
