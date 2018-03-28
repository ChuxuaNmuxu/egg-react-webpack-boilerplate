import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';

import styles from './Exercise.scss';
import ExerciseList from './ExerciseList';

const emptyDom = <div className='empty'>
    课件中还没有练习
    <hr />
    <p>请选择卡片中的对象转换成题目</p>
    <p><span className='star'>*</span>可以选择多个元素转换成一道题目</p>
</div>;

class Exercise extends React.Component {
    constructor (props) {
        super(props);

        this.state = {};
    }

    render () {
        const {exercises, index} = this.props;
        console.log(13, exercises)
        return (
            <div className='exercise' styleName='exercise'>
                {exercises.isEmpty()
                    ? emptyDom
                    : <ExerciseList data={exercises} index={index} />}
            </div>
        );
    }
}

Exercise.propTypes = {
    exercises: PropTypes.object,
    index: PropTypes.object
}

const mapStateToProps = (state, ownProps) => {
    const courseware = state.courseware.present;
    return {
        exercises: courseware.getIn(['ppt', 'exercises']),
        index: courseware.get('index')
    }
}

export default connect(mapStateToProps)(CSSModules(Exercise, styles));
