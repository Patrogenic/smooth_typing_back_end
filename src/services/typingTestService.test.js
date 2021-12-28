global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const typingTestService = require('./typingTestService').exportedForTesting;


const typedText = [
  {
      char: "s",
      time: 0
  },
  {
      char: "o",
      time: 86
  },
  {
      char: "m",
      time: 174
  },
  {
      char: "m",
      time: 174
  },
  {
      char: "e",
      time: 123
  }
]

const text = "some";


describe('typingTestService', () => {
  describe('#addTimes', () => {
    it('should add up all the .time properties of the objects in the typedText array and return the total', () => {
      let typedText = [{ time: 100 }, { time: 100}];
      let addedTimes = typingTestService.addTimes(typedText);
      expect(addedTimes).toBe(200);
    });
  });
  describe('#calcAvgTime', () => {
    let typedText;
    let charSequence;
    let isFirstInstance;

    beforeEach(() => {
      typedText = [{ time: 100 }, { time: 100}];
      charSequence = undefined;
      isFirstInstance = false;
    });

    it('should return the result of calling addTimes(typedText) when' + 
      ' this is the first instance of the given character sequence', () => {
      charSequence = {};
      isFirstInstance = true;

      let avgTime = typingTestService.calcAvgTime(typedText, charSequence, isFirstInstance);
      expect(avgTime).toBe(200);
    });
    // (100 + 200) / 2 = 150
    it('should find new average time of current charSequence when .instances = 1', () => {
      charSequence = { instances: 1, avgTime: 100 };

      let avgTime = typingTestService.calcAvgTime(typedText, charSequence, isFirstInstance);
      expect(avgTime).toBe(150);
    });
    // ((3 * 100) + 200) / (3 + 1) = 125
    it('should find new average time of current charSequence when .instances = 3', () => {
      charSequence = { instances: 3, avgTime: 100 };

      let avgTime = typingTestService.calcAvgTime(typedText, charSequence, isFirstInstance);
      expect(avgTime).toBe(125);
    });
  });
});