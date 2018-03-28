/**
 * Created by Administrator on 2017/8/3.
 */
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import CSSModules from 'react-css-modules';
import { Input, Icon } from 'antd';
import { trim } from 'lodash';
import styles from './pptfolderSearch.scss';

const Search = Input.Search;

class PPTfolderSearch extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: ''
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    static defaultProps = {
        searchInputClick: (e) => { console.log(e) }
    }

    handleDelete () {
        this.setState({
            value: ''
        })
    }

    handleChange (e) {
        if (e.target.value.length <= 20) {
            this.setState({
                value: e.target.value
            })
        }
    }

    render () {
        const { searchInputClick } = this.props;
        return (
            <div className='mypptSearch' styleName='mypptSearch'>
                <Search
                  placeholder='搜索课件名称'
                  onSearch={(e) => { !!trim(e) && searchInputClick(trim(e)) }}
                  className='search-input'
                  onChange={this.handleChange}
                  value={this.state.value}
                  max={20}
                />
                <Icon type='close-circle delete-icon' onClick={this.handleDelete} style={{display: this.state.value !== '' ? 'block' : 'none'}} />
            </div>
        );
    }
}

PPTfolderSearch.propTypes = {
    searchInputClick: PropTypes.func
}

export default CSSModules(PPTfolderSearch, styles);
