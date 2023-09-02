import { createAction, props } from '@ngrx/store';

export const getPnriLeadingCol = createAction(
    '[PnriLeadingColumn Retrieve]',
    props<{ pnricol: PnriLeadingColumn }>()
);

export const setPnriLeadingCol = createAction(
    '[PnriLeadingColumn Set]',
    props<{ pnricol: PnriLeadingColumn }>()
);

export const getDliLeadingCol = createAction(
    '[DLILeadingColumn Retrieve]',
    props<{ dlicol: PnriLeadingColumn }>()
);

export const setDliLeadingCol = createAction(
    '[DLILeadingColumn  Set]',
    props<{ dlicol: PnriLeadingColumn }>()
);





export interface PnriLeadingColumn {
    name: string;
    label: string;
};



export const getScorecardColConfig = createAction(
    '[ScorecardColConfig Retrieve]',
    props<{ scorecardColConfig: ScorecardColConfig }>()
);

export const setScorecardColConfig = createAction(
    '[ScorecardColConfig Set]',
    props<{ scorecardColConfig: ScorecardColConfig }>()
);




export interface ScorecardColConfig {
    pnriIdentifierName: string;
    pnriIdentifierLabel: string;
    dliIdentifierName: string;
    dliIdentifierLabel: string;
};
