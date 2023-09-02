import { LineChartModel } from 'src/app/utils/utility';
import { Legend } from './../../utils/models';
/* eslint-disable @typescript-eslint/naming-convention */

import { PnriCIMeasureStandards, Scorecard } from 'src/app/models/pnri_model';


export interface ScorecardApiResponse {
   data: ScorecardData;
   success: boolean;
   message: string;

}


export interface ScorecardData {
   national_scorecards: Scorecard[];
   pnriServiceLineCharts: LineChartModel[];
   nationalPerformanceBasedOnCIStandards: PnriCIMeasureStandards[];
   nationalPerformanceBasedOnCIColumn: Legend[];
   division_scorecards: Scorecard[];
   divisionRankingGraphPnriColumn: Legend[];
   divisionStatusPieCartColumn: Legend;
   district_scorecards: Scorecard[];
   upazila_scorecards: Scorecard[];
   reginalPerformanceBasedOnCIColumn: Legend[];
   reginalPerformanceBasedOnCIStandards: PnriCIMeasureStandards[];
}













export interface CommunityClinicData {
   values: CommunityClinicValue[];
   period_name: string;
}

export interface CommunityClinicValue {
   period_name: string;
   cc_name: string;
   excBrFe: number;
   adFoodSup: number;
   lowHaz: number;
   lowWaz: number;
   lowWhz: number;
   ifaDistAnc: number;
   nutCunAnc: number;
   ifaDistPnc: number;
   preWomEnr: PreWomEnrUnion;
   weightMesAnc: PreWomEnrUnion;
}

export type PreWomEnrUnion = PreWomEnrEnum | number;

export enum PreWomEnrEnum {
   Empty = '-',
}
