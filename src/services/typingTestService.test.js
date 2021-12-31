global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const typingTestService = require('./typingTestService').exportedForTesting;


const typedTextLastCharMistake = [
  {
      char: "s",
      time: 0
  },
  {
      char: "o",
      time: 50
  },
  {
      char: "m",
      time: 75
  },
  {
      char: "m",
      time: 100
  },
  {
      char: "e",
      time: 150
  }
]

const typedTextFirstCharMistake = [
  {
      char: "s",
      time: 0
  },
  {
      char: "s",
      time: 50
  },
  {
      char: "o",
      time: 75
  },
  {
      char: "m",
      time: 100
  },
  {
      char: "e",
      time: 150
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
  describe('#buildCharSequencesMap', () => {
    it('should return proper map when last char is a mistake', () => {
      let sequences = typingTestService.buildCharSequencesMap(typedTextLastCharMistake, text, 2);
      expect(sequences["me"]).toEqual({ avgTime: 325, instances: 1 });
      expect(sequences["om"]).toEqual({ avgTime: 125, instances: 1 });
    });
    it('should return proper map when first char is a mistake', () => {
      let sequences = typingTestService.buildCharSequencesMap(typedTextFirstCharMistake, text, 2);
      expect(sequences["me"]).toEqual({ avgTime: 250, instances: 1 });
      expect(sequences["om"]).toEqual({ avgTime: 175, instances: 1 });
    });
  });
  describe('#getMistakeData', () => {
    it('should get mistake data from middle of string', () => {
      let mistakeData = typingTestService.getMistakeData("welccome", "welcome");
      expect(mistakeData[0].actual).toBe("lccome");
      expect(mistakeData[0].expected).toBe("lcome");
    });
    it('should get mistake data from first char', () => {
      let mistakeData = typingTestService.getMistakeData("awelcome", "welcome");
      expect(mistakeData[0].actual).toBe("awelco");
      expect(mistakeData[0].expected).toBe("welco");
    });
    it('should get mistake data from second char', () => {
      let mistakeData = typingTestService.getMistakeData("weelcome", "welcome");
      expect(mistakeData[0].actual).toBe("weelcom");
      expect(mistakeData[0].expected).toBe("welcom");
    });
    it('should get mistake data from last char', () => {
      let mistakeData = typingTestService.getMistakeData("welcomme", "welcome");
      expect(mistakeData[0].actual).toBe("omme");
      expect(mistakeData[0].expected).toBe("ome");
    });
    it('should get mistake data from second to last char', () => {
      let mistakeData = typingTestService.getMistakeData("welcoome", "welcome");
      expect(mistakeData[0].actual).toBe("coome");
      expect(mistakeData[0].expected).toBe("come");
    });
  });
});