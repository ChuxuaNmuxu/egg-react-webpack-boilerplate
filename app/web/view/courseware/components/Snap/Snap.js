import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './Snap.scss';
import PropTypes from 'prop-types';

const Snap = (props) => {
    const {guides} = props;
    return <div styleName='SnapWrap'>
        {
                guides.map((guide, index) => {
                    if (guide) {
                        const className = index < 3 ? 'vertical' : 'honrizontal';
                        let style = {};
                        guide.forEach((value, key) => {
                            style[key] = `${value}px`
                        })
                        return <div key={index} className={className} style={style} />
                    }
                })
            }
    </div>
}

Snap.propTypes = {
    guides: PropTypes.object
}

export default CSSModules(Snap, styles);
