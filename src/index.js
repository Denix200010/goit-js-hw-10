import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import fetching from './fetching'

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const containerCountryRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
    const queryValue = e.target.value.trim();
    if (queryValue === '') {
        clearMarkup([listRef, containerCountryRef])
        return;
    }
    fetching(queryValue)
        .then(countries => {
            if (countries.length > 10) {
                clearMarkup([listRef, containerCountryRef]);

                return Notify.info('Too many matches found. Please enter a more specific name.')
            }
            if (countries.length > 1) {
                clearMarkup([listRef, containerCountryRef]);
                
                appendListCountries(makeCards(countries));
            }
            if (countries.length === 1) {
                clearMarkup([listRef, containerCountryRef]);
                appendDivCountry(makeCountryContainer(countries));
            }
        })
        .catch(() => {
            clearMarkup([listRef, containerCountryRef])
            Notify.failure('Oops, there is no country with that name!')
        });;
}

function makeCards(countries) {
    return countries
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="25" height="18">${name.official}</li>`,
    )
    .join('');
}

function makeCountryContainer(country) {
     return country.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${name.official}" width="40" height="40">${
        name.official
      }</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
  );
}

function appendDivCountry(country) {
    containerCountryRef.innerHTML = country;
}

function appendListCountries(countries) {
    listRef.innerHTML = countries;
}

function clearMarkup(elements) {
    elements.forEach(elem => elem.innerHTML = '')
}