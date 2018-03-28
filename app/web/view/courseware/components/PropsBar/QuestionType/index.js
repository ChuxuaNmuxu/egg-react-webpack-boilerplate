import Single from './Single';
import Match from './Match';
import Subjective from './Subjective';
import TrueOrFalse from './TrueOrFalse';
import Multiple from './Multiple'

const questionType = {
    single: {
        component: Single
    },
    match: {
        component: Match
    },
    subjective: {
        component: Subjective
    },
    trueOrFalse: {
        component: TrueOrFalse
    },
    multiple: {
        component: Multiple
    }
}

export default questionType;
