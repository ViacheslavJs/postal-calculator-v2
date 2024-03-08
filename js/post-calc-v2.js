(function() {
'use strict';

  const btnCalc = document.getElementById('btnCalc');
  const btnReset = document.getElementById('btnRset');
  const resultDisplayControl = document.getElementById('res-out');

  const buttonStyle = {
    active: {
      color: '#ffffff',
      border: '1px solid #ffffff',
    },
    inactive: {
      color: '#99d3ff',
      border: '1px solid #99d3ff',
    },
  };

/*
HTMLCollection - это объект в JavaScript, который представляет собой коллекцию элементов HTML, 
полученных из DOM (Document Object Model). Он подобен массиву, но не является массивом.
HTMLCollection не является массивом в строгом смысле этого слова. Хотя он может выглядеть 
и вести себя подобно массиву, он не обладает методами массива, такими как map, 
forEach, filter, и другими.
Методы массивов предполагают наличие у объекта свойства length и числовых индексов 
для доступа к элементам. В то время как в массиве элементы хранятся по числовым индексам, 
в HTMLCollection они хранятся в порядке следования в документе, и доступ осуществляется 
по индексу или по имени свойства (например, collection[0] или collection.namedItem('example')).
*/

  // Прежде чем применять методы массива к HTMLCollection, его необходимо сконвертировать в массив:
  /*
  // Вариант 1 - вызов Array.from()
  const inputElements = document.getElementsByClassName('input');
    const inputs = Array.from(inputElements).map(element => {
    console.log(element.id);
    return element;
  });
  console.log(inputs);
  console.log(inputs[0]);
  console.log(inputs[0].id);
  //
  */

  /*
  // Вариант 2 - цикл for:
  const inputElements = document.getElementsByClassName('input');
  const inputs = [];

  for (let i = 0; i < inputElements.length; i++) {
    const element = inputElements[i];
    console.log(element.id);
    inputs.push(element);
  }
  console.log(inputs);
  console.log(inputs[0]);
  console.log(inputs[0].id);
  //
  */

  
  // Вариант 3 - spread:
  const inputElements = document.getElementsByClassName('input');
    const inputs = [...inputElements].map(element => {
    console.log(element.id);
    return element;
  });
  console.log(inputs);
  console.log(inputs[0]);
  console.log(inputs[0].id);
  console.log(Object.prototype.toString.call(inputs));
  //
  

  let inputValues = inputs.map(input => {
    input.value = '';
    return '';
  });
  console.log(inputValues); 

  function removingListenersInput() {
    inputs.forEach((input, index) => {
      input.removeEventListener('input', handleChange);
    });
  }

  function addedListenersInput() {
    inputs.forEach((input, index) => {
      input.addEventListener('input', handleChange);
    });
  }

  function setActiveStyle(element) {
    Object.assign(element.style, buttonStyle.active);
  }

  function setInactiveStyle(element) {
    Object.assign(element.style, buttonStyle.inactive);
  }

  function activeCalculateBtn() {
    btnCalc.addEventListener('click', calculateButtonHandler);
    setActiveStyle(btnCalc);
  }

  function deactiveCalculateBtn() {
    btnCalc.removeEventListener('click', calculateButtonHandler);
    setInactiveStyle(btnCalc);
  }

  function activeResetBtn() {
    btnReset.addEventListener('click', reset);
    setActiveStyle(btnReset);
  }

  function deactiveResetBtn() {
    btnReset.removeEventListener('click', reset);
    setInactiveStyle(btnReset);
  }

  function reset() {
    deactiveResetBtn();
    deactiveCalculateBtn();
    inputs.forEach(input => (input.value = ''));
    resultDisplayControl.innerHTML = '';
    addedListenersInput();
  }

  inputs.forEach(input => input.addEventListener('input', handleChange));

  function handleChange() {
    inputValues = inputs.map(input => {
      const value = input.value;
      const inputValue = Number(value);
      if (isNaN(inputValue)) {
        setInactiveStyle(btnCalc);
        return '';
      }
      return value;
    });
    console.log(inputValues); 

    if (inputValues.every(value => value !== '')) {
      activeCalculateBtn();
    } else {
      deactiveCalculateBtn();
    }

    const tooltips = document.getElementsByClassName('pc-form__tooltip-text');
    //const inputs = document.getElementsByClassName('input');

    for (let i = 0; i < tooltips.length; i++) {
      inputs[i].addEventListener('focus', function() {
        tooltips[i].style.visibility = 'hidden';
      }, true);
    }

    for (let i = 0; i < inputs.length; i++) {
      const inputValue = Number(inputs[i].value);
      if (isNaN(inputValue)) {
        tooltips[i].style.visibility = 'visible';
        deactiveCalculateBtn();
      } else if (!isNaN(inputValue)) {
        tooltips[i].style.visibility = 'hidden';
      }
    }
  }

  function calculateButtonHandler() {
    const params = inputValues.map(value => Number(value));
    const result = calc(...params);
    const unit = 'UAH';
    resultDisplayControl.innerHTML = `${result.toFixed(2)} ${unit}`;

    deactiveCalculateBtn();
    activeResetBtn();
    removingListenersInput();

  }

// TODO - basic calculation formula:
// algorithm:
function calc( length, width, height, weight, distance ) {
  //cost per weight:
  const MIN_TARIFF = 37.5;
  const STANDARD_WEIGHT = 1;
  const COST_KG = 3;
        
  let price;
  let clientWeight = weight;
  if ( clientWeight <= STANDARD_WEIGHT ) { 
    price = MIN_TARIFF; 
    //console.log(price);
  } else if ( clientWeight > STANDARD_WEIGHT ) {
    price = MIN_TARIFF + (clientWeight * COST_KG); 
    //console.log(price);
  }
    
  // distance payment calculation
  const STANDARD_DISTANCE = 800;   
  let clientDistance = distance;
            
  // volume payment calculation:    
  const PERCENT_VOL = 12;    
  let surchargeVol;  
         
  // standard pack size:
  const STANDARD_LENGTH = 500;
  const STANDARD_WIDTH = 250;
  const STANDARD_HEIGHT = 150;
    
  let standardMM = STANDARD_LENGTH * STANDARD_WIDTH * STANDARD_HEIGHT;
  let standardMeter = standardMM / 1e+9;
  let standardLiter = standardMeter * 1000;
  let volStandard = standardLiter;
  let limit = volStandard * 2;
  //console.log(volStandard);
  //console.log(limit);
    
  // client volume:
  let clientMM = length * width * height;
  let clientMeter = clientMM / 1e+9;
  let clientLiter = clientMeter * 1000;
  let volClient = clientLiter;
  //console.log(volClient);

    /*
    Кубический миллиметр в кубический метр: 
    1 кубометр = 1 000 000 000 кубических миллиметров;
    Формула: куб. миллиметр / 1e+9 (или на 1 000 000 000);
    Кубический метр в кубический литр:
    1 м3 = 1000 литров;
    Формула: куб. метр * 1000;
    (перевод из метров в литры необходим для упаковки мелких и сыпучих грузов)
    */
        
  if ( volClient >= limit ) { 
    surchargeVol = (price / 100) * PERCENT_VOL;   
    //console.log(surchargeVol); 
    //console.log('if');      
  } else { 
    surchargeVol = 0;
    //console.log(surchargeVol);  
    //console.log('else');  
  }
    
  // result output:
  let result;
  if ( clientDistance <= STANDARD_DISTANCE ) {  
   result = price + surchargeVol;
  } else if ( clientDistance > STANDARD_DISTANCE  ) { 
    result = (price + surchargeVol) * 2;
  }            
  return result;
    
}  
// calc

})(); // immediately invoked functions

