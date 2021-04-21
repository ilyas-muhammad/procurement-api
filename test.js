function slowestKey(keyTimes) {
  // Write your code here
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const alphabetArrays = alphabet.split('');
  let totalTimeSpent = 0;

  const keys = keyTimes.map(([alphabetIndex, time]) => {
      const char = alphabetArrays[alphabetIndex];
      const duration = time - totalTimeSpent;
      
      totalTimeSpent = time;
      
      return {
        char, 
        duration
      };
  });

  const slowestKey = keys.reduce((result, key) => {
    if (result === null) {
      return key;
    }
    
    return key.duration > result.duration ? key : result;
  }, null);

  return slowestKey;
}

slowestKey([
  [0, 2],
  [1,5],
  [0,9],
  [2,15],
])