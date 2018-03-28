import {fromJS, Map} from 'immutable';
import uuid from 'uuid';

// import store from '../../../core/configureStore';
import {HAMSTER} from '../../../actions/actionTypes'

const BlockUtils = {
    /**
     * 添加
     */
    addBlock: function (block) {
        this.addBlocks([block]);
    },

    /**
     * 添加多个
     */
    // addBlocks: function (blocks) {
    //     blocks = fromJS(blocks);
    //     blocks = blocks.map(this.extractBlockData);
    //     store.dispatch({type: HAMSTER.BLOCK_ADD, payload: {blocks}});
    //     // addBlock时会生成唯一id
    // },

    /**
     * 从配置中提取数据
     * @param {*} block
     */
    extractBlockData (block) {
        let data = Map();
        data = data.withMutations(data => {
            data.set('id', 'block-' + uuid.v4());
            data.set('type', block.get('name'));
            data.set('props', block.get('props').reduce((reduction, v, k) => reduction.set(k, v.get('value')), Map()));
            // TODO：props应该还有校验过程
        })
        return data;
    },

    // activateBlock (blockIds) {
    //     store.dispatch({type: HAMSTER.BLOCK_ACTIVATE, payload: {blockIds}})
    // }
}

export default BlockUtils;
