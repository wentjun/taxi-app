import { from, Subject } from 'rxjs';
import { debounceTime, mergeMap } from 'rxjs/operators';
import React, { CSSProperties } from 'react';

interface Props {

}

interface State {
  value: string;
}

class Control extends React.Component<Props, State> {
  private rangeSliderSubject: Subject<string>;

  constructor(props: Props) {
    super(props);
    this.state = {
      value: '5'
    };
    // bind context of 'this' to event handler
    this.handleInputChange = this.handleInputChange.bind(this);
    // Subject to handle the debouncing of input values
    this.rangeSliderSubject = new Subject<string>();
  }

  public componentDidMount() {
    this.fetchTaxiList();
    this.debounceInputSelection();
  }

  public componentWillUnmount() {

  }

  debounceInputSelection() {
    this.rangeSliderSubject
      .pipe(
        debounceTime(1000)
      ).subscribe((debouncedInputvalue: string) => {
        this.fetchTaxiList();
      });
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const taxiAmount: string = event.target.value;
    this.setState({value: taxiAmount});
    this.rangeSliderSubject.next(taxiAmount);
  }

  fetchTaxiList() {
    const fetchTaxiListRequest = fetch(`https://qa-interview-test.qa.splytech.io/api/drivers?latitude=51.5049375&longitude=-0.0964509&count=${this.state.value}`);
    from(fetchTaxiListRequest)
      .pipe(
        mergeMap(response => response.json())
      ).subscribe(res => {
        console.log(res);
      }, error => {
        // handle network errors
        console.log(error);
      });
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
          value={this.state.value}
          onChange={this.handleInputChange}
          step="1"
        />
        <input
          id="taxi"
          type="number"
          min="1"
          max="50"
          value={this.state.value}
          onChange={this.handleInputChange}
        />
      </div>
    );
  }
}

export default Control;
