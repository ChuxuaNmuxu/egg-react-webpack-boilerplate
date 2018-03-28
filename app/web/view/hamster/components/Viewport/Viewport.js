import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';

import styles from './Viewport.scss';
import Block from './Block';

export const Component = (props) => {
    const {blocks, current} = props;
    return (
        <div className='viewport' styleName='viewport'>
            <div className='reveal'>
                <div className='slides'>
                    <section className='section'>
                        {
                            blocks.map(block => <Block block={block} active={current.get('blocks').includes(block.get('id'))} />)
                        }
                    </section>
                </div>
            </div>
        </div>
    )
}

Component.propTypes = {
    blocks: PropTypes.any,
    current: PropTypes.any
}

export default CSSModules(Component, styles);
