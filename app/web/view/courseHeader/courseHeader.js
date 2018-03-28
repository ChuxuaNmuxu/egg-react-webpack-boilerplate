import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';

import styles from './courseHeader.scss';
import CourseUpload from '../courseUpload/courseUpload';
import imgAvatar from '../../public/images/avatar_40.png';
import config from '../../../config';
import { logout } from '../../actions/account';
import imgLogo from '../../public/images/logo_44.png';
const Item = Menu.Item;
const SubMenu = Menu.SubMenu;

class CourseHeader extends Component {
    constructor (props) {
        super(props);

        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    logout () {
        const { dispatch } = this.props;
        dispatch(logout());
    }

    handleMenuClick () {
        // 退出登录的执行方法
        this.logout();
    }

    render () {
        return (
            <div className='courseHeader' styleName='courseHeader'>
                <div className='home-nav course-nav'>
                    <div className='ui container home-nav-wrapper '>
                        <div className='logo'>
                            <Link to='/'>
                                <img src={imgLogo} alt='logo' />
                                <span>e采云备课平台</span>
                            </Link>
                        </div>
                        <Menu mode='horizontal' defaultSelectedKeys={['.$1']} style={{ lineHeight: '64px', float: 'left' }}>
                            <Item key='1'>课件库</Item>
                        </Menu>
                        <Menu mode='horizontal' className='profile' style={{ lineHeight: '64px', float: 'right' }}>
                            <SubMenu
                              title={<div className='avatar'>
                                  <img src={imgAvatar} />
                                  <Icon type='caret-down' />
                              </div>}>
                                <Item key='1' className='item'>
                                    <a href={config.siteResolve('cjyun', 'profile')} target='_blank'><Icon type='solution' />个人中心</a>
                                </Item>
                                <Item key='2' className='item'>
                                    <a href={config.siteResolve('cjyun', 'profile/changePassword')} target='_blank'><Icon type='edit' />修改密码</a>
                                </Item>
                                <Item key='3' className='item'>
                                    <a href='#' onClick={this.handleMenuClick}><Icon type='poweroff' />退　出</a>
                                </Item>
                            </SubMenu>

                            <Item key='2'><div className='avatar'> <CourseUpload /></div></Item>

                        </Menu>
                    </div>
                </div>
            </div>
        )
    }
}
CourseHeader.propTypes = {
    dispatch: PropTypes.func,
    visitor: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
    return {
        visitor: state.account.visitor
    }
}

export default connect(mapStateToProps)(CSSModules(CourseHeader, styles));
