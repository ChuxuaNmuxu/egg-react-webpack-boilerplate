import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

import Block from './Block';

/**
 * 图片元素块
 */
class ImageBlock extends React.Component {
    render () {
        // const {url} = this.props.me;
        const url = this.props.me.get('url');
        return (
            <Block {...this.props}>
                {
                   url
                   ? <img src={url} alt='img' style={{width: '100%', height: '100%', margin: 0, border: 0, boxShadow: 'none', maxWidth: '100%', background: 'none'}} />
                   : <div className='imgLoading'>
                       <Spin tip='图片加载中...' />
                   </div>
                }
            </Block>
        )
    }
}

ImageBlock.propTypes = {
    me: PropTypes.object

}

export default ImageBlock;
