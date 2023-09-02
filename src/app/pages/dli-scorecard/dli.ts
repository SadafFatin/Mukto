/* eslint-disable @typescript-eslint/naming-convention */



export interface DliScorecardApiResponse {
   data: DliScorecardData;
   success: boolean;
   message: string;

}


export interface DliScorecardData {
   national_scorecards: DliScorecard[];
   division_scorecards: DliScorecard[];
   district_scorecards: DliScorecard[];
   upazila_scorecards: DliScorecard[];
}


export interface DliScorecard {
   period: string;
   year: number;
   month: number;
   perRegPlw: string;
   perInfChld: string;
   composite_index: number;
   noPrgEnr: string;
   noAncWghtMsr: string;
   noNtrCoun: string;
   rank?: number;
   noAncIfaDis: string;
   NoIfaWghtCoun: string;
   chldUndr2yrs: string;
   chld0_6mns: string;
   chld0_23mns: string;
   counAbtBrstFeedng: string;
   counOnCompFeedng: string;
   u2SpcCoun: string;


   division_id: number;
   district_id?: number;
   division: string;
   district?: string;
   division_name: string;
   district_name?: string;
   upazila_id?: number;
   upazila?: string;
   upazila_name?: string;
}




