/* eslint-disable @typescript-eslint/naming-convention */
export interface SamDataApiResp {
   success: boolean;
   data: SamData;
   message: string;
}

export interface SamData {
   distinct_years: string[];
   sam_values: { [key: string]: SamValue };
   sam_cum_admitted: SamCum[];
   sam_cum_screened: SamCum[];
}

export interface SamCum {
   key?: number;
   month: string;
}

export interface SamSubGroup {
   key: string;
   value: SamCum[];
}

export interface SamValue {
   values: Value[];
}

export interface Value {
   month: string;
   time: number;
   year: number;
   total_child_admitted: string;
   total_child_screened: string;
}
