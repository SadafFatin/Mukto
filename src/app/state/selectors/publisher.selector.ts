import { createFeatureSelector } from '@ngrx/store';
import { AppState } from '../app.state';


// Use createFeatureSelector to retrieve only the books part of our application state

export const retrievePnriLeadingColSelector = createFeatureSelector<AppState>('pnricol');
export const retrieveDliLeadingColSelector = createFeatureSelector<AppState>('dlicol');
