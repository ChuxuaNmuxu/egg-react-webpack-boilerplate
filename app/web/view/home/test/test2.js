import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import {indexOf} from 'lodash';

import styles from './test.scss';

class Test2 extends Component {
    render () {
        console.log(indexOf(['a', 'b'], 'b'))
        return (
            <div className='test' styleName='test'>
                <h1>{this.props.title}</h1>
                aaa
            </div>
        )
    }
}

Test2.propTypes = {
    title: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
    return {
        title: state.test.title
    }
}

export default connect(mapStateToProps)(CSSModules(Test2, styles));
