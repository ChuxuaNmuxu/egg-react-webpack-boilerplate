import React, {Component} from 'react';
import {Button, Row, Col, InputNumber} from 'antd';
import PropTypes from 'prop-types';
import {Map, fromJS} from 'immutable';

import {changeQuestionOption, changeSubjectAnswer} from '../../../../../actions/courseware';

class Subjective extends Component {
    constructor (props) {
        super(props);
        this.state = {
            answer: 'right',
            questionAmount: [1, 2, 3, 4]
        }
        this.handleChangeType = this.handleChangeType.bind(this);
    }

    handleChangeType (amount) {
        const {dispatch} = this.props;
        dispatch(changeQuestionOption(Map({
            options: amount
        })))
    }

    handleChangeAnswer (value, index) {
        const {dispatch} = this.props;
        dispatch(changeSubjectAnswer(fromJS({
            value,
            index
        })))
    }

    render () {
        const {question} = this.props;
        const options = question.get('options');
        // const estimateScore = fromJS(Array.from({length: options}, () => 0)).merge(question.get('estimateScore'));
        const estimateScore = question.get('estimateScore');
        return (
            <div>
                <Row className='mb8'>
                    <Col span={5}><span className='cw f14'>小题数</span></Col>
                </Row>
                <Row className='mb16' gutter={16}>
                    {
                        this.state.questionAmount.map((amount, index) =>
                            <Col span={6} key={index}>
                                <Button className={index + 1 === options ? 'btnAnswer btnAnswer-selected' : 'btnAnswer'} onClick={() => this.handleChangeType(amount)}>{amount}</Button>
                            </Col>
                        )
                    }
                </Row>
                <Row className='mb8'>
                    <Col span={8}><span className='cw f14'>各小题估分</span></Col>
                </Row>
                {
                    estimateScore.map((value, index) => {
                        return <Row key={index} className='mb8'>
                            <Col className='cw lh28' span={4}>( {index + 1} )</Col>
                            <Col span={18} offset={2} style={{height: '28px', lineHeight: '28px'}}>
                                <InputNumber min={0} max={10} size='small' style={{width: '29%'}} value={value} onChange={value => this.handleChangeAnswer(value, index)} />
                            </Col>
                        </Row>
                    })
                    }
            </div>
        )
    }
}

Subjective.propTypes = {
    dispatch: PropTypes.func,
    courseware: PropTypes.object,
    options: PropTypes.number,
    question: PropTypes.object
}

export default Subjective;
