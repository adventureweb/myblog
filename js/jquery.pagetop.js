;(function ( $, window, document, undefined ) {

$(function(){
  $(window).scroll( function(){
    if( $(this).scrollTop() > 150 ){
      $('.pagetop').addClass('show');
    } else {
      $('.pagetop').removeClass('show');
    }
  });
  $('.pagetop').click(function(){
    var speed = 500;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $("html, body").animate({scrollTop:position}, speed, "swing");
    return false;
  });
});

})(jQuery, window, document);