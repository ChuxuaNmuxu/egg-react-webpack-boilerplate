import React from 'react';
import PropTypes from 'prop-types';

const Loveheart = props => {
    const {strokeDasharray = 0, stroke = '', strokeWidth = 0} = props;
    return <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' version='1.1' id='7581697901' x='0px' y='0px' width='100%' height='100%' viewBox='0 0 56.84 49.636' enableBackground='new 0 0 56.84 49.636' xmlSpace='preserve' preserveAspectRatio='none'><g fill='none' fillRule='evenodd' strokeDasharray={strokeDasharray} id='Icons with numbers' stroke={stroke} strokeWidth={strokeWidth}><path fill='currentColor' d='M28.487,10.847C21.13-6.364,0.18-2.348,0.08,17.628C0,33.538,27.699,46.784,28.531,49.636  C29.285,46.675,57,33.785,56.92,17.509C56.823-2.517,35.506-5.678,28.487,10.847z' /></g></svg>;
}

Loveheart.propTypes = {
    strokeDasharray: PropTypes.number,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string
}

export default Loveheart;
