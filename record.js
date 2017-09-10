
class Record {
  constructor(props) {
    const p = Object.assign({
      continuous: false,
      interimResults: true,
      lang: 'ja-JP',
      infinity: false,
      maxAlternatives: 1
    }, props);
    const record = new window.webkitSpeechRecognition();
    record.continuous = p.continuous; // 連続で音声認識するか
    record.interimResults = p.interimResults; // trueなら途中で認識した場合onresultがfireされる
    record.lang = p.lang;
    record.maxAlternatives = p.maxAlternatives; // 候補数

    this.messages = [];
    this.nowRecordedMessages = [];
    this.recorded = false;

    record.onresult = e => {
      const results = e.results;
      for (let i = e.resultIndex; i< results.length; i++){
        if(results[i].isFinal) {
          this.messages.push(new Results(results[i]).getResult());
          this.nowRecordedMessages = [];
        } else {
          this.nowRecordedMessages = new Results(results[i]).getResult();
        }
      }
    };
    record.onsoundstart = e => {
      this.recorded = true;
    };
    record.onsoundend = e => {
      this.recorded = false;
    };
    this.record = record;
    console.log(this.record);
  }

  start() {
    this.record.start();
  }
  get alreadyStart() {
    return this.recorded;
  }
  stop() {
    this.record.stop();
  }
  get alreadyStop() {
    return !this.recorded;
  }

  static get canNotUse() {
    return !window.webkitSpeechRecognition;
  }
}

class Result {
  constructor(data) {
    this.confidence = data.confidence;
    this.message = data.transcript;
  }
}
class Results {
  constructor(results) {
    this.results = results;
  }
  getResult() {
    const r = [];
    for (let i = 0; i < this.results.length; i++) {
      r.push(new Result(this.results[i]));
    }
    return r.sort((result1, result2) => result2.confidence - result1.confidence);
  }
}