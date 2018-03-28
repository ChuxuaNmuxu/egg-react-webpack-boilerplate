import React, {Component} from 'react';
import {Button, Row, Col} from 'antd';
import PropTypes from 'prop-types';
import {Map, List} from 'immutable';

import {selectAnswer, changeQuestionOption} from '../../../../../actions/courseware';

class Multiple extends Component {
    constructor (props) {
        super(props);
        this.state = {
            corrent: false
        }

        this.handleDeleteAnswer = this.handleDeleteAnswer.bind(this);
        this.handleSelectAnswer = this.handleSelectAnswer.bind(this);
        this.handleAddAnswer = this.handleAddAnswer.bind(this);
        this.hasAnswer = this.hasAnswer.bind(this);
    }

    handleDeleteAnswer () {
        const {dispatch} = this.props;
        dispatch(changeQuestionOption(Map({
            option: 'delete'
        })))
    }

    handleAddAnswer () {
        const {dispatch} = this.props;
        dispatch(changeQuestionOption(Map({
            option: 'add'
        })))
    }

    handleSelectAnswer (e, answer, index) {
        const {dispatch} = this.props;
        const {question} = this.props;
        let answers = question.get('answer');
        if (!answers) {
            answers = List().push(answer)
        } else {
            const answerIndex = answers.indexOf(answer);
            answers = answerIndex > -1 ? answers.delete(answerIndex) : answers.push(answer);
        }

        dispatch(selectAnswer(Map({
            questionType: 'multiple',
            answer: answers
        })))
    }

    hasAnswer (answer) {
        const {question} = this.props;
        let answers = question.get('answer');
        if (!answers) return false;
        return answers.indexOf(answer) > -1;
    }

    render () {
        // const {options} = this.props;
        const {question} = this.props;
        const options = question.get('options');

        let singleQuestionAnswerList = [];
        for (let i = 0; i < options; i++) {
            singleQuestionAnswerList.push(String.fromCharCode(65 + i));
        }

        return (
            <div>
                <Row className='mb8'>
                    <Col span={4}><span className='cw f14'>答案</span></Col>
                    <Col span={16} offset={4}><span className='tipAnswer'>请选择正确答案</span></Col>
                </Row>
                {
                    singleQuestionAnswerList.map((answer, index) =>
                        <Row key={index} className='mb8'>
                            <Col span={18}>
                                <Button className='btnAnswer' onClick={(e) => this.handleSelectAnswer(e, answer, index)}>{answer}</Button>
                                <span>
                                    <i className={this.hasAnswer(answer) ? 'iconfont icon-duihao correct' : 'iconfont icon-duihao correct dn'} />
                                </span>
                            </Col>
                            <Col span={4} offset={2}><Button className='btnAnswer' onClick={this.handleDeleteAnswer}>-</Button></Col>
                        </Row>
                    )
                }
                <span className='addAnswer' onClick={this.handleAddAnswer}>继续添加项</span>
            </div>
        )
    }
}

Multiple.propTypes = {
    answer: PropTypes.string,
    options: PropTypes.number,
    dispatch: PropTypes.func,
    courseware: PropTypes.object,
    question: PropTypes.object
}

export default Multiple;
