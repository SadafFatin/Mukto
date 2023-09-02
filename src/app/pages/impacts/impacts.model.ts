export interface Impacts {
  impacts: Impact[];
}

export interface Impact {
  goalProgress: GoalProgress;
  prevalenceGraph: PrevalenceGraph;
  reference: Reference;
}

export interface GoalProgress {
  title: string;
  description?: string;
  icon?: string;
  year?: string;
  goal?: number;
  achieved: number;
  targetDesc?: string;
}

export interface InputData {
  title: string;
  inputs: Input[];
}

export interface Input {
  stat: string;
  description: string;
}




export interface PrevalenceGraph {
  title: string;
  period: string;
  graphValue: GraphValue[];
}

export interface GraphValue {
  year: string;
  value: number;
}

export interface Reference {
  referenceTitle: string;
  reports: Report[];
}

export interface Report {
  title: string;
  link: string;
  period: string;
}
