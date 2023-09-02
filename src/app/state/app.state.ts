import { PnriLeadingColumn, ScorecardColConfig } from './actions/pnri-col.action';

export interface AppState {
    pnricol: Readonly<PnriLeadingColumn>;
    dlicol: Readonly<PnriLeadingColumn>;
    scorecardColConfig: Readonly<ScorecardColConfig>;

};
