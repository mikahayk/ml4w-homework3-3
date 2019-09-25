const myImageModelURL = 'https://storage.googleapis.com/teachable-machine-pubilshed-models/0a4cf778-26dc-448e-8ffe-5e4b2a390ad0/model.json';
let myImageModel;
let resultDiv;
let video;
let serial;          // variable to hold an instance of the serialport library
let portName = '/dev/tty.usbmodem141401'; // fill in your serial port name here
let outByte = 0;
let isLedOn = false;

function preload() {
  video = createCapture(VIDEO);
  //mySoundModel = ml5.soundClassifier(mySoundModelURL);
  myImageModel = ml5.imageClassifier(myImageModelURL);
}

function setup() {
  resultDiv = createElement('h1',  '...');
  serial = new p5.SerialPort();    // make a new instance of the serialport library
  serial.on('error', serialError); // callback for errors
  serial.open(portName);           // open a serial port
  myImageModel.classify(video, gotResults);

}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function gotResults(err, results) {
  if (err) console.log(err);
  if (results) {
    console.log(results);
    resultDiv.html('Result is: ' + results[0].label);

// nocup = 1
// cup = 0

  if(results[0].confidence > 0.8) {
    if (results[0].label === 0 && isLedOn == false) {
      outByte = 255;
      isLedOn = true;
      console.log('outByte: ', outByte)
      serial.write(outByte);
    }
    else if (results[0].label === 1  && isLedOn == true) {
      outByte = 0;
      isLedOn = false;
      console.log('outByte: ', outByte)
      serial.write(outByte);
    }
  }


    myImageModel.classify(video, gotResults);
  }
}
