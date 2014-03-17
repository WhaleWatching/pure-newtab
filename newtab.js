// newtab.js

(function(window){

    window.newtab = {};

    newtab.init = function() {
        newtab.localizePage();

        newtab.html = $('html');
        newtab.background = $('.background');
        newtab.message = $('.message');
        newtab.dropLayer = $('#drop-layer');
        newtab.optionsContainer = $('#options-container');

        newtab.btnChange = $('#btn-change');
        newtab.btnDefault = $('#btn-default');
        newtab.btnClose = $('#btn-close');


        newtab.btnChange.click(function() {
            $('#welcome').fadeOut();
            $('#btn-change').removeClass('show');
            newtab.showOptions();
        });
        newtab.btnDefault.click(function() {
            newtab.setDefault();
        });
        newtab.btnClose.click(function() {
            newtab.hideOptions();
        });


        newtab.dropLayer[0].ondragover = function(event) {
            event.preventDefault();
            newtab.showOptions();
            return false;
        };
        newtab.dropLayer[0].ondragend = function(event) {
            event.preventDefault();
            newtab.hideOptions();
            return false;
        };
        newtab.dropLayer[0].ondrop = newtab.dropHandle;

        if(localStorage['costom'] == undefined)
        {
            localStorage['costom'] = 'false';
            localStorage['repeat'] = 'repeat';
            localStorage['size'] = 'initial';
            $('#welcome').fadeIn();
            $('#btn-change').addClass('show');
        }

        $('#repeat-options option[data=' + localStorage['repeat'] + ']').attr('selected', 'selected');
        $('#size-options option[data=' + localStorage['size'] + ']').attr('selected', 'selected');

        newtab.optionRepeat = $('#repeat-options').dropdown({onOptionSelect: function(opt) {
            localStorage['repeat'] = opt.attr('data');
            console.log(opt.attr('data'));
            newtab.setBackground();
        }});
        newtab.optionSize = $('#size-options').dropdown({onOptionSelect: function(opt) {
            localStorage['size'] = opt.attr('data');
            newtab.setBackground();
        }});

        if(localStorage['costom'] == 'false')
            newtab.setDefault();
        else
            newtab.setImg(localStorage['bg-img']);
    }

    newtab.setImg = function(base64Img) {
        localStorage['bg-img'] = base64Img;
        localStorage['costom'] = 'true';
        newtab.btnDefault.fadeIn();
        $('#size-options').parent().fadeIn();
        $('#repeat-options').parent().fadeIn();
        newtab.setBackground(base64Img);
    }

    newtab.setDefault = function() {
        newtab.background.css('background', 'url(grid-bg.png) 50% 50% repeat');
        newtab.background.css('background-size', 'initial');
        localStorage['costom'] = 'false';
        newtab.btnDefault.fadeOut();
        $('#size-options').parent().fadeOut();
        $('#repeat-options').parent().fadeOut();
    }

    newtab.setBackground = function(base64Img) {
        if(base64Img)
        {
            newtab.background.css('background', '#fff url(' + base64Img + ') 50% 50%');
        }
        newtab.background.css('background-size', localStorage['size']);
        newtab.background.css('background-repeat', localStorage['repeat']);
    }

    newtab.showOptions = function() {
        newtab.html.addClass('dropping');
        newtab.optionsContainer.addClass('active');
        newtab.btnChange.addClass('hide');
    }

    newtab.hideOptions = function() {
        newtab.html.removeClass('dropping');
        newtab.optionsContainer.removeClass('active');
        newtab.btnChange.removeClass('hide');
        newtab.optionRepeat.close();
        newtab.optionSize.close();
    }

    newtab.dropError = function() {
        newtab.sendMessage(chrome.i18n.getMessage('error_drop'));
    }

    newtab.dropHandle = function(event) {
        event.preventDefault();
        var eventText = event.dataTransfer.getData('Text');
        var eventFiles = event.dataTransfer.files;
        if(eventText.length != 0)
        {
            console.log('get: string');
            console.log('eventText: ' + eventText);
            //If its base64 encode:
            if(eventText.match('data:image/') && eventText.match('base64'))
            {
                console.log('check: base64');
                newtab.setImg(eventText);
            }
            //If its an url of a image
            else if(newtab.isURL(eventText))
            {
                console.log('check: URL');
                newtab.convertImgToBase64(eventText, function(base64Img) {
                    if(base64Img.length != 0)
                    {
                        newtab.setImg(base64Img);
                    }
                    else
                    {
                        newtab.dropError();
                    }
                });
            }
            else
                newtab.dropError();
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
                    newtab.setImg(event.target.result);
                }
                reader.readAsDataURL(file);
            }
            else
                newtab.dropError();
        }
        else
            newtab.dropError();
        newtab.hideOptions();
        return false;
    }

    newtab.sendMessage = function(messageStr) {
        newtab.message.removeClass('hide');
        newtab.message.children().text(messageStr);
        setTimeout(function() {
            newtab.message.addClass('hide');
        }, 800);
    }

    newtab.convertImgToBase64 = function(url, callback, outputFormat){
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

    newtab.isURL = function(str) {
        var pattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/); // fragment locater
        if(!pattern.test(str)) {
            return false;
        } else {
            return true;
        }
    }

    newtab.localizePage = function() {
        $("[i18n]:not(.i18n-replaced)").each(function() {
            $(this).text(chrome.i18n.getMessage($(this).attr("i18n")));
        });
        $("[i18n_value]:not(.i18n-replaced)").each(function() {
            $(this).val(chrome.i18n.getMessage($(this).attr("i18n_value")));
        });
        $("[i18n_title]:not(.i18n-replaced)").each(function() {
            $(this).attr("title", chrome.i18n.getMessage($(this).attr("i18n_title")));
        });
        $("[i18n_placeholder]:not(.i18n-replaced)").each(function() {
            $(this).attr("placeholder", chrome.i18n.getMessage($(this).attr("i18n_placeholder")));
        });
        $("[i18n_replacement_el]:not(.i18n-replaced)").each(function() {
            // Replace a dummy <a/> inside of localized text with a real element.
            // Give the real element the same text as the dummy link.
            var dummy_link = $("a", this);
            var text = dummy_link.text();
            var real_el = $("#" + $(this).attr("i18n_replacement_el"));
            real_el.text(text).val(text).replaceAll(dummy_link);
            // If localizePage is run again, don't let the [i18n] code above
            // clobber our work
            $(this).addClass("i18n-replaced");
        });
    }

    $(function(window){
        newtab.init();
    });

}(window));