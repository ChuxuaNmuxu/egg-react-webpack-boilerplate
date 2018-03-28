import React from 'react';
import PropTypes from 'prop-types';

const Circlebubble = props => {
    const {strokeDasharray = 0, stroke = '', strokeWidth = 0} = props;
    return <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100%' height='100%' preserveAspectRatio='none'><g fill='none' fillRule='evenodd' strokeDasharray={strokeDasharray} id='Icons with numbers' stroke={stroke} strokeWidth={strokeWidth}><circle cx='50' cy='50' r='40' fill='currentColor' /><path d='M 100 50 L 85 40 L 85 60 Z' fill='currentColor' /></g></svg>;
}
Circlebubble.propTypes = {
    strokeDasharray: PropTypes.number,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string
}

export default Circlebubble;
