import React, { CSSProperties } from 'react';
import { debounceTime, map, mergeMap, takeUntil } from 'rxjs/operators';
import { from, Subject } from 'rxjs';

interface ControlProps {
  setTaxiCount: (taxiCount: string) => {};
  mapReady: () => void;
  taxiCount: string;
}

interface ControlState {
}

interface TaxiResponse {
  drivers: Driver[];
  pickupEta: number;
}

interface Driver {
  driverId: string;
  location: Location;
}

interface Location {
  bearing: number;
  latitude: number;
  longitude: number;
}

class Control extends React.Component<ControlProps, ControlState> {
  private rangeSliderSubject: Subject<string>;
  private unsubscribe: Subject<void> = new Subject();

  constructor(props: ControlProps) {
    super(props);
    // bind context of 'this' to event handler
    this.handleInputChange = this.handleInputChange.bind(this);
    // Subject to handle the debouncing of input values
    this.rangeSliderSubject = new Subject<string>();
  }

  public componentDidMount() {
    // this.fetchTaxiList();
    this.loadInitialControlState();
    this.debounceInputSelection();
  }

  public componentWillUnmount() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  loadInitialControlState() {
    console.log(this.props.taxiCount)
  }

  debounceInputSelection() {
    this.rangeSliderSubject
      .pipe(
        debounceTime(1000),
        takeUntil(this.unsubscribe)
      ).subscribe((debouncedInputvalue: string) => {
        // this.fetchTaxiList();
        console.log(debouncedInputvalue);
        this.props.setTaxiCount(debouncedInputvalue);
      });
  }

  handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const taxiAmount: string = event.target.value;
    // this.setState({value: taxiAmount});
    this.rangeSliderSubject.next(taxiAmount);
    // this.props.getTaxiList(event.target.value);
  }

  fetchTaxiList() {
    /*
    const fetchTaxiListRequest = fetch(`https://qa-interview-test.qa.splytech.io/api/drivers?latitude=51.5049375&longitude=-0.0964509&count=${this.props.setTaxiCount}`);
    from(fetchTaxiListRequest)
      .pipe(
        mergeMap(response => response.json()),
        map(response => ({
            pickupEta: response.pickup_eta,
            drivers: response.drivers.map((driver: any) => ({
              driverId: driver.driver_id,
              location: driver.location
            }))
          })),
        takeUntil(this.unsubscribe)
      ).subscribe(res => {
        console.log(res);
      }, error => {
        // handle network errors
        console.log(error);
      });
      */
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
}

export default Control;
