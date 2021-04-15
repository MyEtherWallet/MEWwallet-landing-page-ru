/**
 * Общие скрипты
 **/

$(window).load(function() {

  $('.js-faq-link').on('click', function(){
    $(this).next().slideToggle();
    $(this).toggleClass('open')
  })

  bodymovin.loadAnimation({
    container: document.getElementById('js-animate'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '/start.json'
  });

  $('.js-toggle-menu').click(function () {
    if($('.js-menu').hasClass('open')) {
      $('.js-toggle-menu').removeClass('open-final');
      $('.js-menu').removeClass('open-final');

      setTimeout(function(){
        $('.js-toggle-menu').removeClass('open');
      }, 100)

      setTimeout(function(){
        $('.js-menu').removeClass('open');
        $('.js-logo').removeClass('open');
      }, 300)

    } else {
      $('.js-logo').addClass('open');
      $('.js-toggle-menu').addClass('open');
      $('.js-menu').addClass('open');

      setTimeout(function(){
        $('.js-menu').addClass('open-final');
      }, 50)

      setTimeout(function(){
        $('.js-toggle-menu').addClass('open-final');
      }, 100)
    }

  });
});

$(document).scroll(function() {

  var top = $(document).scrollTop();

  if (top > 90) {

    $(".header").addClass('fixed')
    $("body").addClass('fixed')

  } else {

    $(".header").removeClass('fixed')
    $("body").removeClass('fixed')

  }

});

$(function () {
  $("select").customSelect();

  updateSelects();

  var datepicker = $('.js-date').datepicker({
    onSelect: function(f, d, i){
      stopConfeti();
      $('.js-button').show();
      $('.js-peggy').show();
      $('.js-result').hide();
    }
  }).data('datepicker');

  datepicker.selectDate(new Date(2020, 2, 14));

  $('.js-token').on('change', function(e){
    updateSelects();
    stopConfeti();
    $('.js-button').show();
    $('.js-peggy').show();
    $('.js-result').hide();
  })

  $('.js-date').on('change', function(e){
    stopConfeti();
    $('.js-button').show();
    $('.js-peggy').show();
    $('.js-result').hide();
  })

  $('.js-amount').on('change', function(e){
    stopConfeti();
    $('.js-button').show();
    $('.js-peggy').show();
    $('.js-result').hide();

    var n = parseInt(e.target.value.replace(/\D/g,''), 10);
    $('.js-amount-input').val(n.toLocaleString() + " ₽")
  })

  $(".js-amount-input").on('blur', function() {
    stopConfeti();
    $('.js-button').show();
    $('.js-peggy').show();
    $('.js-result').hide();
    
    var n = parseInt($(this).val().replace(/\D/g,''), 10);
    $(this).val(n.toLocaleString() + " ₽");
  });

  $('.js-carousel').slick({
    dots: true,
  });

  $('.js-investments-carousel').slick({
    dots: true,
  });

  var controller = new ScrollMagic.Controller({
    globalSceneOptions: {
      triggerHook: 'onLeave',
      duration: $(window).height() * 2
    }
  });

  new ScrollMagic.Scene({ triggerElement: document.querySelector(".enter-items") })
    .setPin(document.querySelector(".js-pin"), { pushFollowers: false })
    //.addIndicators()
    .addTo(controller);

	var imgController = new ScrollMagic.Controller({globalSceneOptions: { triggerHook: 'onLeave', duration: $(window).height() }});
	var imgFirstController = new ScrollMagic.Controller({globalSceneOptions: { triggerHook: 'onLeave', duration: $(window).height() + 672 }});

	new ScrollMagic.Scene({triggerElement: document.querySelector(".enter")})
					.setClassToggle("#img1", "active") 
					//.addIndicators()
					.addTo(imgFirstController);

  new ScrollMagic.Scene({triggerElement: "#sec2"})
					.setClassToggle("#img2", "active") 
					//.addIndicators()
					.addTo(imgController);
  new ScrollMagic.Scene({triggerElement: "#sec3"})
					.setClassToggle("#img3", "active") 
					//.addIndicators()
					.addTo(imgController);

  var textController = new ScrollMagic.Controller();

  var scene = new ScrollMagic.Scene({ triggerElement: ".js-enter" })
      .setClassToggle("#animate-text", "animate")
      // .addIndicators({name: "1 - add a class"})
      .addTo(textController);
  
});

function updateSelects() {
  var options = document.querySelectorAll('.token-input-wrap .custom-select__option');

  options.forEach(function(item){
    var select = document.querySelector('.js-token');

    for (var i = 0; i < select.options.length; i++) {
      if(item.firstChild.nodeValue == select.options[i].text) {
        item.dataset.value = select.options[i].value;
      }
    }
  })
}

function scrollToAnchor(selector){
  var element = $(selector);
  $('html,body').animate({ scrollTop: element.offset().top - 60 },'slow');
}

function calculate() {
  stopConfeti();

  var currDate = new Date();
  var dateInput = $('.js-date');
  var date = dateInput[0].value;
  var dateArr = date.split('.');

  var name = $('.js-token').val();
  var amount = $('.js-amount-input').val();

  amount = amount.replace(' ','');
  amount = amount.replace('.','');
  amount = amount.replace(',','');
  amount = amount.replace('-','');
  amount = amount.replace('_','');
  amount = amount.replace('₽','');
  amount = amount.replace(/\s/g, '');;

  amount = parseInt(amount);

  if(!!date && !!name) {
    $('.js-date').removeClass('error');

    var month = currDate.getMonth() + 1

    var url = 'https://api.coingecko.com/api/v3/coins/' + name + '/history?date=' + currDate.getDate() + '-' + (month > 9 ? '0' + month : month) + '-' + currDate.getFullYear();
  
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.send();
  
    xhr.onload = function() {
      var currentPrice = xhr.response.market_data.current_price.rub;
      var symbol = xhr.response.symbol;

      var url2 = 'https://api.coingecko.com/api/v3/coins/' + name + '/history?date=' + dateArr[0] + '-' + dateArr[1] + '-' + dateArr[2];
  
      var xhr2 = new XMLHttpRequest();
      xhr2.open('GET', url2);
      xhr2.responseType = 'json';
      xhr2.send();

      $('.js-result-amount').text(Math.ceil(amount)); 
    
      xhr2.onload = function() {
        if(!!xhr2.response.market_data) {

          var enterPrice = xhr2.response.market_data.current_price.rub;

          var cryptoAmount = amount / enterPrice;

          $('.calculator__result-crypto-amount').html(cryptoAmount.toFixed(3) + ' ' + symbol);

          startConfeti();

          $('.js-button').hide();
          $('.js-peggy').hide();
          $('.js-result').show();

          numberAnimate(currentPrice * cryptoAmount);

          setTimeout(function(){
            stopConfeti();
          }, 3000);

        } else {

          alert('Нет данных о цене на выбранную дату');

        }

  
      };
    
      xhr2.onerror = function() {
        console.log("Запрос не удался");
      };
    };
  
    xhr.onerror = function() {
      console.log("Запрос не удался");
    };

  } else {

    $('.js-date').addClass('error');

  }
}

function numberAnimate(numberValue) {
  var currentNumber = $('.js-result-amount').text();

  $({numberValue: currentNumber}).animate({ numberValue: numberValue }, {
      duration: 600,
      easing: 'linear',
      step: function() { 
          $('.js-result-amount').text(Math.ceil(this.numberValue).toLocaleString()); 
      }
  });
}

var confettiFrequency = 3;
var confettiColors = ['#fce18a', '#ff726d', '#b48def', '#f4306d'];
var confettiAnimations = ['slow', 'medium', 'fast'];
var el = document.querySelector('.js-container');
var containerEl = null;

function startConfeti() {
    /*if(containerEl == null) {*/
      this._setupElements();
      this._renderConfetti();
    /*} else {*/
      // $('.confetti-container').removeClass('hide');
    /*}*/
}

function stopConfeti() {
  $('.confetti-container').remove();
}

function _setupElements() {
  var containerEl = document.createElement('div');
  var elPosition = this.el.style.position;
  
  if (elPosition !== 'relative' || elPosition !== 'absolute') {
    this.el.style.position = 'relative';
  }
  
  containerEl.classList.add('confetti-container');
  
  this.el.appendChild(containerEl);
  
  this.containerEl = containerEl;
};

function _renderConfetti () {
  this.confettiInterval = setInterval(function() {
    var confettiEl = document.createElement('div');
    var confettiSize = (Math.floor(Math.random() * 3) + 7) + 'px';
    var confettiBackground = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
    var confettiLeft = (Math.floor(Math.random() * this.el.offsetWidth)) + 'px';
    var confettiAnimation = this.confettiAnimations[Math.floor(Math.random() * this.confettiAnimations.length)];
    
    confettiEl.classList.add('confetti', 'confetti--animation-' + confettiAnimation);
    confettiEl.style.left = confettiLeft;
    confettiEl.style.width = confettiSize;
    confettiEl.style.height = confettiSize;
    confettiEl.style.backgroundColor = confettiBackground;
    
    confettiEl.removeTimeout = setTimeout(function() {
      confettiEl.parentNode.removeChild(confettiEl);
    }, 3000);
    
    this.containerEl.appendChild(confettiEl);
  }, 25);
};
