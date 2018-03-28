import React from 'react';
import PropTypes from 'prop-types';

const Star = props => {
    const {strokeDasharray = 0, stroke = '', strokeWidth = 0} = props;
    return <svg height='100%' version='1.1' viewBox='0 0 16 16' width='100%' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' preserveAspectRatio='none'><title /><defs /><g fill='none' fillRule='evenodd' strokeDasharray={strokeDasharray} stroke={stroke} strokeWidth={strokeWidth}><g fill='currentColor' id='Group' transform='translate(-384.000000, -480.000000)'><path d='M392,491.953125 L387.022583,495.99353 L389.032704,489.524391 L384.015259,486.030029 L390.052612,486.030029 L392,480 L393.984253,486.030029 L400.065063,486.030029 L394.967296,489.524392 L397.036133,495.99353 L392,491.953125 Z M392,491.953125' id='Star 240 copy' /></g></g></svg>;
}

Star.propTypes = {
    strokeDasharray: PropTypes.number,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string
}

export default Star;
