import React from 'react';
import {connect} from 'react-redux';
import {fromJS} from 'immutable';
import PropTypes from 'prop-types';

import ShapeSelector from './ShapeSelector';
import {addBlock} from '../../../../actions/courseware';

class Shape extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            modelVisible: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick () {
        this.setState({
            modelVisible: !this.state.modelVisible
        })
    }

    render () {
        return <div className='fl tool-btn shape' onClick={this.handleClick} >
            <div className='tools-icon shape-icon' data-type='shape'><i className='iconfont icon-liubianxing' /></div>
            <div className='tools-title'>形状</div>
            <ShapeSelector handleVisible={this.handleClick} visible={this.state.modelVisible} addBlock={this.props.addBlock} />
        </div>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addBlock: (shape) => {
            dispatch(addBlock(fromJS({
                blockType: 'shape',
                shapeType: shape
            })))
        }
    }
}

Shape.propTypes = {
    addBlock: PropTypes.func
}

export default connect(null, mapDispatchToProps)(Shape);
