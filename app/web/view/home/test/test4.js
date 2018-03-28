import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {map} from 'lodash';

class Test4 extends Component {
    render () {
        return (
            <div className='test' styleName='test'>
                <h1>{this.props.title}</h1>
                test4
                <div>
                    {map([1, 2, 3, 4, 5], item => <div>{item}</div>)}
                </div>
            </div>
        )
    }
}

Test4.propTypes = {
    title: PropTypes.string
}

const mapStateToProps = (state, ownProps) => {
    return {
        title: state.test.title
    }
}

export default connect(mapStateToProps)(Test4);
