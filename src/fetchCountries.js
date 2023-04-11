async function fetchCountries(name) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`);
    
    if (!response.ok) {
      throw new Error('Oops, there is no country with that name');
    }
    
    const countries = await response.json();
    
    return countries;
  } catch (error) {
    console.error(error);
    throw new Error('Oops, something went wrong');
  }
}

export { fetchCountries };
