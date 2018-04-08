import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';

import styles from './Editor.scss';
import Toolbar from './components/Toolbar';
import Propsbar from './components/Propsbar';
import Navbar from './components/Navbar';
import Viewport from './components/Viewport';
import {HAMSTER} from '../../actions/actionTypes';

class Editor extends React.Component {
    state = {}

    constructor (props) {
        super(props);

        this.handlePropChange = this.handlePropChange.bind(this);
    }

    handlePropChange (name, value, block) {
        const {dispatch} = this.props;
        dispatch({type: HAMSTER.BLOCK_PROPS_CHANGE, payload: {block, props: {[name]: value}}});
    }

    render () {
        const {blocks, current} = this.props;
        const currentBlocks = blocks.filter(block => current.get('blocks').includes(block.get('id')));
        return (
            <div className='editor' styleName='editor'>
                <header>
                    <Toolbar />
                </header>
                <main>
                    <Propsbar onPropChange={this.handlePropChange} data={currentBlocks} />
                    <Navbar />
                    <Viewport blocks={blocks} current={current} />
                </main>
            </div>
        )
    }
}

Editor.propTypes = {
    dispatch: PropTypes.func,
    blocks: PropTypes.any,
    current: PropTypes.any
}

const mapStateToProps = ({hamster}) => {
    return {
        blocks: hamster.get('blocks'),
        current: hamster.get('current')
    }
};

export default connect(mapStateToProps)(CSSModules(Editor, styles));
