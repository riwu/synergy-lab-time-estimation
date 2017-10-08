import { connect } from 'react-redux';
import ReadyTransition from './ReadyTransition';
import { updateAnswer } from '../actions';

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateDuration: answer => dispatch(updateAnswer({
    header: 'Experiment',
    answer: {
      round: ownProps.roundNum,
      ...answer,
    },
  })),
});

export default connect(
  null,
  mapDispatchToProps,
)(ReadyTransition);