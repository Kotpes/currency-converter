import React, { Component } from "react";
import CurrencyInput from "./components/currencyInput/CurrencyInput";
import { observer } from "mobx-react";
import {Input, Dropdown} from 'semantic-ui-react';
import "./App.css";
import { getRates } from "./api/apiClient";

@observer
class App extends Component {
  state = {
    fromValue: undefined,
    toValue: undefined
  };

  componentDidMount() {
    const { store } = this.props;
    this.setState({
      fromValue: store.fromValue,
      fromCurrency: store.fromCurrencyCode,
      toValue: store.toValue,
      toCurrency: store.toCurrencyCode
    });
  }

  getToRate(value) {
    const {store} = this.props
    store.setFromValue(value)
    store.setToValue(store.exchangeToRate)    
  }

  getFromRate(value) {
    const {store} = this.props
    store.setToValue(value)
    store.setFromValue(store.exchangeFromRate)
  }

  test(code) {
    this.props.store.setFromCurrency(code)
  }

  render() {
    const {fromValue, toValue, fromCurrencyCode, toCurrencyCode} = this.props.store.state  
    const {store} = this.props  
    console.log(this.props.store);
      

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
                  onChange={(event, data) => store.setFromCurrency(data.value)}
                  defaultValue={fromCurrencyCode}
                  options={currencies}
                />
              }
              labelPosition="left"
              onChange={(event) => this.getToRate(event.target.value)}
            />
          </div>
          <div className="to-currency">
          <Input
              fluid
              value={toValue}
              label={
                <Dropdown
                  onChange={(event, data) => store.setToCurrency(data.value)}
                  defaultValue={toCurrencyCode}
                  options={currencies}
                />
              }
              labelPosition="left"
              onChange={(event) => this.getFromRate(event.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
