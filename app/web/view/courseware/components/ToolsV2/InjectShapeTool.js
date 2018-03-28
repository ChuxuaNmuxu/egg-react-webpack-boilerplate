/**
 * 向插入形状工具注入操作逻辑
 * @author Ouyang
 * */
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import * as CourseWare from '../../../../actions/courseware';
import ShapeComponent from './Shape';

const mapDispatchToProps = (dispatch) => {
    return {
        addBlock: (shape) => dispatch(CourseWare.addBlock(
            fromJS({
                blockType: 'shape',
                shapeType: shape
            })
        ))
    };
};

export default connect(null, mapDispatchToProps)(ShapeComponent);
