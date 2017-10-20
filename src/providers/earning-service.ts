/**
 * Created by Andrey Okhotnikov on 20.10.17.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class EarningService {

    constructor(public http: HttpClient) {
        console.log('Init EarningServiceProvider');
    }

    getTotal() {

    }

    getMonthlyData() {

    }

    getQuarterlyData() {
        return [
            {
                year: 2017,
                quarters: [423523, 23423.23, 3123.00, 1233.22]
            },
            {
                year: 2016,
                quarters: [423523, 23423.23, 3123.00, 1233.22]
            },
            {
                year: 2015,
                quarters: [423523, 23423.23, 3123.00, 1233.22]
            }
        ]
    }

    getYearlyData() {
        return [
            {
                year: 2017,
                amount: 125633.22
            },
            {
                year: 2016,
                amount: 1286733.50
            },
            {
                year: 2015,
                amount: 423523
            }
        ]
    }

}

