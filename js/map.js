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
var CHECKS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];

var activateMap = function () {
  document.querySelector('.map').classList.remove('map--faded');
};

var getRandomValueFromArray = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomValue = function (max, min) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var tempValue = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = tempValue;
  }
  return array;
};

var generateAvatars = function (MAX_USER_NUMBER, MIN_USER_NUMBER) {
  var listAvatars = [];
  var avatar;
  for (var i = MIN_USER_NUMBER - 1; i < MAX_USER_NUMBER; i++) {
    avatar = 'img/avatars/user0' + i + '.png';
    listAvatars.push(avatar);
  }
  return listAvatars;
};

var getArrayLength = function (array) {
  var clone = array.slice();
  clone.length = getRandomValue(array.length, 1);
  return clone;
};

var generateAds = function () {
  var MAX_USER_NUMBER = 8; // максимальное число пользователей
  var MIN_USER_NUMBER = 1; // минимальное число пользователей
  var MAX_PRICE = 1000000; // максимальная цена недвижимости
  var MIN_PRICE = 1000; // минимальная цена недвижимости
  var MAX_ROOMS = 5; // максимальное число комнат в доме
  var MIN_ROOMS = 1; // минимальное число комнат в доме
  var MAX_GUESTS = 15; // максимальное число гостей, которых можно разместить дома
  var MIN_GUESTS = 1; // минимальное число гостей, которых можно разместить дома
  var MAX_Y_COORD_PIN = 630; // наивысшая точка метки
  var MIN_Y_COORD_PIN = 130; // наинизшая точка метки
  var PIN_HEIGHT = 70; // высота метки
  var PIN_WIDTH = 50; // ширина метки
  var MAP_WIDTH = 1200; // ширина карты

  var ads = [];
  var userAvatar = shuffleArray(generateAvatars(MAX_USER_NUMBER, MIN_USER_NUMBER));
  var title = shuffleArray(TITLES);

  for (var i = 0; i < 8; i++) {
    var locX = getRandomValue(MAP_WIDTH, PIN_WIDTH / 2) - PIN_WIDTH / 2; // предполагается, что метка может частично вылезти за пределы карты, но указатель метки будет виден (или нет) (???)
    var locY = getRandomValue(MAX_Y_COORD_PIN, MIN_Y_COORD_PIN) - PIN_HEIGHT;
    ads.push({
      author: {
        avatar: userAvatar[i]
      },
      offer: {
        title: title[i],
        address: locX + ', ' + locY,
        price: getRandomValue(MAX_PRICE, MIN_PRICE),
        type: getRandomValueFromArray(TYPES),
        rooms: getRandomValue(MAX_ROOMS, MIN_ROOMS),
        guests: getRandomValue(MAX_GUESTS, MIN_GUESTS),
        checkin: getRandomValueFromArray(CHECKS),
        checkout: getRandomValueFromArray(CHECKS),
        features: getArrayLength(FEATURES),
        description: '',
        photos: shuffleArray(PHOTOS)
      },
      location: {
        x: locX,
        y: locY
      }
    });
  }
  return ads;
};

var addPins = function (ads) {
  var pinTemplateButton = document.querySelector('#pin')
    .content
    .querySelector('button');
  var pinTemplateImg = document.querySelector('#pin')
    .content
    .querySelector('img');

  var fragment = document.createDocumentFragment();

  ads.forEach(function (ad) {
    fragment.appendChild(renderPinButton(ad, pinTemplateButton));
    fragment.appendChild(renderPinImg(ad, pinTemplateImg));
  });

  document.querySelector('.map__pins').appendChild(fragment);
};

var renderPinButton = function (ad, pinTemplateButton) {
  var buttonClone = pinTemplateButton.cloneNode(true);

  buttonClone.querySelector('.map__pin').style.left = ad.location.x;
  buttonClone.querySelector('.map__pin').style.top = ad.location.y;

  return buttonClone;
};

var renderPinImg = function (ad, pinTemplateImg) {
  var imgClone = pinTemplateImg.cloneNode(true);

  imgClone.querySelector('img').src = ad.author.avatar;
  imgClone.querySelector('img').alt = ad.offer.title;

  return imgClone;
};

activateMap();

var ads = generateAds();

addPins(ads);

/* var createPin = function (ad) {
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

document.querySelector('.map').classList.remove('map--faded');*/
