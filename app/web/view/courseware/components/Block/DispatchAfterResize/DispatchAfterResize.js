import React, {Component} from 'react';
import elementResizeEvent from 'element-resize-event';
import PropTypes from 'prop-types';

import config from './config'

class DispatchAfterResize extends Component {
    componentDidMount () {
        const element = this.refs.child;
        const type = element.dataset.type.toLowerCase();
        const handleDispatch = config[type];
        const {dispatch, index} = this.props;
        elementResizeEvent(element, () => {
            dispatch(handleDispatch({
                index,
                height: element.offsetHeight
            }))
        })
    }
    render () {
        return <div>
            {
                React.cloneElement(this.props.children, {ref: 'child'})
            }
        </div>
    }
}

DispatchAfterResize.propTypes = {
    dispatch: PropTypes.func,
    index: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object
    ]),
    children: PropTypes.node
}

export default DispatchAfterResize;
