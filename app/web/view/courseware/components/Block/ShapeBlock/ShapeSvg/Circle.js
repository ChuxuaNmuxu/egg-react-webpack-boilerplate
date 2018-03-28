import React from 'react';
import PropTypes from 'prop-types';

const Circle = props => {
    const {strokeDasharray = 0, stroke = '', strokeWidth = 0} = props;
    return <svg height='100%' version='1.1' viewBox='0 0 16 16' width='100%' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' preserveAspectRatio='none'><title /><defs /><g fill='none' fillRule='evenodd' strokeDasharray={strokeDasharray} stroke={stroke} strokeWidth={strokeWidth}><g fill='currentColor' id='Group' transform='translate(0.000000, -480.000000)'><path d='M8,496 C12.4182782,496 16,492.418278 16,488 C16,483.581722 12.4182782,480 8,480 C3.58172178,480 0,483.581722 0,488 C0,492.418278 3.58172178,496 8,496 Z M8,496' id='Oval 151' /></g></g></svg>;
}
Circle.propTypes = {
    strokeDasharray: PropTypes.number,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string
}

export default Circle;
