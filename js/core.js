// @codekit-prepend "vendor/jquery-3.4.1.min.js";
// @codekit-prepend "vendor/slick.min.js";

// ---- Selector ------ //
const allBannerSlides = $('.hb__slides, .sc__banner__slides');
const homeBannerSlides = $('.hb__slides');
const homeBannerNextArrow = $('.hb__arrow--next');
const homeBannerPrevArrow = $('.hb__arrow--prev');

const showcaseBannerSlides = $('.sc__banner__slides');
const showcaseBannerNextArrow = $('.sc__banner__arrow--next');
const showcaseBannerPrevArrow = $('.sc__banner__arrow--prev');

const showcaseDetailSlides = $('.sc__detail__slides');

const dealsLoading = $('.dl__loading');
const dealsList = $('.dl__list');
const dealsShowMore = $('.dl__more')

// ---- API ---- //
const api = 'https://apimobile.jakartanotebook.com/v1.6/products/search';

// ---- Variable Data ---- //
var listData = [];
var paging = [];
var params = {
  sort: 'newest',
  page: 1,
  limit: 8,
  q: ''
};

$(function(){
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

  getListByBrand()
})

function getListByBrand () {
  dealsLoading.show();
  $.ajax({
    url: api,
    type: 'get',
    dataType: 'json',
    data: params,
    success: function (res) {
      dealsLoading.hide()

      listData = res.data.hits;
      paging = res.meta;

      listData.forEach(item => {
        dealsList.append(
          `<div class="dl__list__item">
            <div class="dl__list__item__img">
              <img src="${item.image.large[0]}" alt=""></div>
            <div class="dl__list__item__title">
              <span>${item.product.Name}</span>
            </div>
            <div class="dl__list__item__price">
              <p class="p--small">${formatRupiah(item.price_normal)}</p>
            </div>
            <div class="dl__list__item__discount__price">
              <p>${formatRupiah(item.discount_price)}</p><small class="dl__list__item__discount__percentage">${getDiscount(item.discount_price, item.price_normal)}</small>
            </div>
            <div class="dl__list__item__button">
              <button class="button--red">BUY</button>
            </div>
          </div>`
        );
      });

      paging.limit * paging.page < paging.total ? dealsShowMore.show() : dealsShowMore.hide()
    },
    error: function (err) {
      alert(err)
    }
  });
}

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

//  ----------- Utils ---------------
function formatNumber (val) {
  if ((!val || isNaN(val)) && val !== 0) {
    return '-'
  }
  return replaceNumber(val)
}

function replaceNumber (val) {
  return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
}

function formatRupiah (val, concat = 'Rp ') {
  val = concat + formatNumber(val)
  return val
}

function getDiscount (sale, actualPrice) {
  return `${(Math.round(((sale - actualPrice) / actualPrice)*100))}%`;
}