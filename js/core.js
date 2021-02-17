// @codekit-prepend "vendor/jquery-3.4.1.min.js";
// @codekit-prepend "vendor/slick.min.js";


$(function(){
  const homeBannerSlides = $('.hb__slides');
  const homeBannerNextArrow = $('.hb__arrow--next');
  const homeBannerPrevArrow = $('.hb__arrow--prev');

  homeBannerSlides.slick(
    slickProps(homeBannerPrevArrow ,homeBannerNextArrow)
  );

  homeBannerSlides.on('wheel', (function(e) {
    e.preventDefault();
    if (e.originalEvent.deltaY < 0) {
      $(this).slick('slickNext');
    } else {
      $(this).slick('slickPrev');
    }
  }));
})

function slickProps(prevSelector, nextSelector){
  return {
    slidesToShow: 1,
    dots: true,
    speed: 600,
    prevArrow: prevSelector,
		nextArrow: nextSelector
  }
}