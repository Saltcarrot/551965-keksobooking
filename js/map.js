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
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];

// Активировать карту
var activateMap = function () {
  document.querySelector('.map').classList.remove('map--faded');
};

// Взять любое число из массива
var getRandomValueFromArray = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Сгенерировать число в диапазоне от MIN до MAX
var getRandomValue = function (max, min) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

// Перетасовать элементы в массиве
var shuffleArray = function (array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var tempValue = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = tempValue;
  }
  return array;
};

// Создать массив определенной длины
var generateArray = function (array) {
  return shuffleArray(array).slice(0, getRandomValue(array.length, 1));
};

var generateArrayOfNumbers = function (arrayLength) {
  var array = [arrayLength - 1];
  for (var l = 0; l < arrayLength; l++) {
    array[l] = l;
  }

  return array;
};

// Сгенерировать массив предложений
var generateAds = function () {
  var maxUserNumber = 8;
  var maxPrice = 1000000;
  var minPrice = 1000;
  var maxRooms = 5;
  var minRooms = 1;
  var maxGuests = 15;
  var minGuests = 1;
  var maxYCoordPin = 630;
  var minYCoordPin = 130;
  var pinWidth = 50;
  var mapWidth = 1200;

  var ads = [];
  var userAvatars = shuffleArray(generateArrayOfNumbers(maxUserNumber));
  var titles = shuffleArray(TITLES);

  for (var i = 0; i < maxUserNumber; i++) {
    var locX = getRandomValue(mapWidth - pinWidth, pinWidth);
    var locY = getRandomValue(maxYCoordPin, minYCoordPin);

    ads.push({
      author: {
        avatar: userAvatars[i]
      },
      offer: {
        title: titles[i],
        address: locX + ', ' + locY,
        price: getRandomValue(maxPrice, minPrice),
        type: getRandomValueFromArray(TYPES),
        rooms: getRandomValue(maxRooms, minRooms),
        guests: getRandomValue(maxGuests, minGuests),
        checkin: getRandomValueFromArray(TIMES),
        checkout: getRandomValueFromArray(TIMES),
        features: generateArray(FEATURES),
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

// Отредактировать содержимое клонируемого узла МАРКЕРА ОБЪЯВЛЕНИЯ
var renderPin = function (ad, pinTemplate) {
  var clone = pinTemplate.cloneNode(true);

  var pinButton = clone.querySelector('button');

  pinButton.style.left = ad.location.x + 'px';
  pinButton.style.top = ad.location.y + 'px';

  var pinImg = clone.querySelector('img');

  pinImg.src = ad.author.avatar;
  pinImg.alt = ad.offer.title;

  return clone;
};

// Добавить метки на карту
var addPins = function (ads) {
  var pinTemplate = document.querySelector('#pin');

  var fragment = document.createDocumentFragment();

  ads.forEach(function (ad) {
    fragment.appendChild(renderPin(ad, pinTemplate));
  });

  document.querySelector('.map__pins').appendChild(fragment);
};

// Отредактировать содержимое клонируемого узла КАРТОЧКИ ОБЪЯВЛЕНИЯ
var renderAdCard = function (ad, adCardTemplate) {
  var clone = adCardTemplate.cloneNode(true);
  var adPhotosCount = ad.offer.photos.length;
  var adFeaturesCount = ad.offer.features.length;

  clone.querySelector('.popup__avatar').src = ad.author.avatar;
  clone.querySelector('.popup__title').textContent = ad.offer.title;
  clone.querySelector('.popup__text--address').textContent = ad.offer.address;
  clone.querySelector('.popup__text--price').textContent = ad.offer.price + '&#x20bd;/ночь';

  var cardType = clone.querySelector('.popup__type');

  switch (ad.offer.type) {
    case 'flat':
      cardType.textContent = 'Квартира';
      break;
    case 'palace':
      cardType.textContent = 'Дворец';
      break;
    case 'house':
      cardType.textContent = 'Дом';
      break;
    case 'bungalo':
      cardType.textContent = 'Бунгало';
      break;
  }

  clone.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комната(-ты/-т) для ' + ad.offer.guests + ' гостя(-ей)';
  clone.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд после ' + ad.offer.checkout;

  var cardFeature = clone.querySelector('.popup__features').querySelector('.popup__feature');

  for (var i = 0; i < adFeaturesCount; i++) {
    switch (ad.offer.features[i]) {
      case 'wifi':
        cardFeature.classList.add('popup__feature--wifi');
        break;
      case 'dishwasher':
        cardFeature.classList.add('popup__feature--dishwasher');
        break;
      case 'parking':
        cardFeature.classList.add('popup__feature--parking');
        break;
      case 'washer':
        cardFeature.classList.add('popup__feature--washer');
        break;
      case 'elevator':
        cardFeature.classList.add('popup__feature--elevator');
        break;
      case 'conditioner':
        cardFeature.classList.add('popup__feature--conditioner');
        break;
    }
  }

  clone.querySelector('.popup__description').textContent = ad.offer.description;

  for (var j = 0; j < adPhotosCount; j++) {
    clone.querySelector('.popup__photos').querySelector('.popup__photo').src = ad.offer.photos[j];
  }

  return clone;
};

// Добавление карточки в документ
var addAdCard = function (ad) {
  var adCardTemplate = document.querySelector('#card');

  var fragment = document.createDocumentFragment();

  fragment.appendChild(renderAdCard(ad, adCardTemplate));

  var searchFilter = document.querySelector('.map__filters-container');

  document.querySelector('.map').insertBefore(fragment, searchFilter);
};

activateMap();

var ads = generateAds();

addPins(ads);
addAdCard(ads[0]);
