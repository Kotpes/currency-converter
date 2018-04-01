# What is this
Simple proof-of-concept React app that offers simple conversion between EUR, GBP and USD. App uses latest exchanges rates provided by http://openexchangerates.org API

## Prerequesits
- [Yarn](https://yarnpkg.com) dependency manager
- I'm using free account on openexchangerates.org, so `.env` has `APP_ID` var included. Otherwise, it should be in `.gitignore`


## Tech stack
- Based on [react-create-app ](https://github.com/facebook/create-react-app)
- Uses [mobx](https://mobx.js.org) mobx for global state management (redux would be overkill)
- Uses [flow](https://flow.org) for static type checking
- Uses awesome [Semantic-UI](https://github.com/Semantic-Org/Semantic-UI-React) library for inputs and dropdowns
- Uses `css-grid` for layout

## How to run
- Clone the project, `cd` into it and run `yarn` to install dependencies
- Run `yarn start` to run the project (will be opened in a browser window)
- You might need to install `flow-bin` globally too. Just run `npm install flow-bin -g`

