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

var map = document.querySelector('.map');
var mapPin = map.querySelector('.map__pin');
var form = document.querySelector('.ad-form');
var formElements = form.elements;
var filter = document.querySelector('.map__filters');
var filterElements = filter.elements;

var disableFilters = function () {
  for (var i = 0; i < filterElements.length; ++i) {
    filterElements[i].disabled = true;
  }
};

var activateFilters = function () {
  for (var i = 0; i < filterElements.length; ++i) {
    filterElements[i].disabled = false;
  }
};

var disableForm = function () {
  for (var i = 0; i < formElements.length; ++i) {
    formElements[i].disabled = true;
  }
};

var activateForm = function () {
  for (var i = 0; i < formElements.length; ++i) {
    formElements[i].disabled = false;
  }
};

var activateObject = function (element, className) {
  element.classList.remove(className);
};

var popupMouseupHandle = function () {
  activateObject(map, 'map--faded');
  activateObject(form, 'ad-form--disabled');
  activateFilters();
  activateForm();

  var ads = generateAds();

  addPins(ads);
  renderAdCard(ads[0]);
};

var getRandomValueFromArray = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomValue = function (max, min) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

var shuffleArray = function (array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var tempValue = array[i];
    array[i] = array[randomIndex];
    array[randomIndex] = tempValue;
  }
  return array;
};

var generateArrayOfAGivenLength = function (array) {
  return shuffleArray(array).slice(0, getRandomValue(array.length, 1));
};

var generateArrayOfNumbers = function (arrayLength) {
  var array = [];

  for (var l = 0; l < arrayLength; l++) {
    array[l] = l + 1;
  }

  return array;
};

var removeChilds = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var translateType = function (type) {
  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    default:
      return type;
  }
};

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
        avatar: 'img/avatars/user0' + userAvatars[i] + '.png'
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
        features: generateArrayOfAGivenLength(FEATURES),
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

var createIconFeature = function (feature) {
  var iconFeature = document.createElement('li');

  iconFeature.classList.add('popup__feature');
  iconFeature.classList.add('popup__feature--' + feature);

  return iconFeature;
};

var generateIconsFeatures = function (arrayFeatures) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arrayFeatures.length; i++) {
    var feature = createIconFeature(arrayFeatures[i]);
    fragment.appendChild(feature);
  }

  return fragment;
};

var createPhoto = function (photo) {
  var photoEl = document.createElement('img');

  photoEl.classList.add('.popup__photo');
  photoEl.width = 45;
  photoEl.height = 40;
  photoEl.alt = 'Фотография жилья';
  photoEl.src = photo;

  return photoEl;
};

var generatePhotos = function (photosArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photosArray.length; i++) {
    var feature = createPhoto(photosArray[i]);
    fragment.appendChild(feature);
  }
  return fragment;
};

var renderPin = function (ad, pinTemplate) {
  var clone = pinTemplate.cloneNode(true);

  var pinButton = clone.querySelector('button');
  var pinImg = clone.querySelector('img');

  pinButton.style.left = ad.location.x + 'px';
  pinButton.style.top = ad.location.y + 'px';

  pinImg.src = ad.author.avatar;
  pinImg.alt = ad.offer.title;

  return clone;
};

var addPins = function (ads) {
  var pinTemplate = document.querySelector('#pin').content;
  var fragment = document.createDocumentFragment();

  ads.forEach(function (ad) {
    fragment.appendChild(renderPin(ad, pinTemplate));
  });

  document.querySelector('.map__pins').appendChild(fragment);
};

var renderAdCard = function (ad) {
  var clone = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
  var searchFilter = document.querySelector('.map__filters-container');

  clone.querySelector('.popup__avatar').src = ad.author.avatar;
  clone.querySelector('.popup__title').textContent = ad.offer.title;
  clone.querySelector('.popup__text--address').textContent = ad.offer.address;
  clone.querySelector('.popup__text--price').textContent = ad.offer.price + '₽/ночь';

  clone.querySelector('.popup__type').textContent = translateType(ad.offer.type);

  clone.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комната(-ты/-т) для ' + ad.offer.guests + ' гостя(-ей)';
  clone.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд после ' + ad.offer.checkout;

  removeChilds(clone.querySelector('.popup__features'));
  clone.querySelector('.popup__features').appendChild(generateIconsFeatures(ad.offer.features));

  clone.querySelector('.popup__description').textContent = ad.offer.description;

  clone.querySelector('.popup__photos').classList.remove('img');

  removeChilds(clone.querySelector('.popup__photos'));
  clone.querySelector('.popup__photos').appendChild(generatePhotos(ad.offer.photos));

  return document.querySelector('.map').insertBefore(clone, searchFilter);
};

disableForm();
disableFilters();

mapPin.addEventListener('mouseup', popupMouseupHandle);
