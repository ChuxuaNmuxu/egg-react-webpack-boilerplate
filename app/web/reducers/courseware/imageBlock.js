/**
 * 图片元素处理逻辑
 */
import {
    getMaxZindex,
    deleteBlock,
    updatePickedBlocks,
    updateBlocks,
    refreshZindex
} from './helper';
import {
    scaleImage
} from './baseBlock';
import {
    commonBlockConfig
} from './config'
import {addQuestionToExercise} from './exercise'
import {Map, List, fromJS} from 'immutable'

/**
 * 取消图片分割
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleCancleCrop = (courseware, action) => {
    return courseware.setIn(['current', 'isCrop'], false);
}

/**
 * 完成图片分割
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleCompleteCrop = (courseware, action) => {
    const {data} = action;
    const toQuestion = data.get('toQuestion');
    const widthScale = data.getIn(['scaleRadio', 'widthScale']);
    const heightScale = data.getIn(['scaleRadio', 'heightScale']);

    courseware = deleteBlock(courseware).get('courseware'); // 删除被剪切的图片

    let zIndexs = List();
    let zIndexMax = getMaxZindex(courseware);

    const blocks = data.get('imgFragments').map((imgFragment) => {
        const blockId = imgFragment.get('blockId');
        const width = imgFragment.get('width');
        const height = imgFragment.get('height');
        const left = imgFragment.get('left');
        const top = imgFragment.get('top');
        const imgUrl = null;

        zIndexs.push(++zIndexMax); // 更新zIndexs数组

        const fragmentBlock = Map().withMutations(map => {
            map
            .set('id', blockId)
            .set('type', 'image')
            .setIn(['props', 'size', 'width'], width * widthScale)
            .setIn(['props', 'size', 'height'], height * heightScale)
            .setIn(['props', 'position', 'left'], left)
            .setIn(['props', 'position', 'top'], top)
            .setIn(['props', 'zIndex'], zIndexMax)
            .set('url', imgUrl)
            .set('isQuestion', !!toQuestion)
            .set('initWidth', width)
            .set('initHeight', height)
        })
        let block = fromJS(commonBlockConfig).mergeDeep(fragmentBlock); // 生成imageBlock

        return block
    })

    courseware = updateBlocks(courseware, value => value.concat(blocks)) // 将生成的block合入课件数据并更新current
                .withMutations(courseware => {
                    courseware
                    .updateIn(['current', 'zIndexs'], value => value.concat(zIndexs))
                    .setIn(['current', 'isCrop'], false)
                })

    if (toQuestion) { // 生成习题
        blocks.forEach(block => {
            courseware = addQuestionToExercise(courseware, Map({blockId: block.get('id')}))
        })
    }

    return refreshZindex(courseware);
}

/**
 * 更改图片
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const changeBlockImage = (courseware, action) => {
    let {data} = action;

    data = scaleImage(data); // 防止图片过大的操作

    return updatePickedBlocks(courseware, block => {
        return block.mergeDeep(Map({
            url: data.get('imgUrl'),
            props: Map({
                size: Map({
                    width: data.get('width'),
                    height: data.get('height')
                })
            }),
            initHeight: data.get('initHeight'),
            initWidth: data.get('initWidth')
        }))
    })
}

/**
 * 图片正在加载
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleImageLoaded = (courseware, action) => {
    const {data} = action;
    const imgFragments = data.get('imgFragments');
    courseware = updateBlocks(courseware, blocks => {
        return blocks.map(block => {
            // 找到预加载图片元素的索引值
            const fragmentIndex = imgFragments.findIndex(fragment => fragment.get('blockId') === block.get('id'));
            if (fragmentIndex > -1) {
                return block.set('url', imgFragments.getIn([fragmentIndex, 'imgUrl']));
            }
            return block;
        })
    })
    return courseware
}

export {
    handleCancleCrop,
    handleCompleteCrop,
    changeBlockImage,
    handleImageLoaded
}
