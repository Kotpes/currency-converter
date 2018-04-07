import { observable, action, computed, runInAction } from "mobx";
import { create, persist } from "mobx-persist";
import localForage from 'localforage'
import { getRates } from "../api/apiClient";

class Store {
  @observable
  state = {
    fromCurrencyCode: "GBP",
    toCurrencyCode: "USD",
    fromValue: 0,
    toValue: 0
  };

  @observable rates = {};

  @persist('object') @observable
  wallets = {
    EUR: 5450.0,
    USD: 1234.45,
    GBP: 545.2
  };

  async fetchRates() {
    this.rates = {};
    try {
      const rates = await getRates();
      // after await, modifying state again, needs an actions:
      runInAction(() => {
        this.rates = rates.data.rates;
      });
    } catch (error) {
      runInAction(() => {
        throw new Error(error);
      });
    }
  }

  @action
  convertCurrency(fromValue, fromWallet, toValue, toWallet) {
    this.wallets[fromWallet] -= fromValue;
    this.wallets[toWallet] += toValue;
  }

  @action
  setFromCurrency(currencyCode) {
    this.state.fromCurrencyCode = currencyCode;
  }

  @action
  setToCurrency(currencyCode) {
    this.state.toCurrencyCode = currencyCode;
  }

  @action
  setFromValue(value) {
    console.log(value);
    
    this.state.fromValue = value ? parseFloat(value, 10) : 0;
  }

  @action
  setToValue(value) {
    this.state.toValue = value ? parseFloat(value, 10) : 0;
  }

  /**
   * Case where you convert Left to Right field
   */
  @computed
  get exchangeToRate() {
    const value = this.state.fromValue;
    const fromCurrencyCode = this.state.fromCurrencyCode;
    const toCurrencyCode = this.state.toCurrencyCode;

    let result;
    if (toCurrencyCode === "USD" && fromCurrencyCode === "USD") {
      return value;
    } else if (toCurrencyCode === "USD") {
      result = value / this.rates[fromCurrencyCode];
      return result.toFixed(2);
    } else if (fromCurrencyCode === "USD") {
      result = value * this.rates[toCurrencyCode];
      return result.toFixed(2);
    } else {
      result =
        value / this.rates[fromCurrencyCode] * this.rates[toCurrencyCode];
      return result.toFixed(2);
    }
  }
  /**
   * Case where you convert Right to Left field
   */
  @computed
  get exchangeFromRate() {
    const value = this.state.toValue;
    const toCurrencyCode = this.state.toCurrencyCode;
    const fromCurrencyCode = this.state.fromCurrencyCode;

    let result;
    if (fromCurrencyCode === "USD" && toCurrencyCode === "USD") {
      return value;
    } else if (toCurrencyCode === "USD") {
      result = value * this.rates[fromCurrencyCode];
      return result.toFixed(2);
    } else if (fromCurrencyCode === "USD") {
      result = value / this.rates[toCurrencyCode];
      return result.toFixed(2);
    } else {
      result =
        value / this.rates[toCurrencyCode] * this.rates[fromCurrencyCode];
      return result.toFixed(2);
    }
  }
}
// Setting up hydrate to get @persist values from localStorage
const hydrate = create({
  storage: localForage,
  jsonify: false,
});

const store = new Store();

export default store;
// hydrating
hydrate('wallets', store);
