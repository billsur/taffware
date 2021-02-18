// @codekit-prepend "vendor/jquery-3.4.1.min.js";
// @codekit-prepend "vendor/slick.min.js";


$(function(){
  const allBannerSlides = $('.hb__slides, .sc__banner__slides');
  const homeBannerSlides = $('.hb__slides');
  const homeBannerNextArrow = $('.hb__arrow--next');
  const homeBannerPrevArrow = $('.hb__arrow--prev');

  const showcaseBannerSlides = $('.sc__banner__slides');
  const showcaseBannerNextArrow = $('.sc__banner__arrow--next');
  const showcaseBannerPrevArrow = $('.sc__banner__arrow--prev');

  const showcaseDetailSlides = $('.sc__detail__slides');

  homeBannerSlides.slick(
    slickProps(1, homeBannerPrevArrow ,homeBannerNextArrow, false, true)
  );

  showcaseBannerSlides.slick(
    slickProps(3, showcaseBannerNextArrow ,showcaseBannerPrevArrow, true, false, '.sc__detail__slides')
  );

  showcaseDetailSlides.slick(
    slickProps(1, '' , '', false, false)
  );

  allBannerSlides.on('wheel', (function(e) {
    e.preventDefault();
    if (e.originalEvent.deltaY < 0) {
      $(this).slick('slickNext');
    } else {
      $(this).slick('slickPrev');
    }
  }));
})

function slickProps(slideShow = 1, prevSelector, nextSelector, isCenter, isUseDots, isUseNav = null){
  let additionalProps = {}
  if(isCenter){
    additionalProps = {
      initialSlide: 2,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            centerMode: true,
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            centerMode: true,
            slidesToShow: 1
          }
        }
      ]
    }
  }
  return {
    ...additionalProps,
    centerMode: isCenter,
    slidesToShow: slideShow,
    dots: isUseDots,
    asNavFor: isUseNav,
    speed: 600,
    prevArrow: prevSelector,
		nextArrow: nextSelector
  }
}