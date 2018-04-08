// import React, {Component, PropTypes} from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router'

import Helper from '../../../../config/helper';
import { logout, gotoLogin } from '../../../actions/account';

/**
 * 退出页面
 * TODO：
 * 1. 美化
 * 2. 加定时
 */
class Logout extends Component {
    componentDidMount () {
        const { dispatch } = this.props;
        this.props.isLoggedOut || dispatch(logout());
    }

    render () {
        return (
            <div className='logout'>
                {
                    this.props.isLoggedOut ? <div>
                        <div>退出成功</div>
                        <div>跳转到<Link to='/'>首页</Link></div>
                        <div><button onClick={() => gotoLogin(Helper.siteResolve(), {relogin: true}, this.props.history)}>重新登录</button></div>
                    </div> : ''
                }
            </div>
        )
    }
}

Logout.propTypes = {
    dispatch: PropTypes.func,
    isLoggedOut: PropTypes.bool
}

const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedOut: state.account.isLoggedOut
    }
}

export default connect(mapStateToProps)(withRouter(Logout));
