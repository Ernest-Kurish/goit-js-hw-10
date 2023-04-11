import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const searchBoxEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

function renderCountries(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  } else if (countries.length === 1) {
    renderCountryInfo(countries[0]);
    return;
  } else if (countries.length >= 2 && countries.length <= 10) {
    return renderCountryList(countries);
  } else {
    Notiflix.Notify.failure('Oops, something went wrong');
  }
}

function createCountryInfoMarkup(country) {
  const { name, flags, population, capital } = country;
  const languages = Object.values(country.languages).join(', ');
  return `<li><div class="wrapper"><img src="${flags.svg}" alt="flags" width="120">
    <h2 class="name-country">${name.official}</h2></div>
    <p class="new-style">Capital: ${capital}</p>
    <p class="new-style">Population: ${population}</p>
    <p class="new-style">Language: ${languages}</p>
    </li>`;
}

function createCountryListMarkup(country) {
  const { name, flags } = country;
  return `
  <li>
    <div class="flag-wrapper">
      <img src="${flags.svg}" alt="flags" width="50">
      <h2 class="title-country">${name.official}</h2>
    </div>
  </li>
`;
}

function renderCountryList(countries) {
  const countriesMarkup = countries.map(createCountryListMarkup).join('');
  countryListEl.innerHTML = `<ul>${countriesMarkup}</ul>`;
}

function renderCountryInfo(country) {
  const countryMarkup = createCountryInfoMarkup(country);
  countryInfoEl.innerHTML = `<div>${countryMarkup}<div>`;
  countryListEl.innerHTML = '';
}

function clearInput() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function handleSearch(event) {
  event.preventDefault();
  const searchQuery = searchBoxEl.value.trim();

  if (!searchQuery) {
    clearInput();
    return;
  }

  fetchCountries(searchQuery)
    .then(renderCountries)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      console.log(error);
    });
}

searchBoxEl.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

