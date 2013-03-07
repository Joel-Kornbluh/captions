/**
 * Captions
 *
 * A lightweight jQuery plugin which provides a simple interface to dynamically add / animate captions of text over images/elements. 
 *
 * @package		Captions
 * @author		Joel-Kornbluh
 * @copyright           Copyright (c) 2012 - 2013.
 * @license		http://opensource.org/licenses/GPL-3.0
 * @link		https://github.com/Joel-Kornbluh/captions
 * @since		Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * Captions - jQuery plugin
 *
 * @package		Captions
 * @category            animation
 * @author		Joel-Kornbluh
 * @link
 */



(function($){

    $.fn.captions = function(o){
	
        //captions animates a caption of text over an image or element
        //you pass as an argument a string of text / html or an array of strings
        //or you can an options object as it's only argument
        //you can specify one or more of the following :
        //text - REQUIRED [default = '']: the text of the caption as a string or an array of strings as text or html
        //offsetX [default = 50]: the horizontal offset of the caption from its parent's top left
        //offsetY [default = 50]: the vertical offset of the caption from its parent's top left
        //direction [default = 'rtl']: in which direction the text should fly, available options are: 'rtl', 'ltr', 'ttb' and 'btt'
        //sideBySide [default = false]: if the given text is an array of strings, should they appear side by side? or one on top the other
        //bounce [default = true]: should the text give a little bounce before the animation ends?
        //time [default = 800]: time - in ms - the animation should last
        //interval [default = 200]: for arrays, the time interval - in ms - between one caption and the next
        //className [default = '']: a class name that should be aplied to all captions, usefull for later removel of this caption
        //multiple [default = false]: want the whole caption should animate at once? or every character should be handeld seperately,
        //
        //NOTE: if you set 'multiple' to true, the 'time' and 'interval' options will be applied for every single character, 
        //you can use 'multiInterval' to set intervals between captions
        //
        //multiInterval[default = 800] if multiple = true and text is an array of captions, specify an interval in ms between captions
    
        var defaultOptions = {
            text:'',
            offsetX:50,
            offsetY:50,
            direction:'rtl',
            sideBySide:false,
            time:800,
            interval:200,
            bounce:true,
            multiple:false,
            multiInterval:800,
            className:'',
            //for internal use
            multi:false
        };
        
        //check if only the string of text was supplied
        if(typeof o === 'string' || Object.prototype.toString.call(o) === '[object Array]'){
            o = {text:o};
        }
        
        //merge defaultOptions with user supplied options
        o = jQuery.extend({},defaultOptions,o);
        o.className += ' captions';
    
        //check if element have id
        var eltID = this.attr('id') || 'captions-' + randomID++;
        this.attr('id',eltID);
        
        var elt = $('#' + eltID), captions = [], height = elt.innerHeight(), width = elt.innerWidth();
	
        //for internal use
        if(o.multi){
            captions.cycle++;
        }
	
        //sheck howmuch captions we have, and if multiple is true, howmuch characters
        if(typeof o.text == 'object' && o.text.length){
		
            if(o.multiple){
			
                prevCaptionWidth = 0;
                prevCaptionHeight = 0;
			
                for(i = 0; i < o.text.length; i++){
				
                    captions.temp[i] = {
                        'text':o.text[i],
                        'offsetX':o.offsetX + prevCaptionWidth,
                        'offsetY':o.offsetY + prevCaptionHeight
                    }
				
                    //temporarly append it to element to check width and height
                    $('<span>',{
                        html:o.text[i],
                        id:'tempCaption',
                        class:o.className,
                        css:{
                            'display':'none'
                        }
                    }).appendTo(o.elt);
				
                    //if sideBySide, add the previous width to the offsetX of the next caption
                    if(sideBySide){
                        prevCaptionWidth += $('#tempCaption').innerWidth();
                    } else {
                        prevCaptionHeight += $('#tempCaption').innerHeight()
                    }
				
                    $('#tempCaption').remove()
				
                    //call function for each caption, with tme interval of multiInterval between them
                    captions.cycles[i] = setTimeout(function(){
                        captions({
                            text:captions.temp[captions.cycle].text,
                            elt:eltID,
                            offsetX:captions.temp[captions.cycle].offsetX,
                            offsetY:captions.temp[captions.cycle].offsetY,
                            direction:direction,
                            sideBySide:true,
                            bounce:bounce,
                            time:time,
                            interval:interval,
                            className:o['className'],
                            multiple:true,
                            multi:true
                        })
                    },(i * multiInterval))
                }
			
                //and exit the current function call
                return;
            }
		
            for(i = 0; i < text.length; i++){
                captions.push($('<span>',{
                    html:text[i]
                }));
            }
		
        } else if(multiple) {
		
            sideBySide = true;
		
            for(i = 0; i < text.length; i++){
                captions.push($('<span>',{
                    html:text[i]
                }));
            }
		
        } else {
            captions.push($('<span>',{
                html:text
            }));
        }
	
        //check if parent element properly positioned
        if(elt.css('position') == 'static'){
            elt.css('position','relative')
        }
	
        //bounce should default to true, so check explicitly for it
        if(bounce !== false){
            bounce = true;
        }
	
        //check if there is multiple captions
        for(i = 0; i < captions.length; i++){
            captions[i].appendTo(elt).addClass(className).css({
                opacity:0,
                position:'absolute',
                top:0,
                left:0
			
            })
        }
	
        //temporarly used if sideBySide is true
        var prevWidth = 0;
	
        switch(direction){
		
            case 'rtl' : {
                $(captions).each(function(index){
						
                    caption = $(this);
				
                    if(sideBySide){
                        caption.css('top',offsetY)
                    } else {
                        caption.css('top',function(){
                            return (offsetY + index * caption.innerHeight());
                        })
                    }
				
                    var from = elt.innerWidth();
                    var to = offsetX + prevWidth;
				
                    if(sideBySide){
                        prevWidth += caption.innerWidth();
                    }
				
                    setTimeout(function(){
                        captions.move((captions[index]),from,to,'X',time,bounce)
                    },index * interval)
                })			
            }
            break;
		
            case 'ltr' : {
                $(captions).each(function(index){
				
                    caption = $(this);
				
                    if(sideBySide){
                        caption.css('top',offsetY)
                    } else {
                        caption.css('top',function(){
                            return (offsetY + index * caption.innerHeight());
                        })
                    }
				
                    var from = 0 - caption.innerWidth();
                    var to = offsetX + prevWidth;
				
                    if(sideBySide){
                        prevWidth += caption.innerWidth();
                    }
				
                    setTimeout(function(){
                        captions.move((captions[index]),from,to,'X',time,bounce)
                    },index * interval)
                })
            }
            break;
		
            case 'ttb' : {
                $(captions).each(function(index){
				
                    caption = $(this);
				
                    caption.css('left',offsetX + prevWidth)
                    var from = 0 - caption.innerHeight();
				
                    if(sideBySide){
                        var to = offsetY;
                    } else {
                        var to = offsetY + index * caption.innerHeight();
                    }
				
                    if(sideBySide){
                        prevWidth += caption.innerWidth();
                    }
				
                    setTimeout(function(){
                        captions.move((captions[index]),from,to,'Y',time,bounce)
                    },index * interval)
                })
            }
            break;
		
            case 'btt' : {
                $(captions).each(function(index){
				
                    caption = $(this);
				
                    caption.css('left',offsetX + prevWidth)
                    var from = elt.innerHeight() + caption.innerHeight();
				
                    if(sideBySide){
                        var to = offsetY;
                    } else {
                        var to = offsetY + index * caption.innerHeight();
                    }
				
                    if(sideBySide){
                        prevWidth += caption.innerWidth();
                    }
				
                    setTimeout(function(){
                        captions.move((captions[index]),from,to,'Y',time,bounce)
                    },index * interval)
                })
            }
            break;
		
            default : {
			
                }
        }
    }
    
    captions.randomID = 1;
    captions.cycle = 0;
    captions.temp = [];
    captions.cycles = [];
    
    captions.reset = function(){
			
        for(i = 0; i < captions.cycles.length; i++){
            clearTimeout(captions.cycles[i])
        }
	
        captions.cycles = [];
        captions.temp = [];
        captions.cycle = 0;
    }
    
    captions.move = function(caption,from,to,dir,time,bounce){
		
        //howmuch - in pixels - the caption will bounce before it stops
        var overflow;
        dir == 'X' ? overflow = 75 : overflow = 25;
	
        if(!bounce){
            overflow = 0
        }
	
        //should it 'add' to top/left or 'subtract'
        if(from > to){
            bounce = -overflow;
            bounceBack = '+=' + overflow;
        } else {
            bounce = overflow;
            bounceBack = '-=' + overflow;	
        } 
	
        //duration of bounce back
        bounceDuration = time / 4;
	
	
	
        if(dir == 'X'){
            caption.css({
                left:from
            })
            .animate({
                left:to + bounce,
                opacity:0.7
            },{
                duration:time
            })
            .animate({
                left:bounceBack,
                opacity:1
            },{
                duration:bounceDuration
            })
        } else {
            caption.css({
                top:from
            })
            .animate({
                top:to + bounce,
                opacity:0.7
            },{
                duration:time
            })
            .animate({
                top:bounceBack,
                opacity:1
            },{
                duration:bounceDuration
            })
        }
    }
}(jQuery))