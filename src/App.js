//@flow

import React, { Component } from "react";
import { observer } from "mobx-react";
import {
  Input,
  Dropdown,
  Statistic,
  Button,
  Icon,
  Message
} from "semantic-ui-react";
import { toCurrencyString } from "./utils/utils";
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
    convertCurrency: Function,
    wallets: {
      EUR: number,
      USD: number,
      GBP: number
    },
    state: {
      fromValue: number,
      toValue: number,
      fromCurrencyCode: string,
      toCurrencyCode: string
    }
  }
};

type State = {
  conversionError: boolean,
  conversionErrorMsg: string
};

@observer
class App extends Component<Props, State> {
  state = {
    conversionError: false,
    conversionErrorMsg: ""
  };

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

  clearErrors() {
    this.setState({conversionError: false})
  }

  convertCurrency(
    fromValue: number,
    fromWallet: string,
    toValue: number,
    toWallet: string
  ): void {
    const { store } = this.props;
    const { conversionError } = this.state;
    if (store.wallets[fromWallet] - fromValue < 0) {
      this.setState({
        conversionError: !conversionError,
        conversionErrorMsg: `This is a shitty deal, you are goin negative on your ${fromWallet} wallet!`
      });
    } else {
      store.convertCurrency(fromValue, fromWallet, toValue, toWallet);
    }
  }

  render() {
    const {
      fromValue,
      toValue,
      fromCurrencyCode,
      toCurrencyCode
    } = this.props.store.state;

    const { conversionError, conversionErrorMsg } = this.state;

    const { EUR, USD, GBP } = this.props.store.wallets;
    const wallets = { EUR, USD, GBP };

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
        <div className="wallets">
          {currencies.map(({ key, value }) => {
            return (
              <div className="wallet" key={key}>
                <Statistic size="small">
                  <Statistic.Value>
                    {toCurrencyString(wallets[value], value)}
                  </Statistic.Value>
                  <Statistic.Label>{value}</Statistic.Label>
                </Statistic>
              </div>
            );
          })}
        </div>
        <div className="converter-container">
          <div className="from-currency">
            <Input
              fluid
              type="number"
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
              onFocus={() => this.clearErrors()}
            />
          </div>
          <div className="to-currency">
            <Input
              fluid
              type="number"
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
              onFocus={() => this.clearErrors()}
            />
          </div>
          <div className="convert-container">
            <Button.Group fluid={true}>
              <Button
                negative={conversionError}
                color="blue"
                onClick={() =>
                  this.convertCurrency(
                    fromValue,
                    fromCurrencyCode,
                    toValue,
                    toCurrencyCode
                  )
                }
              >
                {toCurrencyString(fromValue, fromCurrencyCode)}
                <Icon name="right arrow" className="arrow-right-icon" />{" "}
                {toCurrencyString(toValue, toCurrencyCode)}
              </Button>
              <Button.Or />
              <Button
                negative={conversionError}
                color="green"
                onClick={() =>
                  this.convertCurrency(
                    toValue,
                    toCurrencyCode,
                    fromValue,
                    fromCurrencyCode
                  )
                }
              >
                {toCurrencyString(toValue, toCurrencyCode)}
                <Icon name="right arrow" className="arrow-right-icon" />{" "}
                {toCurrencyString(fromValue, fromCurrencyCode)}
              </Button>
            </Button.Group>
            {conversionError && (
              <Message negative floating>
                <p>{conversionErrorMsg}</p>
              </Message>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
