import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { Subject } from 'rxjs';

interface ControlProps {
  setTaxiCount: (taxiCount: string) => {};
  mapReady: () => void;
  taxiCount: string;
}

interface ControlState {
}

const ControlWrapper = styled.span`
  width: 25vw;
  display: flex;
  flex-flow: column wrap;

  @media all and (max-width: 1024px) {
    width: 100vw;
  }
`;

const Span = styled.span`
   text-align: center;
`;

const ControlInput = styled.input`

`;

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
    return(
      <ControlWrapper>
        <Span> Number of Taxis to Display: </Span>
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
      </ControlWrapper>
    );
  }

  private handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const taxiAmount: string = event.target.value;
    this.props.setTaxiCount(taxiAmount);
  }
}

export default Control;
