/**
 * 向插入文本工具注入操作逻辑
 * @author Ouyang
 * */
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import * as CourseWare from '../../../../actions/courseware';
import TextComponent from './Text';

const mapDispatchToProps = (dispatch) => {
    return {
        addBlock: () => dispatch(CourseWare.addBlock(
            fromJS({
                blockType: 'text'
            }))
        )
    };
}

export default connect(null, mapDispatchToProps)(TextComponent);
