import { Scorecard } from 'src/app/models/pnri_model';
/* eslint-disable @typescript-eslint/naming-convention */
export type Legend = KeyValueObject;
export interface DataSources {
  data: DataSourcesDatum[];
  footNote: string;
  email: string;
}
export interface DataSourcesDatum {
  src: string;
  link: string;
}

export interface KeyValueObject {
  key: string;
  value: any;

};
export interface FeatureCollection {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
  id: number;
}

export interface Geometry {
  type: string;
  coordinates: Array<Array<Coordinate[]>>;
}
export type Coordinate = number[] | number;
export interface Properties {
  Shape_Leng: number;
  Shape_Area: number;
  ADM3_EN?: string;
  ADM3_PCODE?: string;
  ADM3_REF?: null | string;
  ADM3ALT1EN?: null | string;
  ADM3ALT2EN?: null | string;
  ADM2_EN?: string;
  ADM2_PCODE?: string;
  ADM1_EN: string;
  ADM1_PCODE: string;
  ADM0_EN: string;
  ADM0_PCODE: string;
  date: string;
  validOn: string;
  ValidTo?: null | string;
  validTo?: null | string;
  score?: Scorecard;
  ADM1_REF?: null | string;
  ADM1ALT1EN?: null | string;
  ADM1ALT2EN?: null | string;
  ADM2_REF?: string | null | string;
  ADM2ALT1EN?: null | string;
  ADM2ALT2EN?: null | string;
}


