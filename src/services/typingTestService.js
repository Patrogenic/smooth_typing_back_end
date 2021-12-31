const TypingTest = require('../models/typingTest')

const { body, validationResult } = require("express-validator");


const saveTypingTest = () => {

}

const analyzeData = [
  body('text', 'text required').trim().isLength({min: 1}), //not escaped
  body('typedText.*.char', 'typedText[].char is not length 1').isLength({ min: 1, max: 1 }),
  body('typedText.*.time', 'typedText[].time is not numeric').isNumeric(),

  async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      res.json(errors);
    }else{
      let text = req.body.text.split("");
      let typedText = req.body.typedText;
      const seqLen = 4;

      let mistakeData = getMistakeData(typedText.map(item => item.char), text);
      let charSequencesMap = buildCharSequencesMap(typedText, text, seqLen);
      let sequences = getBestAndWorstSequences(charSequencesMap);

      //after calculations, I save to database if there is a valid authtoken provided, in both cases the server responds with the new calculations
      res.status(200).json({ mistakeData, bestSequences: sequences.best, worstSequences: sequences.worst });
    }
  }
]



//TODO
//consider filtering out strings that include spaces for best strings
//a possibility is that I can return five best strings including sequences with spaces, and five best that don't include sequences with spaces

//for worst strings, I can filter out the worst strings if mistakeData.actual.includes(sequenceList[i]), and then filter it out
//this seems like a good way of filtering out the worst strings which are also synonymous with mistakes
//if need be I can make the expected strings include more characters on each side of the mistake
const getBestAndWorstSequences = (seqMap) => {
  let sequenceList = sortMap(seqMap);
  let best = [];
  let worst = [];

  if(sequenceList.length >= 5 && sequenceList.length <= 9){
    best = sequenceList.slice(0, 5);
    worst = sequenceList.slice(5).reverse();
  }else if(sequenceList.length <= 4){
    best = sequenceList.slice(0, 5);
  }else if(sequenceList.length >= 10){
    best = sequenceList.slice(0, 5);
    worst = sequenceList.slice(-5).reverse();
  }

  return { best, worst };
}

const sortMap = (seqMap) => {
  let sequenceList = [];

  //convert map into an array for sorting
  for(const seq in seqMap){
    sequenceList.push({ ...seqMap[seq], seq });
  }

  const compare = (a, b) => {
    if ( a.avgTime < b.avgTime ){
      return -1;
    }
    if ( a.avgTime > b.avgTime ){
      return 1;
    }
    return 0;
  }

  sequenceList.sort(compare);

  return sequenceList;
}

//edge cases will need to checked (it might be fine if this function starts the iterators at 0)
//I will need to do boundary checking for the slice methods on the arrays
//this will need to be refactored
const getMistakeData = (typedTextChars, text) => {
  let mistakeData = [];
  let i = 1;
  let j = 1;

  while(j < text.length){

    let currMistake = "";
    let startIndex = null;

    while(typedTextChars[i] != text[j] && i < typedTextChars.length){
      if(!currMistake){
        startIndex = i;
      }
      currMistake += typedTextChars[i];
      typedTextChars.splice(i, 1);
    }

    if(startIndex !== null){
      let actual;
      let expected;
      if(startIndex < 3){
        actual = typedTextChars.slice(startIndex - 1, startIndex).join('') + currMistake + typedTextChars.slice(i, i + 4).join('');
        expected = text.slice(0, startIndex + 5 - 1).join('');
      }else{
        actual = typedTextChars.slice(startIndex - 2, startIndex).join('') + currMistake + text.slice(i, i + 3).join('');
        expected = text.slice(startIndex - 2, startIndex + 3).join('');
      }

      let mistake = {
        actual,
        expected,
      };
      mistakeData.push(mistake);
    }

    i++;
    j++;
  }

  return mistakeData;
}

//causes side effects to typedText
//will probably need to refactor at some point
//what is the behavior if the first or last character is incorrect?
const buildCharSequencesMap = (typedText, text, seqLen) => {
  let charSequences = {};

  let i = 1;
  let j = 1;

  while(typedText[1].char !== text[1]){
    typedText.splice(1, 1);
  }
  
  while(j < text.length - seqLen){

    let mistakeTime = 0;

    while(typedText[i + seqLen - 1].char !== text[j + seqLen - 1]){
      mistakeTime += typedText[i + seqLen - 1].time;
      typedText.splice(i + seqLen - 1, 1);
    }
    
    typedText[i + seqLen - 1].time += mistakeTime;

    let slicedTypedText = typedText.slice(i, i + seqLen);
    let currSeq = buildSequence(slicedTypedText);

    if(!charSequences[currSeq]){
      charSequences[currSeq] = {};
      charSequences[currSeq].avgTime = calcAvgTime(slicedTypedText, charSequences, true);
      charSequences[currSeq].instances = 1;
    }else{
      charSequences[currSeq].avgTime = calcAvgTime(slicedTypedText, charSequences[currSeq], false);
      charSequences[currSeq].instances++;
    }

    i++;
    j++;
  }

  return charSequences;
}

const buildSequence = (typedText) => {
  return typedText.reduce((seq, currTypedText) => { return { char: seq.char + currTypedText.char }}).char;
}

const addTimes = (typedText) => {
  return typedText.reduce((time, currTypedText) => { return { time: time.time + currTypedText.time }}).time;
}

const calcAvgTime = (typedText, charSequence, isFirstInstance) => {
  let avgTime = 0;

  if(isFirstInstance){
    avgTime = addTimes(typedText);
  }else{
    let stringTime = addTimes(typedText);
    avgTime = ((charSequence.instances * charSequence.avgTime) + stringTime) / (charSequence.instances + 1);
  }

  return avgTime;
}

module.exports = {
  analyzeData,
  exportedForTesting: {
    getBestAndWorstSequences,
    sortMap,
    getMistakeData,
    buildCharSequencesMap,
    buildSequence,
    addTimes,
    calcAvgTime,
  }
}

// exports.exportedForTesting = {
//   getBestAndWorstSequences,
//   sortMap,
//   getMistakeData,
//   buildCharSequencesMap,
//   buildSequence,
//   addTimes,
//   calcAvgTime,
// }
