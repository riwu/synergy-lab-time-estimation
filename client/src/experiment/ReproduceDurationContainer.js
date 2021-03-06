import { connect } from 'react-redux';
import ReproduceDuration from './ReproduceDuration';
import { updateExperimentRound, experimentWarned } from '../actions';
import { schedule } from '../experiment/getMatchingSchedule';

const mapStateToProps = (state) => {
  const currentSchedule = state.notificationSchedule[schedule] || {};
  return {
    startTime: currentSchedule.startTime,
    state,
    hasWarned: currentSchedule.warned,
    answers: state.experimentRounds[schedule],
  };
};

const mapDispatchToProps = dispatch => ({
  updateDuration: (answer) => {
    dispatch(updateExperimentRound(
      schedule,
      answer,
    ));
  },
  experimentWarned: () => dispatch(experimentWarned(schedule)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReproduceDuration);
