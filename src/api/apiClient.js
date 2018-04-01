import axios from 'axios'
const {REACT_APP_APP_ID} = process.env

export const getRates = async (currencyCode) => {
    const requestUrl = `https://openexchangerates.org/api/latest.json?app_id=${REACT_APP_APP_ID}&symbols=GBP,EUR`;
    const response = await axios.get(requestUrl);
    
    return response;
}
