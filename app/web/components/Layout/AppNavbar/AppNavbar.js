import React from 'react';
import {PropTypes} from 'prop-types';
import CSSModules from 'react-css-modules';
import {Menu} from 'antd';
import {filter} from 'lodash';

import config from '../../../../config';
import Helper, {SiteHelper} from '../../../../config/helper';
import styles from './AppNavbar.scss';

/**
 * 程序通用顶部导航
 */
export const AppNavbar = (props) => {
    const { visitor, logout, fullscreen } = props;
    const currentSite = SiteHelper.getSiteInfo();
    const siteList = filter(
        config.site,
        site => ['cjyun', currentSite.name.toLowerCase()].indexOf(site.name.toLowerCase()) === -1
    );
    return (
        <div className='app-navbar' styleName='app-navbar'>
            <div className={'navbar-wrapper' + (fullscreen ? '' : ' ui container')}>
                <div className='navbar-header'>
                    <a className='navbar-brand' target='_blank' href={config.siteResolve('cjyun')}>采集云首页</a>
                </div>
                <div className='navbar-nav navbar-right'>
                    <Menu mode='horizontal'>
                        {
                            siteList.map(site => {
                                site = SiteHelper.getSiteInfo(site);
                                return <Menu.Item key={site.name}>
                                    <a href={Helper.siteResolve(site.name)} target='_blank'>{site.short_title}</a>
                                </Menu.Item>
                            })
                        }
                        <Menu.SubMenu key='user' title={<div><i className='iconfont icon-renwuxiaotubiao primary-color' /> <span>{visitor ? visitor.realName : '-'}</span>&nbsp;&nbsp;&nbsp;<i className='iconfont icon-xiaojiantouxia' /></div>}>
                            <Menu.Item key='1'>
                                <a href={Helper.siteResolve('cjyun', 'profile/changePassword')} target='_blank'>修改密码</a>
                            </Menu.Item>
                            <Menu.Item key='2'>
                                <a href={Helper.siteResolve('cjyun', 'profile')} target='_blank'>个人中心</a>
                            </Menu.Item>
                            <Menu.Item key='3'>
                                <a onClick={logout}>退出登录</a>
                            </Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </div>
                <div className='clearfix' />
            </div>
        </div>
    )
}

AppNavbar.propTypes = {
    visitor: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    fullscreen: PropTypes.bool
}

AppNavbar.defaultProps = {
    fullscreen: false
};

export default CSSModules(AppNavbar, styles);
