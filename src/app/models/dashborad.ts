import { GoalProgress } from 'src/app/pages/impacts/impacts.model';
export interface DashboardApiData {
   facilityReportingRates: GoalProgress[];
   impacts: GoalProgress[];
   inputs: DashboardInput[];
   childNutrition: Nutrition[];
   maternalNutrition: Nutrition[];
}

export interface Nutrition {
   key: string;
   value: number;
}


export interface DashboardInput {
   title: string;
   inputs: InputInput[];
}

export interface InputInput {
   stat: string;
   description: string;
}
