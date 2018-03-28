import React from 'react';
import PropTypes from 'prop-types';

const Layout = (props) => {
    return (
        <div>
            {props.children}
        </div>
    )
}

Layout.propTypes = {
    children: PropTypes.any
}

export default Layout;
