import React, {Component} from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './test.scss';

class Test extends Component {
    render () {
        console.log(10)
        let aaaa = '11111111';
        let bbbb = aaaa + '222222';
        alert(bbbb);
        return (
            <div className='test' styleName='test'>
                aaa1111221122112222222
            </div>
        )
    }
}

export default connect()(CSSModules(Test, styles));
