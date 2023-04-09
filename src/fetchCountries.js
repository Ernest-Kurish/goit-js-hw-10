fetchCountries
export function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(response => response.json())
    .then(data => data.map(country => ({
      name: country.name.common,
      flags: country.flags,
      capital: country.capital ? country.capital[0] : 'N/A',
      population: country.population ? country.population.toLocaleString() : 'N/A',
      languages: Object.values(country.languages).map(lang => ({ name: lang }))
    })))
    .catch(error => {
      console.error(error);
      throw new Error('Unable to fetch countries');
    });
}