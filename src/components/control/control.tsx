import React, { CSSProperties } from 'react';

interface Props {

}

interface State {
  value: any;
}

class Control extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      value: 5
    };
    // bind context of 'this' to event handler
    this.handleChange = this.handleChange.bind(this);
  }

  public componentDidMount() {

  }

  public componentWillUnmount() {

  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({value: Number(event.target.value)});
  }

  public render() {
    const wrapperStyle: CSSProperties = {
      width: '25vw',
      height: '100vh'
    };
    return(
      <div style={wrapperStyle}>
        <input
          id="taxiRangeSlider"
          type="range"
          min="0"
          max="50"
          value={this.state.value}
          onChange={this.handleChange}
          step="1"
        />
      </div>
    );
  }
}

export default Control;
