import React, {Component} from 'react';
import {Select, Row} from 'antd';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Map} from 'immutable';

import {changeQuestionType} from '../../../../actions/courseware';
import {updateQuestion} from '../../../../reducers/courseware/helper';
import questionType from './QuestionType';
import questionsName from '../../config/questionsName';
const Option = Select.Option;

class QuestionProps extends Component {
    constructor (props) {
        super(props);

        this.state = {
            singleQuestionAnswerLength: 4,
            index: 0
        }
        this.handleChangeType = this.handleChangeType.bind(this);
    }

    handleChangeType (value) {
        const {dispatch} = this.props;
        dispatch(changeQuestionType(Map({
            type: value,
            name: questionsName[value]
        })))
    }
    render () {
        const {courseware, dispatch} = this.props;
        const question = updateQuestion(courseware);

        const type = question.get('type');
        let QuestionComponent = questionType[type].component;

        return (
            <div>
                <Row className='mb16'>
                    <div className='mb8 cw f14'>题型</div>
                    <Select size='small' onChange={this.handleChangeType} value={type}>
                        <Option value='single'>单选题</Option>
                        <Option value='multiple'>多选题</Option>
                        <Option value='trueOrFalse'>判断题</Option>
                        <Option value='match'>对应题</Option>
                        <Option value='subjective'>主观题</Option>
                    </Select>
                </Row>
                <QuestionComponent question={question} dispatch={dispatch} />
            </div>
        )
    }
}

QuestionProps.propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    courseware: PropTypes.object
}

const mapStateToProps = (state) => {
    const courseware = state.courseware.present;
    return {
        courseware
    }
}

export default connect(mapStateToProps)(QuestionProps);
