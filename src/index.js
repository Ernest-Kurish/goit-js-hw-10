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

const createCardMarkup = (country) => {
  const { name, capital, population, flags, languages } = country;
  return `
    <div style='margin: 10px; display: flex; align-items: center; gap: 1rem'>
      <img src='${flags.svg}' alt='${name} flag' width=80 style='border: 1px solid #ccc'>
      <span style='font-weight: 500; font-size: 3rem'>${name.official}</span>
    </div>
    <ul style="list-style: none; margin: 10px; padding: 0;font-size: 1.5rem">
      <li><span style='font-weight: 700'>Capital:</span><span style='margin-left: 0.3rem'>${capital}</span></li>
      <li><span style='font-weight: 700'>Population:</span><span style='margin-left: 0.3rem'>${population}</span></li>
      <li><span style='font-weight: 700'>Languages:</span><span style='margin-left: 0.3rem'>${Object.values(languages)}</span></li>
    </ul>
  `;
};

const renderCountryCard = (country) => {
  countryInfo.innerHTML = createCardMarkup(country);
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
          countryList.innerHTML = '';
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
}, 500);

searchBox.addEventListener('input', handleSearch);
