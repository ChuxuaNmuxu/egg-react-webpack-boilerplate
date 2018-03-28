import React from 'react';
import PropTypes from 'prop-types';

const Arrow = props => {
    const {strokeDasharray = 0, stroke = '', strokeWidth = 0} = props;
    return <svg height='100%' version='1.1' viewBox='0 0 16 16' width='100%' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><title /><defs /><g fill='none' fillRule='evenodd' strokeDasharray={strokeDasharray} id='Icons with numbers' stroke={stroke} strokeWidth={strokeWidth}><g fill='currentColor' id='Group' transform='translate(-144.000000, -96.000000)'><path d='M154,107 L144,107 L144,101 L154,101 L154,98 L160,104 L154,110 L154,107 L154,107 Z M154,107' id='Shape' /></g></g></svg>;
}

Arrow.propTypes = {
    strokeDasharray: PropTypes.number,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string
}

export default Arrow;
