/*
 *By Edward Cheng
 *Under GPLv2 Licence
 */

var _html = document.getElementsByTagName('html')[0];
var _dropContent = document.getElementById('drop-content');
var _droppable = document.getElementById('droppable');
var _background = document.getElementsByClassName('background')[0];
var _messageContent = document.getElementsByClassName('message')[0];
var _message = _messageContent.children[0];
var _options = document.getElementById('options-container');
var _changeBtn = document.getElementById('btn-change');

/*
 * From StackOverflow
 */

function convertImgToBase64(url, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.onload = function(){
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        // Clean up
        canvas = null;
    };
    img.crossOrigin = 'Anonymous';
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

/*
 * Save & load image from localStorage
 */

function saveImg(data) {
    localStorage['bg-img'] = data;
    localStorage['costom'] = 'true';
    setBackground(data);
}

function saveDefault() {
    localStorage['costom'] = 'false';
    _background.style.background = 'url(grid-bg.png) 50% 50%';
    _background.style.backgroundSize = 'initial';
    $._sizeOptions.selectlabel.text('Image Size');
    _background.style.backgroundRepeat = 'repeat';
    $._repeatOptions.selectlabel.text('Repeat Both');
    if(localStorage['costom'] == 'true'){
        $('#size-options').parent().fadeIn();
        $('#repeat-options').parent().fadeIn();
    }
    else 
    {
        $._sizeOptions.close();
        $._repeatOptions.close();
        $('#size-options').parent().fadeOut();
        $('#repeat-options').parent().fadeOut();
    }
}

function setBackground(data) {
    if(data)
        _background.style.background = '#fff url(' + data + ') 50% 50%';
    _background.style.backgroundSize = localStorage['size'];
    _background.style.backgroundRepeat = localStorage['repeat'];
    if(localStorage['costom'] == 'true'){
        $('#size-options').parent().fadeIn();
        $('#repeat-options').parent().fadeIn();
    }
    else 
    {
        $._sizeOptions.close();
        $._repeatOptions.close();
        $('#size-options').parent().fadeOut();
        $('#repeat-options').parent().fadeOut();
    }
}

if(localStorage['costom'] == undefined)
{
    localStorage['costom'] = 'false';
    localStorage['repeat'] = 'repeat';
    localStorage['size'] = 'initial';
}


switch(localStorage['repeat']) {
    case 'repeat':
        $('#repeat-options option[value=repeat]').attr('selected', 'selected');
        break;
    case 'repeat-x':
        $('#repeat-options option[value=repeat-x]').attr('selected', 'selected');
        break;
    case 'repeat-y':
        $('#repeat-options option[value=repeat-y]').attr('selected', 'selected');
        break;
    case 'no-repeat':
        $('#repeat-options option[value=no-repeat]').attr('selected', 'selected');
        break;
    }
    switch(localStorage['size']) {
    case 'initial':
        $('#size-options option[value=initial]').attr('selected', 'selected');
        break;
    case '100% 100%':
        $('#size-options option[value=stretching]').attr('selected', 'selected');
        break;
    case 'cover':
        $('#size-options option[value=cover]').attr('selected', 'selected');
        break;
}

/*
 * Show message
 */

function showMessage(message) {
    _messageContent.classList.remove('hide');
    setTimeout(function() {
        _messageContent.classList.add('hide');
    }, 800);
    _message.innerHTML = message;
}

function showOptions() {
    _html.classList.add('dropping');
    _dropContent.classList.add('dropping');
    _options.classList.add('active');
    _changeBtn.classList.add('hide');

}

function hideOptions() {
    _html.classList.remove('dropping');
    _dropContent.classList.remove('dropping');
    _options.classList.remove('active');
    _changeBtn.classList.remove('hide');
    $._sizeOptions.close();
    $._repeatOptions.close();
}

/*
 * Bind events
 */

_droppable.ondragover = function() {
    event.preventDefault();
    showOptions();
    return false;
};
_droppable.ondragend = function() {
    event.preventDefault();
    hideOptions();
    return false;
};
_droppable.ondrop = function(event) {
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
                else
                {
                    showMessage('Please drop a valid image url or image file.')
                }
            });
        }
        else
            showMessage('Please drop a valid image url or image file.')
    }
    else if(eventFiles != undefined)
    {
        console.log('get: files');
        var file = eventFiles[0];
        if(file.type.indexOf('image') == 0)
        {
            console.log('isImg');
            var reader = new FileReader();
            reader.onload = function(event) {
                saveImg(event.target.result);
            }
            reader.readAsDataURL(file);
        }
        else
            showMessage('Please drop a valid image url or image file.')
    }
    else
        showMessage('Please drop a valid image url or image file.')
    hideOptions();
    return false;
};

$(function() {
    $._repeatOptions = $('#repeat-options').dropdown({onOptionSelect: function(opt) {
        switch(opt.text())
        {
        case 'Repeat Both':
            localStorage['repeat'] = 'repeat';
            break;
        case 'Repeat X':
            localStorage['repeat'] = 'repeat-x';
            break;
        case 'Repeat Y':
            localStorage['repeat'] = 'repeat-y';
            break;
        case 'No Repeat':
            localStorage['repeat'] = 'no-repeat';
            break;
        }
        setBackground();
    }});
    $._sizeOptions = $('#size-options').dropdown({onOptionSelect: function(opt) {
        switch(opt.text())
        {
        case 'Image Size':
            localStorage['size'] = 'initial';
            break;
        case 'Stretching':
            localStorage['size'] = '100% 100%';
            break;
        case 'Cover':
            localStorage['size'] = 'cover';
            break;
        }
        setBackground();
    }});

    $('#btn-close').click(function() {
        hideOptions();
    });
    $('#btn-change').click(function() {
        showOptions();
    });
    $('#btn-default').click(function() {
        saveDefault();
    });

    if(localStorage['costom'] == 'true')
        setBackground(localStorage['bg-img']);
    else
    {
        $('#size-options').parent().fadeOut();
        $('#repeat-options').parent().fadeOut();
    }
});
