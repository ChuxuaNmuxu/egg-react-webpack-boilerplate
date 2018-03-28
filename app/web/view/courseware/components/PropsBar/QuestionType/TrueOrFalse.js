import React, {Component} from 'react';
import {Button, Row, Col} from 'antd';
import PropTypes from 'prop-types';
import {Map} from 'immutable';

import {selectAnswer} from '../../../../../actions/courseware';

class TrueOrFalse extends Component {
    constructor (props) {
        super(props);

        this.state = {
            answer: 'right'
        }
        this.handleSelectAnswer = this.handleSelectAnswer.bind(this);
    }

    handleSelectAnswer (e, answer) {
        const {dispatch} = this.props;
        this.setState({
            answer
        });
        dispatch(selectAnswer(Map({
            answer
        })))
    }

    getAnswerClassName (answer) {
        const {question} = this.props;
        return answer === question.get('answer') ? 'iconfont icon-duihao correct' : 'iconfont icon-duihao correct dn';
    }

    render () {
        return (
            <div>
                <Row className='mb8'>
                    <Col span={4}><span className='cw f14'>答案</span></Col>
                    <Col span={16} offset={4}><span className='tipAnswer'>请选择正确答案</span></Col>
                </Row>
                <Row key={1} className='mb8'>
                    <Col span={24}>
                        <Button className='btnAnswer' onClick={(e) => this.handleSelectAnswer(e, 'right')}>对</Button>
                        <span>
                            <i className={this.getAnswerClassName('right')} />
                        </span>
                    </Col>
                </Row>
                <Row key={2} className='mb8'>
                    <Col span={24}>
                        <Button className='btnAnswer' onClick={(e) => this.handleSelectAnswer(e, 'wrong')}>错</Button>
                        <span>
                            <i className={this.getAnswerClassName('wrong')} />
                        </span>
                    </Col>
                </Row>
            </div>
        )
    }
}

TrueOrFalse.propTypes = {
    dispatch: PropTypes.func,
    courseware: PropTypes.object,
    answer: PropTypes.string,
    question: PropTypes.object
}

export default TrueOrFalse;
