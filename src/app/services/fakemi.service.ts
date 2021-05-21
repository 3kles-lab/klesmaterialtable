import { Injectable } from '@angular/core';
import { IMIRequest, IMIResponse, MIRecord } from '@infor-up/m3-odin';
import { Observable, of, Subject } from 'rxjs';
import { map, tap, delay, switchMap } from 'rxjs/operators';

@Injectable()
export class FakeApiService {

    constructor() { }

    execute(record: IMIRequest): Observable<IMIResponse> {
        const transaction = record.program + '_' + record.transaction;
        switch (transaction) {
            case 'MMS005MI_LstWarehouses':
                return this.listWarehouse(record);
            case 'MMS200MI_GetItmBasic':
                return this.getItemBasic(record);
            case 'MMS019MI_Get':
                return this.getSKU(record);
            case 'PMS120MI_LstOrderType':
                return this.listOrderType(record);
            case 'CRS912MI_LstSeason':
                return this.listSeason(record);
            case 'MMS016MI_Get':
                return this.getStyle(record);
            case 'PDS050MI_List':
                return this.listOption(record);
            case 'PDS050MI_Get':
                return this.getOption(record);
            case 'MMS162MI_LstStyleItem':
                return this.listStyleItem(record);
            case 'MNS150MI_LstUserData':
                return this.listUser(record);
        }
    }

    listWarehouse(record: IMIRequest): Observable<IMIResponse> {
        const items = [
            {
                WHLO: '101',
                WHNM: 'WHLO 101',
            },
            {
                WHLO: '200',
                WHNM: 'WHLO 200',
            },
            {
                WHLO: '220',
                WHNM: 'WHLO 220',
            },
            {
                WHLO: '943',
                WHNM: 'WHLO 943',
            },
            {
                WHLO: 'A01',
                WHNM: 'WHLO A01',
            },
            {
                WHLO: 'BBB',
                WHNM: 'WHLO BBB',
            }
        ];
        const answer: IMIResponse = {
            hasError: null,
            metadata: null,
            program: 'MMS005MI',
            transaction: 'LstWarehouses',
            item: items[0],
            items: items.map((item) => item),
        };

        return of(answer).pipe(
            delay(this.getRandomMs()),
            map(() => {
                return answer;
            }),
        );
    }

    getItemBasic(record: IMIRequest): Observable<IMIResponse> {
        const items = [
            {
                ITNO: "AMB01-Y02-008",
                ITDS: "AMB01 ITDS",
            },
            {
                ITNO: "AMB01-Y02-006",
                ITDS: "AMB01 ITDS",
            },
            {
                ITNO: "AMB01-Y02-004",
                ITDS: "AMB01 ITDS",
            },
            {
                ITNO: "AMB01-Y01-008",
                ITDS: "AMB01 ITDS",
            },
            {
                ITNO: "AMB01-Y03-008",
                ITDS: "AMB01 ITDS",
            },
            {
                ITNO: "AMB02-Y02-008",
                ITDS: "AMB02 ITDS",
            },
            {
                ITNO: "AMB02-Y01-005",
                ITDS: "AMB02 ITDS",
            },
            {
                ITNO: "AMB03-Y02-008",
                ITDS: "AMB03 ITDS",
            },
            {
                ITNO: "AMB02-Y05-006",
                ITDS: "AMB02 ITDS",
            },
            {
                ITNO: "AMB03-Y01-008",
                ITDS: "AMB03 ITDS",
            },
            {
                ITNO: "AMB04-Y02-008",
                ITDS: "AMB04 ITDS",
            },
            {
                ITNO: "AMB05-Y02-008",
                ITDS: "AMB05 ITDS",
            },
            {
                ITNO: "AMB05-Y04-003",
                ITDS: "AMB05 ITDS",
            },
            {
                ITNO: "AMB02-Y03-008",
                ITDS: "AMB01 ITDS",
            },
            {
                ITNO: "AMB02-Y03-004",
                ITDS: "AMB02 ITDS",
            },
        ];
        const item = items.find(f => f.ITNO === record.record.ITNO);

        const answer: IMIResponse = {
            hasError: null,
            metadata: null,
            program: 'MM200MI',
            transaction: 'GetItemBasic',
            item: item,
            items: [item]
        };

        if (!item) {
            answer.errorCode = 'WIT0102';
            answer.errorMessage = "Item number doesn't exist";
        }

        return of(answer).pipe(
            delay(this.getRandomMs()),
            map(() => {
                return answer;
            }),
        );
    }

    getSKU(record: IMIRequest): Observable<IMIResponse> {
        const items = [
            {
                ITNO: "AMB01-Y02-008",
                STYN: "AMB01",
                ITDS: "AMB01 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB01-Y02-006",
                STYN: "AMB01",
                ITDS: "AMB01 ITDS",
                OPTX: "X006",
                TX15: "6",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB01-Y02-004",
                STYN: "AMB01",
                ITDS: "AMB01 ITDS",
                OPTX: "X004",
                TX15: "4",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB01-Y01-008",
                STYN: "AMB01",
                ITDS: "AMB01 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY01",
                TY15: "Red",
            },
            {
                ITNO: "AMB01-Y03-008",
                STYN: "AMB01",
                ITDS: "AMB01 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY03",
                TY15: "Blue",
            },
            {
                ITNO: "AMB02-Y02-008",
                STYN: "AMB02",
                ITDS: "AMB02 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB02-Y01-005",
                STYN: "AMB02",
                ITDS: "AMB02 ITDS",
                OPTX: "X005",
                TX15: "5",
                OPTY: "YY01",
                TY15: "Red",
            },
            {
                ITNO: "AMB03-Y02-008",
                STYN: "AMB03",
                ITDS: "AMB03 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB02-Y05-006",
                STYN: "AMB02",
                ITDS: "AMB02 ITDS",
                OPTX: "X006",
                TX15: "6",
                OPTY: "YY05",
                TY15: "Yellow",
            },
            {
                ITNO: "AMB03-Y01-008",
                STYN: "AMB03",
                ITDS: "AMB03 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY01",
                TY15: "Red",
            },
            {
                ITNO: "AMB04-Y02-008",
                STYN: "AMB04",
                ITDS: "AMB04 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB05-Y02-008",
                STYN: "AMB05",
                ITDS: "AMB05 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB05-Y04-003",
                STYN: "AMB05",
                ITDS: "AMB05 ITDS",
                OPTX: "X003",
                TX15: "3",
                OPTY: "YY04",
                TY15: "Black",
            },
            {
                ITNO: "AMB02-Y03-008",
                STYN: "AMB02",
                ITDS: "AMB01 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY03",
                TY15: "Blue",
            },
            {
                ITNO: "AMB02-Y03-004",
                STYN: "AMB02",
                ITDS: "AMB02 ITDS",
                OPTX: "X004",
                TX15: "4",
                OPTY: "YY03",
                TY15: "Blue",
            },
        ];
        const item = items.find(f => f.ITNO === record.record.ITNO);

        const answer: IMIResponse = {
            hasError: null,
            metadata: null,
            program: 'MM019MI',
            transaction: 'Get',
            item: item,
            items: [item]
        };

        if (!item) {
            answer.errorCode = 'ED81002';
            answer.errorMessage = "Record doesn't exist MMS019MI";
        }
        return of(answer).pipe(
            delay(this.getRandomMs()),
            map(() => {
                return answer;
            }),
        );
    }

    listOrderType(record: IMIRequest): Observable<IMIResponse> {
        const items = [
            {
                ORTY: 'A01',
                TX15: 'ORTY A01',
            },
            {
                ORTY: 'A02',
                TX15: 'ORTY A02',
            },
            {
                ORTY: 'A03',
                TX15: 'ORTY A03',
            },
            {
                ORTY: 'A04',
                TX15: 'ORTY A04',
            }
        ];
        const answer: IMIResponse = {
            hasError: null,
            metadata: null,
            program: 'PMS120MI',
            transaction: 'LstOrderType',
            item: items[0],
            items: items.map((item) => item),
        };

        return of(answer).pipe(
            delay(this.getRandomMs()),
            map(() => {
                return answer;
            }),
        );
    }

    listSeason(record: IMIRequest): Observable<IMIResponse> {
        const items = [
            {
                SEA1: 'SUMMER',
                TX15: 'Summer seaon'
            },
            {
                SEA1: 'WINTER',
                TX15: 'Winter seaon'
            },
            {
                SEA1: 'SPRING',
                TX15: 'Spring seaon'
            },
            {
                SEA1: 'AUTUMN',
                TX15: 'Autumn seaon'
            }
        ];
        const answer: IMIResponse = {
            hasError: null,
            metadata: null,
            program: 'CRS912MI',
            transaction: 'LstSeason',
            item: items[0],
            items: items.map((item) => item),
        };

        return of(answer).pipe(
            delay(this.getRandomMs()),
            map(() => {
                return answer;
            }),
        );
    }

    getStyle(record: IMIRequest): Observable<IMIResponse> {
        const items = [
            {
                STYN: "AMB01",
                ITDS: "AMB01 ITDS",
            },
            {
                STYN: "AMB02",
                ITDS: "AMB02 ITDS",
            },
            ,
            {
                STYN: "AMB03",
                ITDS: "AMB03 ITDS",
            }
            ,
            {
                STYN: "AMB04",
                ITDS: "AMB04 ITDS",
            }
            ,
            {
                STYN: "AMB05",
                ITDS: "AMB05 ITDS",
            }
        ];

        console.log('Record STYN=', record.record.STYN);
        console.log('List STYN=', items.map(m => m.STYN))
        const item = items.find(f => f?.STYN === record.record?.STYN);

        const answer: IMIResponse = {
            hasError: null,
            metadata: null,
            program: 'MM016MI',
            transaction: 'Get',
            item: item,
            items: [item]
        };

        if (!item) {
            answer.errorCode = 'WSTB103';
            answer.errorMessage = "Style doesn't exist MMS016MI";
        }

        return of(answer).pipe(
            delay(this.getRandomMs()),
            map(() => {
                return answer;
            }),
        );
    }

    listOption(record: IMIRequest): Observable<IMIResponse> {
        const items = [
            {
                OPTN: 'X002',
                OGRP: 'X',
                TX15: '2',
                TX30: 'Size 2'
            },
            {
                OPTN: 'X003',
                OGRP: 'X',
                TX15: '3',
                TX30: 'Size 3'
            },
            {
                OPTN: 'X004',
                OGRP: 'X',
                TX15: '4',
                TX30: 'Size 4'
            },
            {
                OPTN: 'X005',
                OGRP: 'X',
                TX15: '5',
                TX30: 'Size 5'
            },
            {
                OPTN: 'X006',
                OGRP: 'X',
                TX15: '6',
                TX30: 'Size 6'
            },
            {
                OPTN: 'X007',
                OGRP: 'X',
                TX15: '7',
                TX30: 'Size 7'
            },
            {
                OPTN: 'X008',
                OGRP: 'X',
                TX15: '8',
                TX30: 'Size 8'
            },
            {
                OPTN: 'YY01',
                OGRP: 'Y',
                TX15: 'red',
                TX30: 'Red'
            },
            {
                OPTN: 'YY02',
                OGRP: 'Y',
                TX15: 'green',
                TX30: 'Green'
            },
            {
                OPTN: 'YY03',
                OGRP: 'Y',
                TX15: 'blue',
                TX30: 'Blue'
            },
            {
                OPTN: 'YY04',
                OGRP: 'Y',
                TX15: 'black',
                TX30: 'Black'
            },
            {
                OPTN: 'YY05',
                OGRP: 'Y',
                TX15: 'Yellow',
                TX30: 'yellow'
            },
            {
                OPTN: 'YY06',
                OGRP: 'Y',
                TX15: 'White',
                TX30: 'White'
            }

        ];
        const answer: IMIResponse = {
            hasError: null,
            metadata: null,
            program: 'PDS050MI',
            transaction: 'List',
            item: items[0],
            items: items.map((item) => item),
        };

        return of(answer).pipe(
            delay(this.getRandomMs()),
            map(() => {
                return answer;
            }),
        );
    }

    getOption(record: IMIRequest): Observable<IMIResponse> {
        const items = [
            {
                OPTN: 'X002',
                OGRP: 'X',
                TX15: '2',
                TX30: 'Size 2'
            },
            {
                OPTN: 'X003',
                OGRP: 'X',
                TX15: '3',
                TX30: 'Size 3'
            },
            {
                OPTN: 'X004',
                OGRP: 'X',
                TX15: '4',
                TX30: 'Size 4'
            },
            {
                OPTN: 'X005',
                OGRP: 'X',
                TX15: '5',
                TX30: 'Size 5'
            },
            {
                OPTN: 'X006',
                OGRP: 'X',
                TX15: '6',
                TX30: 'Size 6'
            },
            {
                OPTN: 'X007',
                OGRP: 'X',
                TX15: '7',
                TX30: 'Size 7'
            },
            {
                OPTN: 'X008',
                OGRP: 'X',
                TX15: '8',
                TX30: 'Size 8'
            },
            {
                OPTN: 'YY01',
                OGRP: 'Y',
                TX15: 'red',
                TX30: 'Red'
            },
            {
                OPTN: 'YY02',
                OGRP: 'Y',
                TX15: 'green',
                TX30: 'Green'
            },
            {
                OPTN: 'YY03',
                OGRP: 'Y',
                TX15: 'blue',
                TX30: 'Blue'
            },
            {
                OPTN: 'YY04',
                OGRP: 'Y',
                TX15: 'black',
                TX30: 'Black'
            },
            {
                OPTN: 'YY05',
                OGRP: 'Y',
                TX15: 'Yellow',
                TX30: 'yellow'
            },
            {
                OPTN: 'YY06',
                OGRP: 'Y',
                TX15: 'White',
                TX30: 'White'
            }

        ];

        const item = items.find(f => f.OPTN === record.record.OPTN);

        const answer: IMIResponse = {
            hasError: null,
            metadata: null,
            program: 'PDS050MI',
            transaction: 'Get',
            item: item,
            items: [item]
        };

        if (!item) {
            answer.errorCode = 'WOP0703';
            answer.errorMessage = "Variant doesn't exist PDS050MI";
        }

        return of(answer).pipe(
            delay(this.getRandomMs()),
            map(() => {
                return answer;
            }),
        );
    }

    listStyleItem(record: IMIRequest): Observable<IMIResponse> {
        let items = [
            {
                ITNO: "AMB01-Y02-008",
                STYN: "AMB01",
                ITDS: "AMB01 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB01-Y02-006",
                STYN: "AMB01",
                ITDS: "AMB01 ITDS",
                OPTX: "X006",
                TX15: "6",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB01-Y02-004",
                STYN: "AMB01",
                ITDS: "AMB01 ITDS",
                OPTX: "X004",
                TX15: "4",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB01-Y01-008",
                STYN: "AMB01",
                ITDS: "AMB01 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY01",
                TY15: "Red",
            },
            {
                ITNO: "AMB01-Y03-008",
                STYN: "AMB01",
                ITDS: "AMB01 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY03",
                TY15: "Blue",
            },
            {
                ITNO: "AMB02-Y02-008",
                STYN: "AMB02",
                ITDS: "AMB02 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB02-Y01-005",
                STYN: "AMB02",
                ITDS: "AMB02 ITDS",
                OPTX: "X005",
                TX15: "5",
                OPTY: "YY01",
                TY15: "Red",
            },
            {
                ITNO: "AMB03-Y02-008",
                STYN: "AMB03",
                ITDS: "AMB03 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB02-Y05-006",
                STYN: "AMB02",
                ITDS: "AMB02 ITDS",
                OPTX: "X006",
                TX15: "6",
                OPTY: "YY05",
                TY15: "Yellow",
            },
            {
                ITNO: "AMB03-Y01-008",
                STYN: "AMB03",
                ITDS: "AMB03 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY01",
                TY15: "Red",
            },
            {
                ITNO: "AMB04-Y02-008",
                STYN: "AMB04",
                ITDS: "AMB04 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB05-Y02-008",
                STYN: "AMB05",
                ITDS: "AMB05 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY02",
                TY15: "Green",
            },
            {
                ITNO: "AMB05-Y04-003",
                STYN: "AMB05",
                ITDS: "AMB05 ITDS",
                OPTX: "X003",
                TX15: "3",
                OPTY: "YY04",
                TY15: "Black",
            },
            {
                ITNO: "AMB02-Y03-008",
                STYN: "AMB02",
                ITDS: "AMB01 ITDS",
                OPTX: "X008",
                TX15: "8",
                OPTY: "YY03",
                TY15: "Blue",
            },
            {
                ITNO: "AMB02-Y03-004",
                STYN: "AMB02",
                ITDS: "AMB02 ITDS",
                OPTX: "X004",
                TX15: "4",
                OPTY: "YY03",
                TY15: "Blue",
            },
        ];

        const input = record.record;
        items = items.filter(f => f.STYN === input.STYN && f.OPTY === input.OPTY && f.OPTX === input.OPTX);
        const answer: IMIResponse = {
            hasError: null,
            metadata: null,
            program: 'MMS162MI',
            transaction: 'LstStyleItem',
            item: items[0],
            items: items.map((item) => item),
        };

        return of(answer).pipe(
            delay(this.getRandomMs()),
            map(() => {
                return answer;
            }),
        );
    }

    listUser(record: IMIRequest): Observable<IMIResponse> {
        const items = [
            {
                USID: 'JCHAUT',
                TX40: 'Jérémy Chaut',
            }, {
                USID: 'CDASILVA',
                TX40: 'Charles Da Silva Costa',
            },
            {
                USID: 'WKUAKUVI',
                TX40: 'Wesley Kuakuvi',
            }
        ];
        const answer: IMIResponse = {
            hasError: null,
            metadata: null,
            program: 'MNS150MI',
            transaction: 'LstUserData',
            item: items[0],
            items: items.map((item) => item),
        };

        return of(answer).pipe(
            delay(this.getRandomMs()),
            map(() => {
                return answer;
            }),
        );
    }

    private getRandomMs(): number {
        const top = 1000;
        const bottom = 100;
        return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
        // return 0;
    }

}
