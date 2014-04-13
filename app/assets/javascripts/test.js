function wrap(html){
  return "<ul class='items'>"+ html +"</ul>"
};

function getRadius($element){
  var radius = [];

  radius.push($($element).css("border-top-left-radius"));
  radius.push($($element).css("border-top-right-radius"));
  radius.push($($element).css("border-bottom-right-radius"));
  radius.push($($element).css("border-bottom-left-radius"));

  return radius.join(' ');
};

$.fn.roundThis = function(radius){
  return this.each(function(e){
    $(this).css({"border-radius":         radius,
                 "-moz-border-radius":    radius,
                 "-webkit-border-radius": radius});});
};

function parseResponse(data){
  var attrValue, text, db, html = "";

  if (!($.isEmptyObject(data))){// ~ for mongoid
    if (data[0]["_id"]){db = 1;}}

  $.each(data, function(){
    $.each(this, function(key, value){
      switch(db){
        case 1:
          if (value){
            if (!attrValue){attrValue = value["$oid"];}
              else {if (typeof(value) == "string"){text = value;}}}
          break;
        default:
          if (!attrValue){attrValue = value}
            else {text = value;}
      }
    });

    html += "<li value="+ attrValue +">"+ text +"</li>"
    attrValue = text = null;
  });

  return html;
};

function getData(url){
  return JSON.parse($.ajax({type: 'GET',
                            url: url,
                            dataType: 'json',
                            async: false,
                            success: function(data){
                              return data;
                            }}).responseText);};

function result(href) {
  var html = parseResponse(getData(href));

  return wrap(html);
};

function makeResponse($element, color){
  $($element).attr("autocomplete", "off");
  $($element).parent().append("<div id='auto_box'></div>");
  $("#auto_box").css("border", "solid 1px " + color);
  $("#auto_box").roundThis(getRadius($element));
  $("#auto_box").width($($element).outerWidth());
  $("#auto_box").append(result($($element).data("auto").href));
}

function initAutocomplete(){
  var color = $("input[data-auto]").css("border-right-color");

  $("input[data-auto]").click(function(){makeResponse(this, color);});
  $("input[data-auto]").focusout(function(){$("#auto_box").remove();});
}
