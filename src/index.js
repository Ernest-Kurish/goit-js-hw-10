import { debounce } from 'lodash';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';


const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const renderCountryList = (countries) => {
  countryList.innerHTML = '';
  for (const country of countries) {
    const { name, flags } = country;
    const listItem = document.createElement('li');
    const flagImg = document.createElement('img');
    flagImg.src = flags.svg;
    flagImg.alt = `${name} flag`;
    listItem.appendChild(flagImg);
    listItem.appendChild(document.createTextNode(name));
    countryList.appendChild(listItem);
  }
};

const renderCountryCard = (country) => {
  const { name, capital, population, flags, languages } = country;
  const card = `
    <div>
      <img src="${flags.svg}" alt="${name} flag" />
      <h2>${name}</h2>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Population:</strong> ${population}</p>
      <p><strong>Languages:</strong> ${languages.map(lang => lang.name).join(', ')}</p>
    </div>
  `;
  countryInfo.innerHTML = card;
};

const handleError = (error) => {
  Notiflix.Notify.failure('Oops, something went wrong. Please try again later.');
  console.error(error);
};

const handleSearch = debounce((event) => {
  const searchTerm = event.target.value.trim();
  if (searchTerm) {
    fetchCountries(searchTerm)
      .then(countries => {
        if (countries.length === 0) {
          Notiflix.Notify.info('Oops, there is no country with that name');
          countryList.innerHTML = '';
          countryInfo.innerHTML = '';
        } else if (countries.length > 10) {
          Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
          renderCountryList(countries.slice(0, 10));
          countryInfo.innerHTML = '';
        } else if (countries.length > 1 && countries.length <= 10) {
          renderCountryList(countries);
          countryInfo.innerHTML = '';
        } else {
          renderCountryCard(countries[0]);
          countryList.innerHTML = '';
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          Notiflix.Notify.info('Oops, there is no country with that name');
        } else {
          handleError(error);
        }
      });
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}, 300);

searchBox.addEventListener('input', handleSearch);

searchBox.addEventListener('keyup', (event) => {
  if (event.key === 'Backspace' && event.target.value.trim() === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
});
