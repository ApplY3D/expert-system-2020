const selectsDiv = document.getElementById('selects');
const alternativesDiv = document.getElementById('all-alternatives');
const checkBtn = document.getElementById('check-btn');
const addBtn = document.getElementById('add-btn');
const changeCriteriasBtn = document.getElementById('change-criterias-btn');
const changeAlternativesBtn = document.getElementById('change-alters-btn');

let criterias = [
  { value: 'RAM', options: ['8GB', '10GB', '16GB'] },
  { value: 'Storage Capacity', options: ['~500GB', '~800GB', '~1000GB'] },
  { value: 'GPU performance', options: ['Medium', 'High'] },
  { value: 'Weight', options: ['2kg', '~3kg', '4.5kg'] },
  { value: 'Price', options: ['Low', 'Medium', 'High'] },
];

let alternatives = [
  {
    alternativeName: 'PS4 PRO',
    RAM: '8GB',
    'Storage Capacity': '~1000GB',
    'GPU performance': 'Medium',
    Weight: '~3kg',
    Price: 'Medium',
  },
  {
    alternativeName: 'PS5',
    RAM: '16GB',
    'Storage Capacity': '~800GB',
    'GPU performance': 'High',
    Weight: '2kg',
    Price: 'High',
  },
  {
    alternativeName: 'Xbox Series S',
    RAM: '10GB',
    'Storage Capacity': '~500GB',
    'GPU performance': 'Medium',
    Weight: '4.5kg',
    Price: 'Low',
  },
  {
    alternativeName: 'Xbox Series X',
    RAM: '16GB',
    'Storage Capacity': '~1000GB',
    'GPU performance': 'High',
    Weight: '4.5kg',
    Price: 'High',
  },
];

// Сравнивает объект, который мы выбрали со всеми и делает отчет
function checkAltersWithSelectedCriterias(checkObject) {
  let result = [];
  alternatives.forEach((alter, i) => {
    let currentIterationInformation = {};
    let similarities = 0; // сходства
    let allVariants = criterias.length; // все поля в альтернативе кроме имени

    for (let prop in checkObject) {
      if (checkObject[prop] === alter[prop]) {
        currentIterationInformation[prop] = true;
        similarities++;
      } else {
        currentIterationInformation[prop] = false;
      }
    }

    result[i] = {
      alternativeName: alter.alternativeName,
      similarities: `${similarities}/${allVariants}`,
      persetage: similarities / allVariants,
      ...currentIterationInformation,
    };
  });
  return result;
}

// Сортирует массив объектов по значению сходства
function sortAlters(alters) {
  return alters.sort((a, b) => {
    return b.persetage - a.persetage;
  });
}

// Получает данные из всех select и создает объект с этими свойствами
function getValues() {
  const allSelectsNodes = document.querySelectorAll('select');
  const allSelects = Array.prototype.slice.call(allSelectsNodes);
  let checkObject = allSelects.reduce((acc, select) => {
    return { ...acc, [select.name]: select.value };
  }, {});
  return checkObject;
}

function checkBtnClick() {
  const checkObject = getValues();
  const res = checkAltersWithSelectedCriterias(checkObject);
  const sortedRes = sortAlters(res);
  outputResults(sortedRes);
}

function addBtnClick() {
  let checkObject = getValues();
  const alternativeName = prompt(`Как хотите назвать альтернативу?`);
  checkObject = { alternativeName, ...checkObject };
  alternatives.push(checkObject);
  renderAllAlternatives();
}

//!! --------------- КРИТЕРИИ

function closeCriteriasModal() {
  document.getElementById('modal-criterias').remove();
}

function saveCriteriasModal() {
  const newCriterias = parseCriterias();
  criterias = newCriterias;
  document.getElementById('modal-criterias').remove();
  render();
}

// Открыть модальное окно с настройкой критериев
function changeCriteriasBtnClick() {
  if (!document.getElementById('modal-criterias')) {
  } else {
    document.getElementById('modal-criterias').remove();
  }

  const modal = document.createElement('div');
  modal.id = 'modal-criterias';

  criteriasString = stringifyCriterias();
  modal.innerHTML = `
    <b>Изменить критерии: </b>
    <br>
    <button onClick="closeCriteriasModal()">Закрыть</button>
    <textarea rows="10" cols="40">${criteriasString}</textarea>
    <button onClick="saveCriteriasModal()">Сохранить</button>
  `;
  document.body.insertAdjacentElement('beforeend', modal);
}

// Получаем критерии из строки
function parseCriterias() {
  const modal = document.getElementById('modal-criterias');
  const value = modal.querySelector('textarea').value.trim();
  if (!value) {
    return throwError('Нет значений критериев');
  }
  let criteriasArray = value.split(';\n\n');
  criteriasArray = criteriasArray.map((criteriaString) => {
    return criteriaString.split(':\n');
  });
  const criteriasObject = criteriasArray.map((criteriaArr) => {
    return {
      value: criteriaArr[0],
      options: criteriaArr[1].split(', '),
    };
  });
  return criteriasObject;
}

// Преобразование критериев в строку
function stringifyCriterias() {
  return (
    criterias
      .map((criteria) => {
        return `${criteria.value}:\n${criteria.options.join(', ')};\n\n`;
      })
      .join('') + 'конец.'
  ).replace(';\n\nконец.', '');
}

//!! --------------- АЛЬТЕРНАТИВЫ
// Открыть модальное окно с настройкой альтернатив
function changeAlternativesBtnClick() {
  if (!document.getElementById('modal-alternatives')) {
  } else {
    document.getElementById('modal-alternatives').remove();
  }

  const modal = document.createElement('div');
  modal.id = 'modal-alternatives';

  alternativesString = stringifyAlternatives();
  modal.innerHTML = `
    <b>Изменить альтернативы: </b>
    <br>
    <button onClick="closeAlternativesModal()">Закрыть</button>
    <textarea rows="10" cols="40">${alternativesString}</textarea>
    <button onClick="saveAlternativesModal()">Сохранить</button>
  `;
  document.body.insertAdjacentElement('beforeend', modal);
}

function closeAlternativesModal() {
  document.getElementById('modal-alternatives').remove();
}

function saveAlternativesModal() {
  const newAlternatives = parseAlternatives();
  alternatives = newAlternatives;
  document.getElementById('modal-alternatives').remove();
  render();
}

// Получаем альтернативы из строки
function parseAlternatives() {
  const modal = document.getElementById('modal-alternatives');
  const value = modal.querySelector('textarea').value.trim();
  if (!value) {
    return throwError('Нет значений альтернатив');
  }
  let alternativesArray = value.split(';\n\n');
  alternativesArray = alternativesArray.map((alterString) => {
    return alterString.split(':\n');
  });

  alternativesObject = alternativesArray.map((alternativeArr) => {
    let keyValuePairStringArr = alternativeArr[1].split(';\n');
    let tempObj = {};
    keyValuePairStringArr.forEach((keyValuePair) => {
      let key = keyValuePair.split(' - ')[0];
      let value = keyValuePair.split(' - ')[1];
      tempObj[key] = value;
    });
    return { alternativeName: alternativeArr[0], ...tempObj };
  });
  return alternativesObject;
}

// Преобразование альтернатив в строку
function stringifyAlternatives() {
  return (
    alternatives
      .map((alter) => {
        let alterValues = '';
        for (let prop in alter) {
          alterValues +=
            prop !== 'alternativeName' ? `${prop} - ${alter[prop]};\n` : '';
        }
        return `${alter.alternativeName}:\n${alterValues}\n`;
        // return `${criteria.value}:\n${criteria.options.join(", ")};\n\n`;
      })
      .join('') + 'конец.'
  ).replace(';\n\nконец.', '');
}

// function renderFoundAlters(arrayOfAlters) {
//   if (!arrayOfAlters) {
//     return;
//   }
//   if (!document.getElementById("table")) {
//     document.body.insertAdjacentElement("beforeend");
//   } else {
//     document.getElementById("table").remove();
//   }
// }

// Отрисовывает все варианты выборов
function renderOptions() {
  // Очищаем в случае ререндера
  selectsDiv.innerHTML = '<b>Критерии: </b>';
  for (let i = 0; i < criterias.length; i++) {
    let value = criterias[i].value;
    let options = criterias[i].options;
    let appendEl = document.createElement('div');
    appendEl.className = 'select-item';
    appendEl.innerHTML = `
        <label>${value}</label>
        <select name="${value}">
            <option value="Не указано">Не указано</option>
            ${options
              .map((option) => `<option value="${option}">${option}</option>`)
              .join('')}
        </select>
      `;
    selectsDiv.insertAdjacentElement('beforeend', appendEl);
  }
}

// Отрисовка всех возможных альтернатив
function renderAllAlternatives() {
  let allAlternatives = alternatives
    .map((alter) => {
      let alterBody = '';
      for (let prop in alter) {
        alterBody +=
          prop !== 'alternativeName'
            ? `<p>${prop} - <span>${alter[prop]}</span></p>`
            : `<b>${alter[prop]}</b>`;
      }
      return '<div class="alternative">' + alterBody + '</div>';
      // return `</br> <div class="alternative">${alterBody}</div>`
    })
    .join('');
  alternativesDiv.innerHTML =
    '<b>Альтернативы: </b>' +
    '<div class="alternatives">' +
    allAlternatives +
    '</div>';
}

function throwError(error) {
  alert(error);
  throw error;
}

function outputResults(res) {
  console.log(res);
  alert('Проверьте консоль');
}

function render() {
  renderOptions();
  renderAllAlternatives();
}

render();

checkBtn.addEventListener('click', checkBtnClick);
addBtn.addEventListener('click', addBtnClick);
changeCriteriasBtn.addEventListener('click', changeCriteriasBtnClick);
changeAlternativesBtn.addEventListener('click', changeAlternativesBtnClick);
