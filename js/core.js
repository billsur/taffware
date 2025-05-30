// @codekit-prepend "vendor/jquery-3.4.1.min.js";
// @codekit-prepend "vendor/slick.min.js";

// ---- Selector ------ //
const subBrandMenu = $('.header__menu.expandable')
const subBrandList = $('.header__sub__brand')

const allBannerSlides = $('.hb__slides, .sc__banner__slides');
const homeBannerSlides = $('.hb__slides');
const homeBannerNextArrow = $('.hb__arrow--next');
const homeBannerPrevArrow = $('.hb__arrow--prev');

const showcaseBannerSlides = $('.sc__banner__slides');
const showcaseBannerNextArrow = $('.sc__banner__arrow--next');
const showcaseBannerPrevArrow = $('.sc__banner__arrow--prev');
const showcaseDetailSlides = $('.sc__detail__slides');

const dealsTabList = $('.dl__tabs');
const dealsTab = $('.dl__tab');
const dealsLoading = $('.dl__loading');
const dealsList = $('.dl__list');
const dealsLoadMoreButton = $('.dl__more__button');

const allArrowElement = $('.hb__arrow, .sc__banner__arrow')
// ---- API & URL ---- //
const listItemURL = 'https://apimobile.jakartanotebook.com/v1.6/products/search';
const jaknotStoreURL = 'https://www.jakartanotebook.com/search';
const jakmallStoreURL = 'https://www.jakmall.com/search';
const tokopediaStoreURL = 'https://www.tokopedia.com/taffware/product';

// ---- Media ---- //
const MEDIA_MOBILE = 599;
const MEDIA_TABLET = 1050;

// ---- Variable Data ---- //
var listData = [];
var paging = [];
var params = {
  sort: 'newest',
  page: 1,
  limit: 8,
  q: 'taffstudio'
};

var bgColorSlides = [
  '#e1f1fe', '#ebebeb', '#e3e3e3', '#c1e0eb'
]

$(function(){
  homeBannerSlides.on('init', (function() {
    $(this).parent().parent().css('background', bgColorSlides[0])
  })).slick(
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
  }))

  homeBannerSlides.on('beforeChange', function(e, slick, currentSlide, nextSlide){
    $(this).parent().parent().css('background', bgColorSlides[nextSlide])
  });

  dealsTab.click(function() {
    let brandSelected = $(this).attr('value');

    dealsTab.removeClass("active");
    $(this).addClass('active')

    params.page = 1;
    params.q = brandSelected;

    dealsList.html('');
    getListByBrand();
  })

  dealsLoadMoreButton.click(function() {
    $(this).html('<img src="img/svg/loading-white.svg" height="35px" alt="loading">');
    nextPage();
  })

  subBrandMenu.click(function() {
    subBrandList.toggleClass('header__sub__brand--show');
  })

  $('.header__list .header__menu').on('click', function (e) {
    e.preventDefault()

    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top - 100,
    },500)
  })

  if(window.innerWidth < MEDIA_TABLET ){
    allArrowElement.hide()
  } else {
    allArrowElement.show()
  }

  if(window.innerWidth < MEDIA_MOBILE) {
    dealsTab.click(function () {
      var leftPos = $(this).position().left;
      dealsTabList.animate({scrollLeft: leftPos - 100}, 800);
    });

    for(let i=1; i <= 4 ;i++){
      $(`.hb__img--${i}`).attr('src', `/img/hb-mobile-${i}.png`)
    }
  }


  getListByBrand()
})

function nextPage() {
  params.page += 1;

  getListByBrand()
}

function getListByBrand () {
  dealsLoading.show();
  $.ajax({
    url: listItemURL,
    type: 'get',
    dataType: 'json',
    data: params,
    success: function (res) {
      dealsLoading.hide()

      let responseData = res.data.hits;
      listData = listData.concat(responseData)

      paging = res.meta;

      responseData.forEach((item, index) => {
        dealsList.append(
          `<div class="dl__list__item" data-order="${index}">
            <div class="dl__list__item__detail">
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
            </div>
            <div class="dl__list__store" hidden>
              <div class="dl__list__store__content">
                <span>Buy this product at:</span>
                <a href="${generateTrackingURL(jaknotStoreURL, 'official-website-taffware', `menu-${params.q}`, `sku-${item.sku}`, `${params.q}-20210303`)}&key=${item.sku}" target="_blank">
                  <img src="img/svg/jaknot-button-red.svg">
                </a>
                <a href="${generateTrackingURL(jakmallStoreURL, 'official-website-taffware', `button-jakmall-${params.q}`, `sku-${item.sku}`, `${params.q}-20210303`)}&q=${item.sku}" target="_blank">
                  <img src="img/svg/jakmall-button-red.svg">
                </a>
                <a href="${generateTrackingURL(tokopediaStoreURL, 'official-website-taffware', 'logo-tokopedia', 'official-website-tokopedia', 'official-website-taffware-20210303')}&keyword=${item.sku}" target="_blank">
                  <img src="img/svg/tokopedia-button-red.svg">
                </a>
              </div>
              <div class="dl__list__store__divider">
              </div>
              <div class="dl__list__store__close">
                <button class="button"><i class="mi mi-20 text--red">cancel</i>Close</button>
              </div>
            </div>
          </div>`
        );
      });

      // Listener For "Buy Button" Each List
      $('.dl__list__item__button').each(function(i,e){
        $(e).click(function(){
          let anotherItems = $('.dl__list__item').not($(this).parent().parent());
          let selectedItems =  $(this).parent().parent();

          anotherItems.find('.dl__list__item__detail').show();
          anotherItems.find('.dl__list__store').hide();

          selectedItems.find('.dl__list__item__detail').slideUp('300');
          selectedItems.find('.dl__list__store').slideDown('600');
        })
      })

      // Listener For "Close" Each List
      $('.dl__list__store__close').each(function(i,e){
        $(e).click(function(){
          $(this).parent().parent().find('.dl__list__item__detail').slideDown('slow')
          $(this).parent().parent().find('.dl__list__store').slideUp('400')
        })
      })


      if(paging.limit * paging.page < paging.total) {
        dealsLoadMoreButton.text('SHOW MORE');
        dealsLoadMoreButton.show();
      } else {
        dealsLoadMoreButton.hide()
      }
    },
    error: function (err) {
      alert('Mohon Maaf Terjadi Kesalahan.')
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

function generateTrackingURL (url, source, medium, content, campaign) {
  return url + `?utm_source=${source}&utm_medium=${medium}&utm_content=${content}&utm_campaign=${campaign}`;
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