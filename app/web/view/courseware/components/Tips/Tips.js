import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd';
import {connect} from 'react-redux';

import {confirmQuestionOvernumber} from '../../../../actions/courseware';

class Tips extends React.Component {
    constructor (props) {
        super();

        this.state = {
            mergeExercise: '练习不能多于20道题，无法合并',
            addQuestion: '练习不能多于20道题，请在新卡片中添加'
        }
    }
    componentWillReceiveProps (nextProps) {
        const {infoType, handleConfirm} = nextProps;

        if (infoType !== '') {
            Modal.info({
                content: (
                    <div>
                        <p>{this.state[infoType]}</p>
                    </div>
                ),
                onOk () {
                    handleConfirm()
                },
                onCancel () {
                    handleConfirm()
                },
                maskClosable: true
            });
        }
    }

    render () {
        return <tips />
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleConfirm: () => {
            dispatch(confirmQuestionOvernumber())
        }
    }
}

const mapStateToProps = (state) => {
    let courseware = state.courseware.present;
    const questionOverNumber = courseware.getIn(['current', 'questionOverNumber']);
    return {
        infoType: questionOverNumber
    }
}

Tips.propTypes = {
    infoType: PropTypes.string,
    handleConfirm: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Tips);
