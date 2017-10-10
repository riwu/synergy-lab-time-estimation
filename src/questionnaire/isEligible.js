const isBetween = (value, min, max) => value >= min && value <= max;

const isEligible = answers =>
  answers['QUESTION 2'].index !== 2 &&
  answers['QUESTION 3'].index === 0 &&
  answers['QUESTION 4'].index === 2 &&
  isBetween(Number(answers['QUESTION 11']), 21, 35) &&
  ['3-6 months', '>6 months'].includes(answers['QUESTION 16'][1]);

export default isEligible;