import React from 'react';
import PropTypes from 'prop-types';

const Triangle = props => {
    const {strokeDasharray = 0, stroke = '', strokeWidth = 0} = props;
    return <svg height='100%' version='1.1' viewBox='0 0 16 16' width='100%' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' preserveAspectRatio='none'><title /><defs /><g fill='none' fillRule='evenodd' strokeDasharray={strokeDasharray} stroke={stroke} strokeWidth={strokeWidth}><g fill='currentColor' id='Group' transform='translate(-480.000000, -480.000000)'><path d='M488,480 L496,496 L480,496 L488,480 Z M488,480' id='Triangle 155' /></g></g></svg>;
}
Triangle.propTypes = {
    strokeDasharray: PropTypes.number,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string
}

export default Triangle;
