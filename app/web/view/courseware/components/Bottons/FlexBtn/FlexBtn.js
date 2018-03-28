import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './flexBtn.scss';
import PropTypes from 'prop-types';

class FlexBtn extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            slide: 'out'
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick () {
        this.setState({
            slide: this.state.slide === 'out' ? 'in' : 'out'
        }, () => {
            this.props.onChange(this.state.slide);
        })
    }

    render () {
        const {contentClass = 'content', iconClass = 'icon-shouqi1'} = this.props;

        return <div styleName='flex-btn' className='flex-btn' onClick={this.handleClick} >
            <div className={contentClass}>
                <i className={`iconfont ${iconClass}`} />
            </div>
        </div>
    }
}

FlexBtn.propTypes = {
    onChange: PropTypes.func,
    contentClass: PropTypes.string,
    iconClass: PropTypes.string
}

export default CSSModules(FlexBtn, styles);
