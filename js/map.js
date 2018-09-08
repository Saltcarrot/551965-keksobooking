'use strict';

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var CHECK = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MAX_USER_NUMBER = 8;
var MIN_USER_NUMBER = 1;
var MAX_PRICE = 1000000;
var MIN_PRICE = 1000;
var MAX_ROOMS = 5;
var MIN_ROOMS = 1;
var MAX_GUESTS = 15;
var MIN_GUESTS = 1;
var MAX_Y_COORD = 630;
var MIN_Y_COORD = 130;
var PIN_HEIGHT = 40;
var PIN_WIDTH = 40;

var getRandomValueFromArray = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomValue = function (max, min) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

var getRandomUserAvatar = function () {
  return 'img/avatars/user0' + getRandomValue(MAX_USER_NUMBER, MIN_USER_NUMBER) + '.png';
};

var shuffleArray = function (array) {
  for (var i = 0; i < array.length; i++) {
    var randomIndex = Math.floor(Math.random() * (array.length + 1));
    var tempValue = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = tempValue;
  }
  return array;
};

var generateAds = function () {
  var ads = [];
  for (var i = 0; i < 8; i++) {
    var locX = getRandomValue(1200, 750);
    var locY = getRandomValue(MAX_Y_COORD, MIN_Y_COORD);
    ads[i] = {
      author: {
        avatar: getRandomUserAvatar()
      },
      offer: {
        title: getRandomValueFromArray(TITLES),
        address: locX + ', ' + locY,
        price: getRandomValue(MAX_PRICE, MIN_PRICE),
        type: getRandomValueFromArray(TYPES),
        rooms: getRandomValue(MAX_ROOMS, MIN_ROOMS),
        guests: getRandomValue(MAX_GUESTS, MIN_GUESTS),
        checkin: getRandomValueFromArray(CHECK),
        checkout: getRandomValueFromArray(CHECK),
        features: getRandomValueFromArray(FEATURES),
        description: '',
        photos: shuffleArray(PHOTOS)
      },
      location: {
        x: locX,
        y: locY
      }
    };
  }
  return ads;
};

var createPin = function (ad) {
  var userLocation = document.createElement('button');

  userLocation.style.left = (ad.location.x - PIN_HEIGHT) + 'px';
  userLocation.style.top = ad.location.y - (PIN_WIDTH / 2) + 'px';

  var userAvatar = document.createElement('img');

  userAvatar.alt = ad.offer.title;
  userAvatar.src = ad.author.avatar;

  userLocation.appendChild(userAvatar);

  return userLocation;
};

var insertPin = function (ads) {
  var pinMap = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  ads.forEach(function (ad) {
    fragment.appendChild(createPin(ad));
  });

  pinMap.appendChild(fragment);
};

document.querySelector('.map').classList.remove('map--faded');
