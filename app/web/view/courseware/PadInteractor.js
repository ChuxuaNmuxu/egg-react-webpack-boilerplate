import Reveal from 'reveal.js';
// let reveal = {}
import {Map, fromJS} from 'immutable';
import {isString} from 'lodash';

/**
 * 与平板交互器
 * TODO：
 * 1. 调用平板代码及测试
 */
class PadInteractor {
    prevSlideIndex = 0; // 切换之前的卡片index
    slideIndex = 0; // 当前卡片index
    data; // 课件数据

    constructor (data, options = {}) {
        // Reveal = require('reveal.js').default;
        this.data = Map.isMap(data) ? data : fromJS(data);
        this.options = options;
        this.init();
    }

    /**
     * 绑定事件
     */
    bindEvent () {
        ['slidechanged', 'fragmentshown', 'fragmenthidden'].forEach(type => {
            Reveal.addEventListener(type, e => this.handleEvent(e));
        });
        this.options.onInit && this.options.onInit();
    }

    init () {
        this.bindEvent();
        this.notifyFirstToPad();
    }

    /**
     * 通知第一页数据给平板
     */
    notifyFirstToPad () {
        const sync = {
            slideIndex: 0,
            fragmentIndex: -1
        }
        // 取练习
        const slideId = this.data.getIn(['slides', 0, 'id']);
        const questionBlocks = this.getQuestionBlocksFromSlide(slideId);
        const exercise = this.getExerciseByQuestionBlocks(questionBlocks);
        this.notifyPad(sync, exercise);
    }

    /**
     * 处理事件
     * @param {*} e reveal事件
     */
    handleEvent (e) {
        console.log(30, e)
        const {dataset: {slideId, fragmentIndex}} = e.fragment || e.currentSlide;
        this.prevSlideIndex = this.slideIndex;
        this.slideIndex = this.data.get('slides').findIndex(slide => slide.get('id') === slideId);
        const sync = {
            slideIndex: this.slideIndex
        }
        if (e.type === 'fragmentshown') {
            sync.fragmentIndex = parseInt(fragmentIndex);
        } else if (e.type === 'fragmenthidden') {
            sync.fragmentIndex = parseInt(fragmentIndex) - 1;
        } else {
            sync.fragmentIndex = this.slideIndex > this.prevSlideIndex ? -1 : Number.MAX_VALUE;
        }
        // 取练习
        const questionBlocks = e.type === 'slidechanged' ? this.getQuestionBlocksFromSlide(slideId) : this.getQuestionBlocksFromFragments(e);
        const exercise = this.getExerciseByQuestionBlocks(questionBlocks);
        // 通知平板
        this.notifyPad(sync, exercise);
    }

    /**
     * 从slide中获取练习
     * @param {*} slideId
     */
    getQuestionBlocksFromSlide (slideId) {
        const slide = this.data.get('slides').find(slide => slide.get('id') === slideId);
        // 找非fragment题目块
        return slide.get('blocks')
            .filter(block => block.get('isQuestion') && block.getIn(['props', 'animation', 'triggle']) !== 'click')
            .flatMap(block => [block.get('id')]);
    }

    /**
     * 从fragments中获取练习
     * @param {*} e reveal事件
     */
    getQuestionBlocksFromFragments (e) {
        let questionBlocks;
        if (e.type === 'fragmentshown') {
            // 找当前显示的fragment中的题目
            questionBlocks = e.fragments.map(fragment => {
                const {dataset} = fragment;
                if (dataset.blockIsQuestion === 'true') {
                    return dataset.blockId;
                }
            }).filter(item => item);
            questionBlocks = fromJS(questionBlocks);
        } else {
            const fragmentIndex = parseInt(e.fragment.dataset.fragmentIndex);
            const {slideId} = e.fragment.dataset;
            if (fragmentIndex > 0) {
                // 取上批次的fragments练习
                console.log(78, slideId, fragmentIndex);
                const allFragments = this.data
                    .get('slides')
                    .find(slide => slide.get('id') === slideId)
                    .get('blocks')
                    .filter(block => block.getIn(['props', 'animation', 'triggle']) === 'click')
                    .groupBy(block => block.getIn(['props', 'animation', 'index']));
                const prevFragments = allFragments.toList().get(fragmentIndex - 1);
                questionBlocks = prevFragments
                    .filter(block => block.get('isQuestion'))
                    .flatMap(block => [block.get('id')])
            } else {
                // 取slide中的非fragment练习
                questionBlocks = this.getQuestionBlocksFromSlide(slideId)
            }
        }
        return questionBlocks;
    }

    /**
     * 根据练习块获取练习及对应的题目
     * @param {*} questionBlocks 题目块数据[blockId, blockId]
     */
    getExerciseByQuestionBlocks (questionBlocks) {
        console.log(131, questionBlocks)
        if (!(questionBlocks && questionBlocks.size)) {
            return null;
        }
        const exercises = this.data.get('exercises');
        const exercise = exercises.find(exercise => exercise.get('questions').flatMap(question => [question.get('blockId')]).isSuperset(questionBlocks));
        return exercise.update('questions', questions => questions.filter(question => questionBlocks.indexOf(question.get('blockId')) > -1));
    }

    /**
     * 通知平板
     * @param {*} exercise 练习数据
     */
    notifyPad (sync, exercise) {
        console.log(46, '通知平板', sync, exercise && exercise.toJS())
        this.options.onChange && this.options.onChange(sync, exercise)
    }

    /**
     * 同步播放
     * @param {*} sync 同步信息
     */
    static sync (sync) {
        console.log(121, sync)
        sync = isString(sync) ? JSON.parse(sync) : sync;
        const {slideIndex, fragmentIndex} = sync;
        Reveal.slide(slideIndex, 0, fragmentIndex === undefined ? -1 : fragmentIndex);
    }
}

export default PadInteractor;
