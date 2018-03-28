import React from 'react';
import {Tabs} from 'antd';
import CSSModules from 'react-css-modules';

import styles from './Navbar.scss';
import TeachingLink from './TeachingLink';
import Exercise from './Exercise';
import FlexBtn from '../Bottons/FlexBtn';
import PropTypes from 'prop-types';

/**
 * 导航栏
 */
class Navbar extends React.Component {
    constructor (props) {
        super(props);
        this.layoutChange = this.layoutChange.bind(this);
    }
    handleTabChange (key) {
        //
    }

    layoutChange (state) {
        this.props.layoutChange({
            leftBar: `left-${state}`
        })
    }

    render () {
        return (
            <div className='navbar' styleName='navbar'>
                <FlexBtn onChange={this.layoutChange} />
                <Tabs defaultActiveKey='.$1' type='card' onChange={this.handleTabChange}>
                    <Tabs.TabPane tab='卡片' key='1'>
                        <TeachingLink />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab='练习' key='2'>
                        <Exercise />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        )
    }
}

Navbar.propTypes = {
    layoutChange: PropTypes.func
}

export default CSSModules(Navbar, styles);
