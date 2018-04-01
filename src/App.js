//@flow

import React, { Component } from "react";
import { observer } from "mobx-react";
import { Input, Dropdown } from "semantic-ui-react";
import "./App.css";

type Props = {
  store: {
    fetchRates: Function,
    exchangeToRate: string,
    setFromValue: Function,
    setToValue: Function,
    setFromCurrency: Function,
    exchangeFromRate: string,
    setToCurrency: Function,
    state: {
      fromValue: number,
      toValue: number,
      fromCurrencyCode: string,
      toCurrencyCode: string,
    },
  }
}

@observer
class App extends Component<Props> {
  componentDidMount() {
    const { store } = this.props;
        
    store.fetchRates();
    //Fetches rates every 10 seconds
    setInterval(function() {
      store.fetchRates();
      console.log("Rates are fetched");
    }, 10 * 1000);
  }

  getToRate(value: string) {
    const { store } = this.props;
    store.setFromValue(value);
    store.setToValue(store.exchangeToRate);
  }

  getFromRate(value: string) {
    const { store } = this.props;
    store.setToValue(value);
    store.setFromValue(store.exchangeFromRate);
    
  }

  setNewFromCurrency(value: string) {
    const { store } = this.props;
    store.setFromCurrency(value);
    store.setFromValue(store.exchangeFromRate);
  }

  setNewToCurrency(value: string) {
    const { store } = this.props;
    store.setToCurrency(value);
    store.setToValue(store.exchangeToRate);
  }

  render() {
    const {
      fromValue,
      toValue,
      fromCurrencyCode,
      toCurrencyCode
    } = this.props.store.state;   

    const currencies = [
      { key: "EUR", text: "EUR", value: "EUR" },
      { key: "USD", text: "USD", value: "USD" },
      { key: "GBP", text: "GBP", value: "GBP" }
    ];

    return (
      <div className="currency-converter">
        <header className="header">
          <h1 className="header-title">Currency converter</h1>
        </header>
        <div className="converter-container">
          <div className="from-currency">
            <Input
              fluid
              
              value={fromValue}
              label={
                <Dropdown
                  onChange={(event, data) =>
                    this.setNewFromCurrency(data.value)
                  }
                  defaultValue={fromCurrencyCode}
                  options={currencies}
                />
              }
              labelPosition="left"
              onChange={event => this.getToRate(event.target.value)}
            />
          </div>
          <div className="to-currency">
            <Input
              fluid
              value={toValue}
              label={
                <Dropdown
                  onChange={(event, data) => this.setNewToCurrency(data.value)}
                  defaultValue={toCurrencyCode}
                  options={currencies}
                />
              }
              labelPosition="left"
              onChange={event => this.getFromRate(event.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
