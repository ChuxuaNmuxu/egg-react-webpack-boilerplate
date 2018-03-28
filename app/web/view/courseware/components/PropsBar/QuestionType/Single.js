import React, {Component} from 'react';
import {Button, Row, Col} from 'antd';
import PropTypes from 'prop-types';
import {Map} from 'immutable';

import {selectAnswer, changeQuestionOption} from '../../../../../actions/courseware';

class Single extends Component {
    constructor (props) {
        super(props);

        this.handleDeleteAnswer = this.handleDeleteAnswer.bind(this);
        this.handleSelectAnswer = this.handleSelectAnswer.bind(this);
        this.handleAddAnswer = this.handleAddAnswer.bind(this);
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
        this.setState({
            index
        });
        dispatch(selectAnswer(Map({
            answer
        })))
    }

    getAnswerClassName (index) {
        const {question} = this.props;
        const answer = question.get('answer');
        const answerToIndex = answer ? answer.charCodeAt(0) - 65 : 0;
        return index === answerToIndex ? 'iconfont icon-duihao correct' : 'iconfont icon-duihao correct dn';
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
                                    <i className={this.getAnswerClassName(index)} />
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

Single.propTypes = {
    answer: PropTypes.string,
    options: PropTypes.number,
    dispatch: PropTypes.func,
    courseware: PropTypes.object,
    question: PropTypes.object
}

export default Single;
