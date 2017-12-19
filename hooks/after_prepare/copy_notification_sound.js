#!/usr/bin/env node

const filestocopy = [{
  "resources/onesignal_default_sound.wav":
	"platforms/android/res/raw/pushsound.wav"
}];

const fs = require('fs');
const path = require('path');
const mkdirSync = function (dirPath) {
  try {
	fs.mkdirSync(dirPath);
  } catch (err) {
    // console.log(err);
  }
};

// no need to configure below
const rootdir = process.argv[2];

filestocopy.forEach(function(obj) {
  Object.keys(obj).forEach(function(key) {
	let val = obj[key];
	let srcfile = path.join(rootdir, key);
	let destfile = path.join(rootdir, val);
	//console.log("copying "+srcfile+" to "+destfile);
	let destdir = path.dirname(destfile);
	if (!fs.existsSync(destdir)) {
	  mkdirSync(destdir);
	}
	if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
	  fs.createReadStream(srcfile).pipe(
		fs.createWriteStream(destfile));
	}
  });
});
