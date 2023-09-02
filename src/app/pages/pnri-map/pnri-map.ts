/* eslint-disable @typescript-eslint/naming-convention */

import { Scorecard } from 'src/app/models/pnri_model';


export interface PnriMapApiResponse {
   data: PnriMapData;
   success: boolean;
   message: string;

}


export interface PnriMapData {

   division_scorecards: Scorecard[];
   district_scorecards: Scorecard[];
   upazila_scorecards: Scorecard[];

}


