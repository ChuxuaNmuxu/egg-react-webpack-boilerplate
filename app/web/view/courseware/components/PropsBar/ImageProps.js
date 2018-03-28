import React, {Component} from 'react';
import {Col, Button} from 'antd';
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import {connect} from 'react-redux';

import {changeBlockImage} from '../../../../actions/courseware';
import * as courseEntryActions from '../../../../actions/courseEntry';
import UploadImage from '../UploadImage'

class ImageProps extends Component {
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
        return <div>
            <Col span='12' style={{paddingTop: '12px'}}>
                <Button onClick={this.handleClick}>更换图片</Button>
                <UploadImage
                  handleVisible={this.handleClick}
                  visible={this.state.modelVisible}
                  addBlock={this.props.addBlock}
                  uploadGetParams={this.props.getUploadParams}
                />
            </Col>
        </div>
    }
}

ImageProps.propTypes = {
    addBlock: PropTypes.func,
    getUploadParams: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
    return {
        addBlock: (width, height, imgUrl) => {
            dispatch(changeBlockImage(Map({
                imgUrl,
                width,
                height
            })))
        },
        getUploadParams: () => dispatch(courseEntryActions.uploadGetParams())

    }
}

export default connect(null, mapDispatchToProps)(ImageProps);
