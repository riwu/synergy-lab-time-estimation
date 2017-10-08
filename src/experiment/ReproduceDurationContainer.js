import { connect } from 'react-redux';
import ReproduceDuration from './ReproduceDuration';
import { updateAnswer } from '../actions';

const mapDispatchToProps = dispatch => ({
  updateDuration: answer => dispatch(updateAnswer({
    header: 'Experiment',
    answer: {
      answer,
    },
  })),
});

export default connect(
  null,
  mapDispatchToProps,
)(ReproduceDuration);