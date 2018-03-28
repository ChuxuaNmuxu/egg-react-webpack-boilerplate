import React from 'react';
import PropTypes from 'prop-types';

const Square = props => {
    const {strokeDasharray = 0, stroke = '', strokeWidth = 0} = props;
    return <svg height='100%' version='1.1' viewBox='0 0 16 16' width='100%' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' preserveAspectRatio='none'><title /><defs /><g fill='none' fillRule='evenodd' strokeDasharray={strokeDasharray} stroke={stroke} strokeWidth={strokeWidth}><g fill='currentColor' id='Group' transform='translate(-96.000000, -480.000000)'><path d='M96,480 L96,496 L112,496 L112,480 L96,480 Z M96,480' id='Rectangle 152' /></g></g></svg>;
}

Square.propTypes = {
    strokeDasharray: PropTypes.number,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string
}

export default Square;
