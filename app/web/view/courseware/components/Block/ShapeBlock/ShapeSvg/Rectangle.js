import React from 'react';
import PropTypes from 'prop-types';

const Rectangle = props => {
    const {strokeDasharray = 0, stroke = '', strokeWidth = 0} = props;
    return <svg height='100%' version='1.1' viewBox='0 0 16 16' width='100%' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' preserveAspectRatio='none'><title /><defs /><g fill='none' fillRule='evenodd' strokeDasharray={strokeDasharray} id='Icons with numbers' stroke={stroke} strokeWidth={strokeWidth}><g fill='currentColor' id='Group' transform='translate(-192.000000, -480.000000)'><path d='M195.996203,480 C193.789161,480 192,481.78883 192,483.996203 L192,492.003797 C192,494.210839 193.78883,496 195.996203,496 L204.003797,496 C206.210839,496 208,494.21117 208,492.003797 L208,483.996203 C208,481.789161 206.21117,480 204.003797,480 L195.996203,480 Z M195.996203,480' id='Rectangle 153' /></g></g></svg>;
}

Rectangle.propTypes = {
    strokeDasharray: PropTypes.number,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string
}

export default Rectangle;
