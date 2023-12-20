// sharedVariables.js
import {Howl, Howler} from 'howler';


// Tạo module để quản lý biến toàn cục chung
var sharedVariables = (function() {
    var sharedData = new Howl({
        src: './song/thang-nam.mp3',
        format: 'mp3',
        autoplay: false,
        html5: true,
    });
  
    return {
        getSound: function() {
            return sharedData;
        },
        setSound: function(sound) {
            sharedData = sound;
        },

    };
  })();
  
  export default sharedVariables;