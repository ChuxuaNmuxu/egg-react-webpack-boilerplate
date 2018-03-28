import React from 'react';
import PropTypes from 'prop-types';

import {getTheBlock} from '../../../../reducers/courseware/helper';
import BlockAnimation from './Animation/BlockAnimation';
import SlideAnimation from './Animation/SlideAnimation';

const AnimationProps = (props) => {
    const {dispatch, courseware} = props;

    if (props.type === 'slide') {
        const slideIndex = courseware.getIn(['current', 'slideIndex']);
        const slideAnimation = courseware.getIn(['ppt', 'slides', slideIndex, 'props', 'animation']);
        return <SlideAnimation form={props.form} animation={slideAnimation} dispatch={dispatch} />
    } else {
        const block = getTheBlock(courseware);
        const blockAnimation = block.getIn(['props', 'animation']);
        return <BlockAnimation form={props.form} animation={blockAnimation} dispatch={dispatch} />
    }
}

AnimationProps.propTypes = {
    form: PropTypes.object,
    type: PropTypes.string,
    dispatch: PropTypes.func,
    courseware: PropTypes.object
}

export default AnimationProps;
