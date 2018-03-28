import React from 'react';
import PropTypes from 'prop-types';

const Bubble = props => {
    const {strokeDasharray = 0, stroke = '', strokeWidth = 0} = props;
    return <svg height='100%' version='1.1' viewBox='0 0 16 16' width='100%' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' preserveAspectRatio='none'><title /><defs /><g fill='none' fillRule='evenodd' strokeDasharray={strokeDasharray} id='Icons with numbers' stroke={stroke} strokeWidth={strokeWidth}><g fill='currentColor' id='Group' transform='translate(-720.000000, -192.000000)'><path d='M728,205 C727.092687,205 726.225692,204.86437 725.430064,204.617506 C724.617765,205.250987 723.248775,206.131104 721.912598,206.131104 C722.612692,205.468456 722.810743,204.184192 722.854217,203.228743 C721.703165,202.248586 721,200.938813 721,199.5 C721,196.462434 724.134007,194 728,194 C731.865993,194 735,196.462434 735,199.5 C735,202.537566 731.865993,205 728,205 Z M728,205' id='Oval 247' /></g></g></svg>;
}

Bubble.propTypes = {
    strokeDasharray: PropTypes.number,
    strokeWidth: PropTypes.number,
    stroke: PropTypes.string
}

export default Bubble;
