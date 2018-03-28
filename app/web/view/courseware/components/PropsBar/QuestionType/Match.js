import React, {Component} from 'react';
import {Button, Row, Col} from 'antd';
import CSSModules from 'react-css-modules';
import styles from './match.scss';
import PropTypes from 'prop-types';
import {Map} from 'immutable';

import {changeQuestionOption, matchOptions} from '../../../../../actions/courseware';

class Match extends Component {
    constructor (props) {
        super(props);

        const questionAmount = [2, 3, 4, 5, 6];
        let numCoord = [];
        let letterCoord = [];
        const len = questionAmount[questionAmount.length - 1];
        for (let i = 0; i < len; i++) {
            numCoord.push([5, 15 + i * 40]);
            letterCoord.push([163, 15 + i * 40]); // 15和40，168是对应题连线区域固定的距离，没有做自适应处理
        }

        this.state = {
            answer: 'right',
            questionAmount,
            numCoord,
            letterCoord,
            numberIndex: -1,
            letterIndex: -1
        }
        this.handleChangeOption = this.handleChangeOption.bind(this);
        this.handleClickNumber = this.handleClickNumber.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickLetter = this.handleClickLetter.bind(this);
        this.drawLine = this.drawLine.bind(this);
    }

    handleChangeOption (amount) {
        const {dispatch} = this.props;
        dispatch(changeQuestionOption(Map({
            options: amount
        })))
        this.setState({
            numberIndex: -1,
            letterIndex: -1
        })
    }

    handleClickNumber (e, number, index) {
        this.handleClick(e, number, index);
    }

    handleClickLetter (e, letter, index) {
        this.handleClick(e, letter, index);
        const {dispatch} = this.props;
        dispatch(matchOptions(Map({
            number: this.state.numberIndex,
            letter
        })))
    }

    handleClick (e, value, index) {
        const type = value > -1 ? 'number' : 'letter';
        this.setState({
            [type + 'Index']: index
        })
    }

    getNumberClassName (index) {
        return this.state.numberIndex === index ? 'match-btn active' : 'match-btn';
    }

    getLetterClassName (index) {
        return this.state.letterIndex === index ? 'match-btn active' : 'match-btn';
    }

    componentWillReceiveProps (nextProps) {
        const preQuestion = this.props.question;
        const question = nextProps.question;

        const answer = question.get('answer');

        if (!preQuestion.get('answer').equals(answer)) {
            this.drawLine(answer);
        }
    }

    componentDidMount () {
        // const {answer} = this.props;
        const {question} = this.props;
        const answer = question.get('answer');
        this.drawLine(answer);
    }

    drawLine (answer) {
        const canvas = this.canvas;
        let context = canvas.getContext('2d');
        context.strokeStyle = '#B87333';
        context.clearRect(0, 0, 168, 230)
        answer.forEach((value, index) => {
            if (value) {
                context.beginPath();
                const startCoord = this.state.numCoord[index];
                const endCoord = this.state.letterCoord[value.charCodeAt(0) - 65];
                context.moveTo(startCoord[0], startCoord[1]);
                context.lineTo(endCoord[0], endCoord[1]);
                context.stroke();
                context.closePath();
            }
        })
    }

    render () {
        // const {options} = this.props;
        const {question} = this.props;
        const options = question.get('options');

        const numberList = [];
        const letterList = [];
        console.log(options);
        for (let i = 0; i < options; i++) {
            numberList.push(i + 1);
            letterList.push(String.fromCharCode(65 + i));
        }
        return (
            <div className='match' styleName='match'>
                <Row className='mb8'>
                    <Col span={5}><span className='cw f14'>选项数</span></Col>
                </Row>
                <Row className='mb16' gutter={1}>
                    {
                        this.state.questionAmount.map((amount, index) =>
                            <Col span={4} key={index} offset={index > 0 ? 1 : 0}>
                                <Button className={index + 2 === options ? 'btnAnswer btnAnswer-selected' : 'btnAnswer'} onClick={() => this.handleChangeOption(amount)}>{amount}</Button>
                            </Col>
                        )
                    }
                </Row>
                <Row className='mb8'>
                    <Col span={4}><span className='cw f14'>答案</span></Col>
                    <Col span={16} offset={4}><span className='tipAnswer'>目前只支持单项对应</span></Col>
                </Row>
                <div className='line-wrap'>
                    <div className='match-list dib'>
                        {
                            numberList.map((number, index) =>
                                <Button key={index} className={this.getNumberClassName(index)} onClick={(e) => this.handleClickNumber(e, number, index)}>{number}</Button>
                            )
                        }
                    </div>
                    <div className='match-line-area dib'>
                        <canvas width='168' height='230' ref={(e) => { this.canvas = e }} />
                    </div>
                    <div className='match-list dib'>
                        {
                            letterList.map((letter, index) =>
                                <Button key={index} className={this.getLetterClassName(index)} onClick={(e) => this.handleClickLetter(e, letter, index)}>{letter}</Button>
                            )
                        }
                        }
                    </div>
                </div>
            </div>
        )
    }
}

Match.propTypes = {
    dispatch: PropTypes.func,
    courseware: PropTypes.object,
    answer: PropTypes.array,
    options: PropTypes.number,
    question: PropTypes.object
}

export default CSSModules(Match, styles);
