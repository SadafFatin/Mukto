/* eslint-disable max-len */
import { getDliLeadingCol, setDliLeadingCol } from './../actions/pnri-col.action';
import { PnriLeadingColumn } from '../actions/pnri-col.action';
import { getPnriLeadingCol, setPnriLeadingCol } from '../actions/pnri-col.action';
/* eslint-disable @typescript-eslint/naming-convention */
import { createReducer, on } from '@ngrx/store';

export const initialPublication: PnriLeadingColumn = {
  name: 'national',
  label: 'National'
};

export const initialDliPublication: PnriLeadingColumn = {
  name: 'national',
  label: 'National'
};


export const pnriLeadingColReducer = createReducer(
  initialPublication,
  on(getPnriLeadingCol, (state, { pnricol: pnricol }) =>
    pnricol),
  on(setPnriLeadingCol, (state, { pnricol }) =>
    pnricol),
);

export const dliLeadingColReducer = createReducer(
  initialDliPublication,
  on(getDliLeadingCol, (state, { dlicol: pnricol }) =>
    pnricol),
  on(setDliLeadingCol, (state, { dlicol }) =>
    dlicol),
);


