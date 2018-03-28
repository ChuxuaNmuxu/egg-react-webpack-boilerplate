/**
 * 向插入图片工具组件注入操作逻辑
 * @author Ouyang
 * */
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import * as CourseWare from '../../../../actions/courseware';
import * as CourseWareEntry from '../../../../actions/courseEntry';
import ImageComponent from './Image';

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addBlock: (width, height, imgUrl) => dispatch(CourseWare.addBlock(
            fromJS({
                blockType: 'image',
                width,
                height,
                imgUrl
            })
        )),
        getUploadParams: () => dispatch(CourseWareEntry.uploadGetParams())
    };
}

export default connect(null, mapDispatchToProps)(ImageComponent);
