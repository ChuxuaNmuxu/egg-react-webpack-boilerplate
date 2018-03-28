import React from 'react';
import PropTypes from 'prop-types';
import {Scrollbars} from 'react-custom-scrollbars';
import {Collapse} from 'antd';
import {sortedUniq} from 'lodash';
import nzhcn from 'nzh/cn';
import {connect} from 'react-redux';

import QuestionItem from './QuestionItem';
import {
    mergeExercise,
    splitExercise
} from '../../../../../actions/courseware';

class ExerciseList extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            collapseActiveKeys: ['0']
        }

        this.renderTitle = this.renderTitle.bind(this);
        this.handleLinkTagClick = this.handleLinkTagClick.bind(this);
        this.showSplitTag = this.showSplitTag.bind(this);
    }

    renderThumb ({style, ...props}) {
        const thumbStyle = {
            // backgroundColor: '#4b5155',
            backgroundColor: 'currentColor',
            borderRadius: '3px'
        };
        return (
            <div
              style={{ ...style, ...thumbStyle }}
              {...props} />
        );
    }

    handleLinkTagClick (e, sourceIndex, targetIndex) {
        e.stopPropagation();
        e.preventDefault();
        console.log(32, '合并练习')
        const {mergeExercise} = this.props;
        mergeExercise(sourceIndex, targetIndex);
    }

    handleSplitTagClick (e, exerciseIndex, questionIndex) {
        e.stopPropagation();
        e.preventDefault();
        console.log(51, '拆分练习')
        const {splitExercise} = this.props;
        splitExercise(exerciseIndex, questionIndex);
    }

    renderTitle (exercise, exerciseIndex) {
        const {data, index} = this.props;
        const slides = sortedUniq(exercise.get('questions').map((question) => index.getIn(['blocks', question.get('blockId')]) + 1).toArray());
        const title = exercise.get('title') || `练习${nzhcn.encodeS(exerciseIndex + 1)}`;
        const {collapseActiveKeys} = this.state;
        const showLinkTag = collapseActiveKeys.indexOf(exerciseIndex.toString()) < 0 && data.get(exerciseIndex + 1);
        return <div>
            {title} <span className='info'>{` (共${exercise.get('questions').size}题, 卡片：${slides.join('、')})`}</span>
            {
                showLinkTag && <div className='link-tag'>
                    <a href='###' onClick={e => this.handleLinkTagClick(e, exerciseIndex + 1, exerciseIndex)}><i className='iconfont icon-link' /></a>
                </div>
            }
        </div>;
    }

    showSplitTag (exercise, questionIndex) {
        const questions = exercise.get('questions');
        if (questionIndex === 0) {
            return false;
        }
        const {index} = this.props;
        const blocks = index.get('blocks');
        const slideIndex = blocks.get(questions.getIn([questionIndex, 'blockId']));
        const prevSlideIndex = blocks.get(questions.getIn([questionIndex - 1, 'blockId']));
        return slideIndex !== prevSlideIndex;
    }

    render () {
        const {data} = this.props;
        console.log(99, data)
        return (
            <Scrollbars
              renderThumbVertical={this.renderThumb}
              autoHide
              autoHideDuration={200}
              autoHideTimeout={1000}>
                <Collapse className='exercise-list' defaultActiveKey={['0']} activeKey={this.state.collapseActiveKeys} onChange={key => this.setState({collapseActiveKeys: key})}>
                    {data.map((item, exerciseIndex) =>
                        <Collapse.Panel header={this.renderTitle(item, exerciseIndex)} key={exerciseIndex}>
                            {
                                item.get('questions').map((question, questionIndex) =>
                                    <QuestionItem
                                      key={questionIndex}
                                      data={question}
                                      questionIndex={questionIndex}
                                      showSplitTag={this.showSplitTag(item, questionIndex)}
                                      handleSplitTagClick={(e) => this.handleSplitTagClick(e, exerciseIndex, questionIndex)} />
                                )
                            }
                        </Collapse.Panel>
                    )}
                </Collapse>
            </Scrollbars>
        );
    }
}

ExerciseList.propTypes = {
    data: PropTypes.object,
    index: PropTypes.object,
    mergeExercise: PropTypes.func,
    splitExercise: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        mergeExercise: (sourceIndex, targetIndex) => {
            dispatch(mergeExercise(sourceIndex, targetIndex))
        },
        splitExercise: (exerciseIndex, questionIndex) => {
            dispatch(splitExercise(exerciseIndex, questionIndex))
        }
    }
}

export default connect(null, mapDispatchToProps)(ExerciseList);
