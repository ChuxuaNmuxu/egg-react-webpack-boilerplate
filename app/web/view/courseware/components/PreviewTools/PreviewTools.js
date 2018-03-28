import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';

import ToolBtn from '../Bottons/ToolBtn';
import styles from './previewTools.scss';

const PreviewTools = (props) => {
    return <div styleName='preview-tools' className='preview-tools'>
        <ToolBtn
          wrapClass='preview-exit'
          iconClass='icon-tuichu1'
          option={props.exitPreview}
                />
    </div>
}

PreviewTools.propTypes = {
    exitPreview: PropTypes.func
}

export default CSSModules(PreviewTools, styles);
