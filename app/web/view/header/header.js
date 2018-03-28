import React, {Component} from 'react';
import { PropTypes } from 'prop-types';
import {Menu} from 'antd';
import { logout } from '../../actions/account';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import config from '../../../config';
import styles from './header.scss';
const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

class Header extends Component {
    constructor (props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout () {
        const { dispatch } = this.props;
        dispatch(logout());
    }

    render () {
        const { visitor } = this.props;
        return (
            <div className='home-header' styleName='home-header'>
                <div className='home-ceiling'>
                    <div className='ui container home-ceiling-wrapper'>
                        <div className='yun-logo'>
                            <a href={config.siteResolve('cjyun')} target='_blank' className='header-text'>采集云首页</a>
                        </div>
                        <Menu mode='horizontal' className='right'>
                            <Menu.Item key='cjhms' >
                                <a className='header-text' href={config.siteResolve('cjhms')} target='_blank'>{config.site['cjhms'].short_title}</a>
                                <span className='line-border' />
                            </Menu.Item>
                            <Menu.Item key='cjcms' className='role1'>
                                <a className='header-text' href={config.siteResolve('cjcms')} target='_blank'>{config.site['cjcms'].short_title}</a>
                                <span className='line-border' />
                            </Menu.Item>
                            <Menu.Item key='cjtlis'>
                                <a className='header-text' href={config.siteResolve('cjtlis')} target='_blank'>{config.site['cjtlis'].short_title}</a>
                            </Menu.Item>
                            <SubMenu title={<div className='text-SubMenu'><i className='iconfont icon-people' /><span className='name-SubMenu'>{visitor ? visitor.realName + '老师' : '-'}</span><i className='iconfont icon-xiaojiantouxia' /></div>}>
                                <Item key='1'>
                                    <a href={config.siteResolve('cjyun', 'profile/changePassword')} target='_blank'>修改密码</a>
                                </Item>
                                <Item key='2'>
                                    <a href={config.siteResolve('cjyun', 'profile')} target='_blank'>个人中心</a>
                                </Item>
                                <Item key='3'>
                                    <a href='###' onClick={this.logout}>退　出</a>
                                </Item>
                            </SubMenu>
                        </Menu>
                    </div>
                </div>
            </div>
        )
    }
}

Header.propTypes = {
    visitor: PropTypes.object,
    isPC: PropTypes.bool,
    dispatch: PropTypes.func
}

const select = (store) => {
    const { account } = store;
    return {
        visitor: account.visitor,
        isPC: account.isPC
    }
}
export default connect(select)(CSSModules(Header, styles));
