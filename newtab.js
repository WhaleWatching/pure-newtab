
var html = document.getElementsByTagName('html')[0];
var dragContent = document.getElementById('drag-content');
var background = document.getElementsByClassName('background')[0];

function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.onload = function(){
        img.crossOrigin = 'Anonymous';
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        // Clean up
        canvas = null; 
    };
    img.src = url;
}

function isURL(str) {
    var pattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/); // fragment locater
    if(!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}

if(localStorage['costom'] == undefined)
    localStorage['costom'] = false;

function saveImg(data) {
    localStorage['bg-img'] = data;
    localStorage['costom'] = true;
    setBackground(data);
}

function saveDefault() {
    localStorage['costom'] = false;
}

function setBackground(data) {
    background.style.background = 'url(' + data + ') 50% 50%';
}

if(localStorage['costom'] == 'true')
{
    setBackground(localStorage['bg-img']);
}

document.getElementsByClassName('tips')[0].onselectstart = function() {
    return false;
}
dragContent.ondragover = function() {
    event.preventDefault();
    html.classList.add('dropping');
    dragContent.classList.add('dropping');
    return false;
};
dragContent.ondragend = function() {
    event.preventDefault();
    html.classList.remove('dropping');
    dragContent.classList.remove('dropping');
    return false;
};
dragContent.ondrop = function(event) {
    event.preventDefault();
    eventText = event.dataTransfer.getData('Text');
    eventFiles = event.dataTransfer.files;
    if(eventText.length != 0)
    {
        console.log('get: string');
        console.log('eventText: ' + eventText);
        //If its base64 encode:
        if(eventText.match('data:image/') && eventText.match('base64'))
        {
            console.log('check: base64');
            saveImg(eventText);
        }
        //If its an url of a image
        else if(isURL(eventText))
        {
            console.log('check: URL');
            convertImgToBase64(eventText, function(base64Img) {
                if(base64Img.length != 0)
                {
                    saveImg(base64Img);
                }
            });
        }
        else
            console.log('check: failed');
    }
    else if(eventFiles != undefined)
    {
        console.log('get: files');
        var file = eventFiles[0];
        if(file.type.indexOf('image') == 0)
            console.log('isImg');
        else
            console.log('notImg');
        var reader = new FileReader();
        reader.onload = function(event) {
            saveImg(event.target.result);
        }
        reader.readAsDataURL(file);
    }
    html.classList.remove('dropping');
    dragContent.classList.remove('dropping');
    return false;
};