// import React, { PropTypes } from 'react';
import React from 'react';
import PropTypes from 'prop-types'
import {Menu} from 'antd';

import config from '../../../../config';
import logoYun from '../../../public/images/logo-yun.png';

const Header = (props) => {
    return (
        <div className='home-header'>
            <div className='home-ceiling'>
                <div className='ui container home-ceiling-wrapper'>
                    <div className='yun-logo'>
                        <a href={config.siteResolve('cjyun')} target='_blank'><img src={logoYun} alt='logo' /></a>
                    </div>
                    <Menu mode='horizontal' className='right'>
                        <Menu.Item key='cjyun'>
                            <a href={config.siteResolve('cjyun')} target='_blank'>{config.site.cjyun.title}</a>
                        </Menu.Item>
                        <Menu.Item key='cjcms' >
                            <a href={config.siteResolve('cjcms')} target='_blank'>{config.site.cjcms.title}</a>
                        </Menu.Item>
                        <Menu.Item key='cjhms' >
                            <a href={config.siteResolve('cjhms')} target='_blank'>{config.site.cjhms.title}</a>
                        </Menu.Item>
                        <Menu.Item key='cjtlis'>
                            <a href={config.siteResolve('cjtlis')} target='_blank'>{config.site.cjtlis.title}</a>
                        </Menu.Item>
                    </Menu>
                </div>
            </div>
        </div>
    );
};

Header.propTypes = {
    visitor: PropTypes.object
}

export default Header;
