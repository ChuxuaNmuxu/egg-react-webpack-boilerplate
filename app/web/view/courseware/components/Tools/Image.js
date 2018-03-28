import React from 'react';
import {connect} from 'react-redux';
import {fromJS} from 'immutable';
import PropTypes from 'prop-types';

import UploadImage from '../UploadImage';
import {addBlock} from '../../../../actions/courseware';
import * as courseEntryActions from '../../../../actions/courseEntry';

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
        return <div className='fl tool-btn image' onClick={this.handleClick} >
            <div className='tools-icon img-icon' data-type='image'><i className='iconfont icon-tupian' /></div>
            <div className='tools-title' data-type='image'>图片</div>

            <UploadImage
              handleVisible={this.handleClick}
              visible={this.state.modelVisible}
              addBlock={this.props.addBlock}
              uploadGetParams={this.props.getUploadParams}
            />
        </div>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addBlock: (width, height, imgUrl) => {
            dispatch(addBlock(fromJS({
                blockType: 'image',
                width,
                height,
                imgUrl
            })))
        },
        getUploadParams: () => dispatch(courseEntryActions.uploadGetParams())

    }
}

Shape.propTypes = {
    addBlock: PropTypes.func,
    getUploadParams: PropTypes.func
}

export default connect(null, mapDispatchToProps)(Shape);
