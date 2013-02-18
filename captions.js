function captionFlow(o){
	
    //captionFlow simpla animates a caption over an image
    //it takes an options object as it's only argument
    //the property's of this object can specify some or all of those:
    //text (required): a string or an array of strings of plain text or html
    //elt (required): the id of the element in which the caption should appear
    //offsetX (default = 50): the default X offset of the caption relative to it's parent
    //offsetY (default = 50): the default Y offset of the caption relative to it's parent
    //direction (default = 'rtl'): in which direction the text should fly, available options are: 'rtl', 'ltr', 'ttb' and 'btt'
    //sideBySide (default = false): if the given text is an array of strings, should they appear side by side? or one on top the other
    //bounce (default = true): should the text give a little bounce before the animation ends?
    //time (default = 400): time - in ms - the animation should last
    //interval (default = 400): for arrays, the time interval - in ms - between one caption and the next
    //className (default = ''): a class name that should be aplied to all captions, usefull for later removel of this caption
    //multiple(default = false): want the whole caption should animate at once? or every character should be handeld seperately,
    //NOTE: if you set this to true, time & interval will be used for every character, 
    //you can use 'multiInterval' to set intervals between captions
    //multiInterval(default = 2000) if multiple = true and text is an array of captions, specify interval - in ms - betwwen captions




    //check if the core elements are defined
    if(!o || typeof o != 'object' || !o['elt'] || !o['text']){
        return false;
    }
	
	
    //define some variables first
    var text = o['text'];
    var eltID = o['elt'];
    var elt = $('#' + eltID); 
    var offsetX = o['offsetX'] || 50;
    var offsetY = o['offsetY'] || 50;
    var direction = o['direction'] || 'rtl';
    var sideBySide = o['sideBySide'];
    var interval = o['interval'] || 400;
    var time = o['time'] || 400;
    var bounce = o['bounce'];
    var multiple = o['multiple'];
    var multiInterval = o['multiInterval'] || 2000;
    var multi = o['multi'];
    var captions = [];
    var height = elt.innerHeight();
    var width = elt.innerWidth();
    var className = 'captionFlow';
	
    //check if a specific class name should be assigned to all captions
    if(o['className'] && typeof o['className'] == 'string'){
        className += ' ' + o['className']
    }
	
    //for internal use
    if(multi){
        captionFlow.cycle++;
    }
	
    //sheck howmuch captions we have, and if multiple is true, howmuch characters
    if(typeof text == 'object' && text.length){
		
        if(multiple){
			
            prevCaptionWidth = 0;
            prevCaptionHeight = 0;
			
            for(i = 0; i < text.length; i++){
				
                captionFlow.temp[i] = {
                    'text':text[i],
                    'offsetX':offsetX + prevCaptionWidth,
                    'offsetY':offsetY + prevCaptionHeight
                }
				
                //temporarly append it to element to check width and height
                $('<span>',{
                    html:text[i],
                    id:'tempCaption',
                    class:className,
                    css:{
                        'display':'none'
                    }
                }).appendTo(elt);
				
                //if sideBySide, add the previous width to the offsetX of the next caption
                if(sideBySide){
                    prevCaptionWidth += $('#tempCaption').innerWidth();
                } else {
                    prevCaptionHeight += $('#tempCaption').innerHeight()
                }
				
                $('#tempCaption').remove()
				
                //call function for each caption, with tme interval of multiInterval between them
                captionFlow.cycles[i] = setTimeout(function(){
                    captionFlow({
                        text:captionFlow.temp[captionFlow.cycle].text,
                        elt:eltID,
                        offsetX:captionFlow.temp[captionFlow.cycle].offsetX,
                        offsetY:captionFlow.temp[captionFlow.cycle].offsetY,
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
                captionFlow.move((captions[index]),from,to,'X',time,bounce)
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
                captionFlow.move((captions[index]),from,to,'X',time,bounce)
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
                captionFlow.move((captions[index]),from,to,'Y',time,bounce)
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
                captionFlow.move((captions[index]),from,to,'Y',time,bounce)
            },index * interval)
        })
    }
    break;
		
    default : {
			
        }
}
}

captionFlow.cycle = 0;
captionFlow.temp = [];
captionFlow.cycles = [];
captionFlow.reset = function(){
			
    for(i = 0; i < captionFlow.cycles.length; i++){
        clearTimeout(captionFlow.cycles[i])
    }
	
    captionFlow.cycles = [];
    captionFlow.temp = [];
    captionFlow.cycle = 0;
}
captionFlow.move = function(caption,from,to,dir,time,bounce){
		
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
