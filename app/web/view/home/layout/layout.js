// import React, {Component, PropTypes} from 'react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';import {connect} from 'react-redux';
import CourseHeader from '../../courseHeader/courseHeader'
import CommonFooter from '../../footer/footer'
import { Affix } from 'antd';
import Header from './Header';
import CSSModules from 'react-css-modules';
import styles from './layout.scss';

class Layout extends Component {
    static propTypes = {
        children: PropTypes.node
    }

    render () {
        const children = this.props.children;
        return (
            <div className='home-layout' styleName='home-layout'>
                <Affix>
                    <div style={{backgroundColor: '#151B25', color: '#778497', fontSize: '14px'}}>
                        <Header />
                    </div>
                    <header style={{backgroundColor: '#F2F2F2'}}>
                        <CourseHeader />
                    </header>
                </Affix>
                <main>
                    <div>
                        {children}
                    </div>
                </main>
                <CommonFooter />
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        visitor: state.account.visitor
    }
}

export default connect(mapStateToProps)(CSSModules(Layout, styles));
