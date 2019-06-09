import { map, mergeMap, catchError } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { TaxiResponse } from '../models/taxi-response';

const getTaxiList = (taxiCount: string) => {
  const fetchTaxiListRequest = fetch(`https://qa-interview-test.qa.splytech.io/api/drivers?latitude=51.5049375&longitude=-0.0964509&count=${taxiCount}`);
  return from(fetchTaxiListRequest)
    .pipe(
      mergeMap(response => response.json()),
      map(response => ({
          pickupEta: response.pickup_eta,
          drivers: response.drivers.map((driver: any) => ({
            driverId: driver.driver_id,
            location: driver.location
          }))
        })),
      catchError(error => of({ error: true, message: error.message }))
    ) as Observable<TaxiResponse>;
};

export {
  getTaxiList
};
