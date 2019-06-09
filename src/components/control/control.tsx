import React, { CSSProperties } from 'react';
import { Subject } from 'rxjs';

interface ControlProps {
  setTaxiCount: (taxiCount: string) => {};
  mapReady: () => void;
  taxiCount: string;
}

interface ControlState {
}

class Control extends React.Component<ControlProps, ControlState> {
  private unsubscribe: Subject<void> = new Subject();

  constructor(props: ControlProps) {
    super(props);
    // bind context of 'this' to event handler
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  public componentWillUnmount() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public render() {
    const wrapperStyle: CSSProperties = {
      width: '25vw',
      height: '100vh',
      display: 'flex',
      flexFlow: 'column wrap'
    };
    const labelStyle: CSSProperties = {
      textAlign: 'center'
    };
    return(
      <div style={wrapperStyle}>
        <span style={labelStyle}> Number of Taxis to Display: </span>
        <input
          id="taxiRangeSlider"
          type="range"
          min="1"
          max="50"
          value={this.props.taxiCount}
          onChange={this.handleInputChange}
          step="1"
        />
        <input
          id="taxi"
          type="number"
          min="1"
          max="50"
          value={this.props.taxiCount}
          onChange={this.handleInputChange}
        />
      </div>
    );
  }

  private handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const taxiAmount: string = event.target.value;
    this.props.setTaxiCount(taxiAmount);
  }
}

export default Control;
