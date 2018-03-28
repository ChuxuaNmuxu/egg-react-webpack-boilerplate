import React from 'react';
import PropTypes from 'prop-types';
import {Card, Icon} from 'antd';
import {connect} from 'react-redux';
import {Map} from 'immutable'

import {
    activateBlock,
    saveQuestionContent
} from '../../../../../actions/courseware';
import Block from '../../PlainBlock/Block';
import {queryBlockById, updateBlocks} from '../../../../../reducers/courseware/helper';
import {QUESTION_SAVE_MODE} from '../../../config/constant';

const saveQutionHTML = QUESTION_SAVE_MODE === 'HTML';

class QuestionItem extends React.Component {
    constructor (props) {
        super(props);
        this.renderTitle = this.renderTitle.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    renderTitle () {
        const {questionIndex, data, showSplitTag, handleSplitTagClick} = this.props;
        return <div className='question-title'>
            第{questionIndex + 1}题 ({data.get('name') || '单选题'})
            {
                showSplitTag && <div className='split-tag'>
                    <a href='###' onClick={handleSplitTagClick}><i className='iconfont icon-link' /></a>
                </div>
            }
        </div>;
    }

    handleClick () {
        const {data, activateBlock} = this.props;
        activateBlock(data.get('blockId'));
    }

    // queryBlockById (blockId) {
    //     const {courseware} = this.props;
    //     // courseware = fromJS(courseware);
    //     const slideIndex = courseware.getIn(['index', 'blocks', blockId]);
    //     const blocks = courseware.getIn(['ppt', 'slides', slideIndex, 'blocks']);
    //     const block = blocks.find(block => block.get('id') === blockId)
    //     return block;
    // }

    getScaleRatio (block) {
        const width = block.getIn(['props', 'size', 'width']);
        // const height = block.getIn(['props', 'size', 'height']);
        const widthRatio = 238 / width;
        return widthRatio < 1 ? widthRatio : 1;
    }

    componentDidMount () {
        if (saveQutionHTML) {
            const {data, saveQuestionContent} = this.props;
            const blockId = data.get('blockId');
            saveQuestionContent(Map({
                content: this.block.innerHTML,
                blockId: blockId
            }))
        }
    }

    render () {
        const {data, courseware} = this.props;
        let block = null;
        let scaleRatio = 1;
        let src = null;
        let style = {border: '1px solid', borderColor: 'transparent'};

        const blockId = data.get('blockId');
        if (saveQutionHTML) {
            // 通过blockId找到对应的block数据
            block = queryBlockById(courseware, blockId);
            scaleRatio = this.getScaleRatio(block);
            // const style = {border: '1px solid rgba(27, 174, 225, 0.4)', display: 'inline-block', transform: `scale(${scaleRatio})`, transformOrigin: '0 0'};
        } else {
            src = data.get('content')
            style = Object.assign(style, {textAlign: 'center'});
        }

        // 被选中的元素标记状态
        const blocks = courseware.getIn(['current', 'blocks']);
        if (blocks) {
            // if (blocks.some(block => block.get('blockId') === blockId) || )
            blocks.forEach(block => {
                const groupIndex = block.get('groupIndex');
                let currentId = block.get('blockId');

                if (typeof groupIndex === 'number') { // 组合习题元素
                    currentId = updateBlocks(courseware).getIn([groupIndex, 'id']);
                }

                if (currentId === blockId) {
                    style = Object.assign(style, {borderColor: '#009bee'});
                    return false;
                }
            })
        }

        return (
            <Card
              className='question-item'
              title={this.renderTitle()}
              extra={<Icon className='edit' type='edit' />}
              onClick={this.handleClick}>
                <div ref={(e) => { this.block = e }} style={style}>
                    {
                        saveQutionHTML
                        ? <Block block={block} scale={scaleRatio} />
                        : <img src={src} alt='习题' style={{maxWidth: '240px'}} />
                    }
                </div>
            </Card>
        );
    }
}

QuestionItem.propTypes = {
    slideId: PropTypes.string,
    questionIndex: PropTypes.number,
    data: PropTypes.object,
    showSplitTag: PropTypes.bool,
    handleSplitTagClick: PropTypes.func,
    activateBlock: PropTypes.func,
    courseware: PropTypes.object,
    saveQuestionContent: PropTypes.func
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        activateBlock: (blockId) => {
            dispatch(activateBlock(blockId))
        },
        saveQuestionContent: (content) => {
            dispatch(saveQuestionContent(content))
        }
    }
}

const mapStateToProps = (state) => {
    const courseware = state.courseware.present;
    return {
        courseware
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionItem);
