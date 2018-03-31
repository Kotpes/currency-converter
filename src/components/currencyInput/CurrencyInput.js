import React, { Component } from 'react';
import {Input, Dropdown} from 'semantic-ui-react';
import { observer } from 'mobx-react';

@observer
class CurrencyInput extends Component {
    state = {
        selectedCurrency: this.props.defaultCurrency,
        value: this.props.value
    }
    handleOnChange(data) {
        const {setCurrency} = this.props        
        setCurrency(data.value)   
    }
    render() {        
        const {currencies, defaultCurrency, onKeyUp} = this.props        
        const {selectedCurrency, value} = this.state
        
        return (
            <div>
                <Input
                    fluid
                    value={value}
                    label={<Dropdown onChange={(event, data) => this.handleOnChange(data)} defaultValue={defaultCurrency} options={currencies} />}
                    labelPosition='left'
                    defaultValue={0}
                    onKeyUp={onKeyUp}
                />
            </div>
        );
    }
}

export default CurrencyInput;