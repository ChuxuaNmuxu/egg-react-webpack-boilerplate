import React from 'react';
import {fromJS} from 'immutable';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {addBlock} from '../../../../actions/courseware';

class Text extends React.Component {
    render () {
        return <div className='fl tool-btn text' onClick={() => { this.props.addBlock('text') }}>
            <div className='tools-icon text-icon' data-type='text'><i className='iconfont icon-wenben' /></div>
            <div className='tools-title' data-type='text'>文本框</div>
        </div>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addBlock: (blockType) => {
            dispatch(addBlock(fromJS({
                blockType
            })))
        }
    }
}

Text.propTypes = {
    addBlock: PropTypes.func
}

export default connect(null, mapDispatchToProps)(Text);
