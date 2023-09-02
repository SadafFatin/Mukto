import { LineChartModel } from '../utils/utility';
import { KeyValueObject, Legend } from './../utils/models';
/* eslint-disable @typescript-eslint/naming-convention */
export interface PnriData {
  division_scorecards: {
    scorecards: Scorecard[];
    divisionRankingGraphPnriColumn: Legend[];
    divisionStatusPieCartColumn: Legend;
  };
  district_scorecards: {
    scorecards: Scorecard[];
  };
  upazila_scorecards: {
    scorecards: Scorecard[];
  };
  reginalPerformanceBasedOnCIColumn: Legend[];
  reginalPerformanceBasedOnCIStandards: PnriCIMeasureStandards[];
}

export interface Scorecard {
  national: string;
  complete_nutrition_indicator: number;
  iycf_counseling_caregivers: number;
  pregWomWeighed: number;
  rank?: number;
  sam_children_screened: number;
  composite_index: number;
  sam_child_screened_num: number;
  sam_child_identified_num: number;
  sam_child_admitted_num: number;
  plw_receive_ifa_num: number;
  caregiver_receive_counsel_num: number;
  sam_screening_status: number;
  admission_rate: number;
  division_id: number;
  district_id?: number;
  division: string;
  district?: string;
  division_name: string;
  division_geo_code: string;
  district_name?: string;
  district_geo_code?: string;
  upazila_id?: number;
  upazila?: string;
  upazila_name?: string;
  upazila_geo_code?: null | string;
  // id: number;
  // year: number;
  // month: number;
  period: string;
  // created_at: Date | string;
  // updated_at: Date | string;
  // poor?: number;
  // avg?: number;
  // good?: number;
  // over?: number;
}

export interface NationalPnriData {
  national_scorecards: Scorecard[];
  pnriServiceLineCharts: LineChartModel[];
  nationalPerformanceBasedOnCIStandards: PnriCIMeasureStandards[];
  nationalPerformanceBasedOnCIColumn: Legend[];

}


export interface PnriCIMeasureStandards extends KeyValueObject {
  lowerLimit: number;
  upperLimit: number;
};
