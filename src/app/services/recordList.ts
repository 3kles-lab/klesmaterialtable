import { IMIRequest } from '@infor-up/m3-odin';

export const AUTCHKMI_ChkAuthority: IMIRequest = {
    program: 'AUTCHKMI',
    transaction: 'ChkAuthority',
    maxReturnedRecords: 1
};
export const AUTCHKMI_ChkAutTblRcd: IMIRequest = {
    program: 'AUTCHKMI',
    transaction: 'ChkAutTblRcd',
    maxReturnedRecords: 1
};

export const MMS005MI_LstWarehouses: IMIRequest = {
    program: 'MMS005MI',
    transaction: 'LstWarehouses',
    maxReturnedRecords: 0
}

export const MMS200MI_GetItmBasic: IMIRequest = {
    program: 'MMS200MI',
    transaction: 'GetItmBasic',
    maxReturnedRecords: 1
};

export const MMS019MI_Get: IMIRequest = {
    program: 'MMS019MI',
    transaction: 'Get',
    maxReturnedRecords: 1
};

export const PMS120MI_LstOrderType: IMIRequest = {
    program: 'PMS120MI',
    transaction: 'LstOrderType',
    maxReturnedRecords: 0
};

export const CRS912MI_LstSeason: IMIRequest = {
    program: 'CRS912MI',
    transaction: 'LstSeason',
    maxReturnedRecords: 0
};

export const MMS016MI_List: IMIRequest = {
    program: 'MMS016MI',
    transaction: 'List',
    maxReturnedRecords: 0
};

export const MMS016MI_Get: IMIRequest = {
    program: 'MMS016MI',
    transaction: 'Get',
    maxReturnedRecords: 1
};

export const PDS050MI_List: IMIRequest = {
    program: 'PDS050MI',
    transaction: 'List',
    maxReturnedRecords: 0
};

export const PDS050MI_Get: IMIRequest = {
    program: 'PDS050MI',
    transaction: 'Get',
    maxReturnedRecords: 0
};

export const MMS162MI_LstStyleItem: IMIRequest = {
    program: 'MMS162MI',
    transaction: 'LstStyleItem',
    maxReturnedRecords: 1
};

export const MNS150MI_LstUserData: IMIRequest = {
    program: 'MNS150MI',
    transaction: 'LstUserData',
    maxReturnedRecords: 0
};