import { observable, action, computed, runInAction, autorun } from "mobx";
import { getRates } from "../api/apiClient";

class Store {
    @observable state = {
        fromCurrencyCode: "GBP",
        toCurrencyCode: "USD",
        fromValue: 0,
        toValue: 0,
    };

    @observable rates = {};
    @observable status = "pending" //done;
    
    @action setFromCurrency(currencyCode) {
        this.state.fromCurrencyCode = currencyCode
    }

    @action setToCurrency(currencyCode) {
        this.state.toCurrencyCode = currencyCode
    }

    @action setFromValue(value) {        
        this.state.fromValue = value ? parseFloat(value, 10) : 0
    }

    @action setToValue(value) {
        this.state.toValue = value ? parseFloat(value, 10) : 0
    }

    @computed get exchangeToRate() {
        const value = this.state.fromValue
        const fromCurrencyCode = this.state.fromCurrencyCode
        const toCurrencyCode = this.state.toCurrencyCode

        let result
        if (toCurrencyCode === "USD") {
            result =  value / this.rates[fromCurrencyCode]
            return result.toFixed(2);
            
        } else {
            result = (value / this.rates[fromCurrencyCode]) * this.rates[toCurrencyCode]
            return result.toFixed(2);
        }
    }

    @computed get exchangeFromRate() {
        const value = this.state.toValue;
        const toCurrencyCode = this.state.toCurrencyCode;
        const fromCurrencyCode = this.state.fromCurrencyCode;

        let result
        if (toCurrencyCode === "USD") {
            result =  value * this.rates[fromCurrencyCode];
            console.log(this.rates[fromCurrencyCode]);
            
            return result.toFixed(2);
            
        } else {
            result = (value / this.rates[toCurrencyCode]) * this.rates[fromCurrencyCode];
            return result.toFixed(2);
        }
    }

    @action
    async fetchRates() {
        this.rates = {};
        this.status = "pending";
        try {
            const rates = await getRates();
            // after await, modifying state again, needs an actions:
            runInAction(() => {              
                this.status = "done";
                this.rates = rates.data.rates;
            })
        } catch (error) {
            runInAction(() => {
                this.status = error
            })
        }
    }

    // @computed get exchangeRate(direction) {
    //     switch (direction) {
    //         case "to":
    //             this.state.toValue = 0
    //             return this.state.fromValue + 1
    //             break;
    //         case "from":
    //             return this.state.toValue + 1
    //             break;

    //         default:
    //             break;
    //     }
    // }
}

const store = new Store()

export default store

autorun(() => {
    store.fetchRates()
})