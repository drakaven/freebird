import React, {Component} from 'react';
import TextField from 'material-ui/TextField';

export default class Welcome extends Component {

  render() {
    return (
      <div>
        <TextField
          hintText="Clarice is that you?"
          floatingLabelText="They call me..."
          onKeyUp={this.props.handleNewName.bind()}
        />
      </div>
    )
  };
};
