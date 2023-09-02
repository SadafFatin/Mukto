/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable space-before-function-paren */
/* eslint-disable max-len */
import { DatePipe } from '@angular/common';
import { FeatureCollection, KeyValueObject, Legend } from './models';
import * as d3 from 'd3';
import { divisions, districts, upazilas } from 'src/assets/data/data';
import { PnriCIMeasureStandards } from '../models/pnri_model';
import { ScaleLinear } from 'd3';

//labels
export const orgs = [
  {
    name: 'National Nutrition Services Institute of Public Health',
    icon: '../../../assets/icon/nnsiphn.svg'
  },
  {
    name: 'Bangladesh National Nutrition Council',
    icon: '../../../assets/icon/bnnc.svg'
  }
];

// Dimensions
export const margin = { vertical: 65, top: 35, right: 10, bottom: 30, left: 35, marginHorizontal: 55 };
export const graphHeight = 500;
export const radialHeight = 400;
export const mapHeight = 650;
export const extraMapHeight = 350;
export const legendMarginVertical = 5;
export const legendHGroupMarginTop = 60;
export const extraLegendHeight = 15;
export const strokeWidth = 15;
export const legendCircleRadius = 10;
export const legendTextPadding = 15;
export const legendSquareDimension = 15;
export const legendHeight = 20;

export const spaceForLabel = margin.right + margin.left + 25;
export const spaceForVerticalLevel = 110;
export const graphTextMargin = 15;
export const lineOpacityHover = '1';
export const otherLinesOpacityHover = '0.15';
export const lineOpacity = '0.95';
export const lineStroke = '2.5';
export const lineStrokeHover = '5.5';
export const circleOpacity = '0.85';
export const circleOpacityOnLineHover = '0.01';
export const circleRadius = 5;
export const circleRadiusHover = 10;
export const maxCIIndex = 1.5;
export const maxServiceDataVal = 5000;


export const PI = Math.PI;
export const arcMinRadius = 10;
export const arcPadding = 10;
export const labelPadding = -5;
export const numTicks = 10;

export const radiusBackground = .25;
export const radiusForeground = .25;
export const gap = 28;

// Graph Color Configs
//Colors
export const graphColor = d3.scaleOrdinal(d3.schemeSet3);
export const divisionColor = d3.scaleOrdinal(d3.schemeTableau10);
export const districtColor = d3.scaleOrdinal(d3.schemeTableau10);
export const getColorForPercentage = (pct) => {
  pct = pct / 10;
  const hue = ((1 - pct) * 120).toString(10);
  return ['hsl(', hue, ',100%,60%)'].join('');
};

const ciColorCodes = ['#e15759', '#f28e2c', '#59a14f', '#bc80bd', '#edc949', '#e15759', '#666666'];
const ciLabels = [
  'poor',
  'moderate_poor',
  'good',
  'over_estimate',
  'avg',
  'very_poor',
  'nodata'];

const ciGraphColors = d3.scaleOrdinal().domain(ciLabels).range(ciColorCodes);
export const areaWiseCIColor = (ciValue: number, areaType: string = 'regional') => ciGraphColors(getCILabel(ciValue, 'composite_index'));
export const getColorFromLabel = (label: string): any => ciGraphColors(label) ? ciGraphColors(label) : graphColor(label);
export const getCILabel = (ci: any, columnName?: string, region?: string): string => {
  if (columnName === 'composite_index') {
    ci = ci * 100;
  }
  // if (region === 'national') {
  //   if (ci <= 30) {
  //     return 'very_poor';
  //   }
  //   else if (ci > 30 && ci < 50) {
  //     return 'moderate_poor';
  //   }
  //   else if (ci >= 50 && ci < 75) {
  //     return 'avg';
  //   }
  //   else if (ci >= 75 && ci <= 100) {
  //     return 'good';
  //   }
  //   else if (ci > 100) {
  //     return 'over_estimate';
  //   }
  //   else {
  //     return 'nodata';
  //   }
  // }
  // else {
  //   if (ci < 50) {
  //     return 'poor';
  //   }
  //   else if (ci >= 50 && ci < 75) {
  //     return 'avg';
  //   }
  //   else if (ci >= 75 && ci <= 100) {
  //     return 'good';
  //   }
  //   else if (ci > 100) {
  //     return 'over_estimate';
  //   }
  //   else {
  //     return 'nodata';
  //   }
  // }
  if (region === 'cc') {
    return ci == '-' ? 'poor' : 'regular';
  }
  if (ci < 50) {
    return 'poor';
  }
  else if (ci >= 50 && ci < 75) {
    return 'avg';
  }
  else if (ci >= 75 && ci <= 100) {
    return 'good';
  }
  else if (ci > 100) {
    return 'over_estimate';
  }
  else {
    return 'nodata';
  }
};
//Graph Text Wrap and Graph Configs
export const generateSVGContainer = (elementSelector, height, totalLegendHeight) => {
  let svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;
  svg = d3.select(elementSelector).select('svg');
  if (svg.node()) {
    svg.remove();
  }
  svg = d3.select(elementSelector)
    .append('svg')
    .attr('width', '100%')
    .attr('height', height + legendHGroupMarginTop
      + totalLegendHeight + margin.vertical + strokeWidth)
    .attr('preserveAspectRatio', 'xMinYMin meet');

  return svg;
};
export const getWidth = (ratioLg, ratioMd, platformWidth) => {
  console.log('getting width from platform');
  if (platformWidth >= 990) {
    return (platformWidth * ratioLg / 12) - 18;
  }
  else if (platformWidth < 990 && platformWidth > 768) {
    return (platformWidth * ratioMd / 12) - 16;
  }
  else {
    return platformWidth - 18;
  }

};

//PNRI COnfigs
export const pnriDataColumns: KeyValueObject[] = [
  {
    key: 'period',
    value: 'Reporting Period'
  },
  {
    key: '',
    value: ''
  },
  {
    key: 'complete_nutrition_indicator',
    value: 'Facilities Reporting on Complete Nutrition Indicator'
  },
  {
    key: 'iycf_counseling_caregivers',
    value: 'Facilities Providing IYCF Counselling to Caregivers'
  },
  {
    key: 'pregWomWeighed',
    value: 'Pregnant Women Weighted During Clinic Visit (Cumulative)'
  },
  {
    key: 'sam_children_screened',
    value: 'Children Screened For SAM at Facility'
  },
  {
    key: 'composite_index',
    value: 'Composite Index'
  },
  {
    key: 'rank',
    value: 'Rank'
  },
  {
    key: 'sam_child_screened_num',
    value: 'Children Screened For SAM at Facility'
  },
  {
    key: 'sam_child_identified_num',
    value: 'Children Identified with SAM'
  },
  {
    key: 'sam_child_admitted_num',
    value: 'SAM Children Admitted'
  },
  {
    key: 'plw_receive_ifa_num',
    value: 'PLW receiving IFA'
  },
  {
    key: 'caregiver_receive_counsel_num',
    value: 'Caregiver Receiving Nutrition Counselling'
  },
  {
    key: 'sam_screening_status',
    value: 'SAM Status by Screening'
  },
  {
    key: 'admission_rate',
    value: 'Admission Rate'
  }
];
export const pnriScorecardDataColumns = {

  national: [
    {
      key: 'period',
      value: 'Reporting Period'
    },
    {
      key: 'complete_nutrition_indicator',
      value: 'Facilities Reporting on Complete Nutrition Indicator'
    },
    {
      key: 'iycf_counseling_caregivers',
      value: 'Facilities Providing IYCF Counselling to Caregivers'
    },
    {
      key: 'pregWomWeighed',
      value: 'Pregnant Women Weighted During Clinic Visit (Cumulative)'
    },
    {
      key: 'sam_children_screened',
      value: 'Children Screened For SAM at Facility'
    },
    {
      key: 'composite_index',
      value: 'Composite Index'
    },
    {
      key: 'sam_child_screened_num',
      value: 'Children Screened For SAM at Facility'
    },
    {
      key: 'sam_child_identified_num',
      value: 'Children Identified with SAM'
    },
    {
      key: 'sam_child_admitted_num',
      value: 'SAM Children Admitted'
    },
    {
      key: 'plw_receive_ifa_num',
      value: 'PLW receiving IFA'
    },
    {
      key: 'caregiver_receive_counsel_num',
      value: 'Caregiver Receiving Nutrition Counselling'
    },
    {
      key: 'sam_screening_status',
      value: 'SAM Status by Screening'
    },
    {
      key: 'admission_rate',
      value: 'Admission Rate'
    }
  ],
  division: [
    {
      key: 'period',
      value: 'Reporting Period'
    },
    {
      key: 'division',
      value: 'Division'
    },
    {
      key: 'complete_nutrition_indicator',
      value: 'Facilities Reporting on Complete Nutrition Indicator'
    },
    {
      key: 'iycf_counseling_caregivers',
      value: 'Facilities Providing IYCF Counselling to Caregivers'
    },
    {
      key: 'pregWomWeighed',
      value: 'Pregnant Women Weighted During Clinic Visit (Cumulative)'
    },
    {
      key: 'sam_children_screened',
      value: 'Children Screened For SAM at Facility'
    },
    {
      key: 'composite_index',
      value: 'Composite Index'
    },
    {
      key: 'rank',
      value: 'Rank'
    },
    {
      key: 'sam_child_screened_num',
      value: 'Children Screened For SAM at Facility'
    },
    {
      key: 'sam_child_identified_num',
      value: 'Children Identified with SAM'
    },
    {
      key: 'sam_child_admitted_num',
      value: 'SAM Children Admitted'
    },
    {
      key: 'plw_receive_ifa_num',
      value: 'PLW receiving IFA'
    },
    {
      key: 'caregiver_receive_counsel_num',
      value: 'Caregiver Receiving Nutrition Counselling'
    },
    {
      key: 'sam_screening_status',
      value: 'SAM Status by Screening'
    },
    {
      key: 'admission_rate',
      value: 'Admission Rate'
    }
  ],
  district: [
    {
      key: 'division',
      value: 'Division'
    },
    {
      key: 'district',
      value: 'District'
    },
    {
      key: 'complete_nutrition_indicator',
      value: 'Facilities Reporting on Complete Nutrition Indicator'
    },
    {
      key: 'iycf_counseling_caregivers',
      value: 'Facilities Providing IYCF Counselling to Caregivers'
    },
    {
      key: 'pregWomWeighed',
      value: 'Pregnant Women Weighted During Clinic Visit (Cumulative)'
    },
    {
      key: 'sam_children_screened',
      value: 'Children Screened For SAM at Facility'
    },
    {
      key: 'composite_index',
      value: 'Composite Index'
    },
    {
      key: 'rank',
      value: 'Rank'
    },
    {
      key: 'sam_child_screened_num',
      value: 'Children Screened For SAM at Facility'
    },
    {
      key: 'sam_child_identified_num',
      value: 'Children Identified with SAM'
    },
    {
      key: 'sam_child_admitted_num',
      value: 'SAM Children Admitted'
    },
    {
      key: 'plw_receive_ifa_num',
      value: 'PLW receiving IFA'
    },
    {
      key: 'caregiver_receive_counsel_num',
      value: 'Caregiver Receiving Nutrition Counselling'
    },
    {
      key: 'sam_screening_status',
      value: 'SAM Status by Screening'
    },
    {
      key: 'admission_rate',
      value: 'Admission Rate'
    }
  ],
  upazila: [
    {
      key: 'district',
      value: 'District'
    },
    {
      key: 'upazila',
      value: 'Upazila'
    },
    {
      key: 'complete_nutrition_indicator',
      value: 'Facilities Reporting on Complete Nutrition Indicator'
    },
    {
      key: 'iycf_counseling_caregivers',
      value: 'Facilities Providing IYCF Counselling to Caregivers'
    },
    {
      key: 'pregWomWeighed',
      value: 'Pregnant Women Weighted During Clinic Visit (Cumulative)'
    },
    {
      key: 'sam_children_screened',
      value: 'Children Screened For SAM at Facility'
    },
    {
      key: 'composite_index',
      value: 'Composite Index'
    },
    {
      key: 'rank',
      value: 'Rank'
    },
    {
      key: 'sam_child_screened_num',
      value: 'Children Screened For SAM at Facility'
    },
    {
      key: 'sam_child_identified_num',
      value: 'Children Identified with SAM'
    },
    {
      key: 'sam_child_admitted_num',
      value: 'SAM Children Admitted'
    },
    {
      key: 'plw_receive_ifa_num',
      value: 'PLW receiving IFA'
    },
    {
      key: 'caregiver_receive_counsel_num',
      value: 'Caregiver Receiving Nutrition Counselling'
    },
    {
      key: 'sam_screening_status',
      value: 'SAM Status by Screening'
    },
    {
      key: 'admission_rate',
      value: 'Admission Rate'
    }
  ]
};

//DLI Configs
export const dliDataColumns = {

  national: [
    {
      key: 'period',
      value: 'Reporting Period'
    },
    {
      key: 'perInfChld',
      value: 'Registered infant and children aged U2 years receiving specified nutrition services'
    },
    {
      key: 'perRegPlw',
      value: 'Registered PW receiving specified nutrition services'
    },
    {
      key: 'noPrgEnr',
      value: 'Pregnant women enrolled'
    },
    {
      key: 'noAncWghtMsr',
      value: 'ANC services where weight measured (unique)'
    },
    {
      key: 'noNtrCoun',
      value: 'Nutrition counselling at 1st ANC'
    },

    {
      key: 'noAncIfaDis',
      value: 'ANC services more >=30 IFA distribute'
    },
    {
      key: 'NoIfaWghtCoun',
      value: 'ANC where >=30IFA, weight, counselling test'
    },
    {
      key: 'composite_index',
      value: 'Composite Index'
    },
    {
      key: 'chldUndr2yrs',
      value: 'Children enrolled under 2 years of age'
    },
    {
      key: 'chld0_6mns',
      value: 'Children enrolled (0 - < 6 months)'
    },
    {
      key: 'chld0_23mns',
      value: 'Children enrolled (6 - 23 months)'
    },
    {
      key: 'counAbtBrstFeedng',
      value: 'Child counselled about breast feeding'
    },
    {
      key: 'counOnCompFeedng',
      value: 'Child counselled on complementary feeding'
    },
    {
      key: 'u2SpcCoun',
      value: 'children aged U2 years receiving specified counseling'
    }
  ],
  division: [
    {
      key: 'period',
      value: 'Reporting Period'
    },
    {
      key: 'division',
      value: 'Division'
    },
    {
      key: 'perInfChld',
      value: 'Registered infant and children aged U2 years receiving specified nutrition services'
    },
    {
      key: 'perRegPlw',
      value: 'Registered PW receiving specified nutrition services'
    },
    {
      key: 'noPrgEnr',
      value: 'Pregnant women enrolled'
    },
    {
      key: 'noAncWghtMsr',
      value: 'ANC services where weight measured (unique)'
    },
    {
      key: 'noNtrCoun',
      value: 'Nutrition counselling at 1st ANC'
    },

    {
      key: 'noAncIfaDis',
      value: 'ANC services more >=30 IFA distribute'
    },
    {
      key: 'NoIfaWghtCoun',
      value: 'ANC where >=30IFA, weight, counselling test'
    },
    {
      key: 'composite_index',
      value: 'Composite Index'
    },
    {
      key: 'rank',
      value: 'Rank'
    },
    {
      key: 'chldUndr2yrs',
      value: 'Children enrolled under 2 years of age'
    },
    {
      key: 'chld0_6mns',
      value: 'Children enrolled (0 - < 6 months)'
    },
    {
      key: 'chld0_23mns',
      value: 'Children enrolled (6 - 23 months)'
    },
    {
      key: 'counAbtBrstFeedng',
      value: 'Child counselled about breast feeding'
    },
    {
      key: 'counOnCompFeedng',
      value: 'Child counselled on complementary feeding'
    },
    {
      key: 'u2SpcCoun',
      value: 'children aged U2 years receiving specified counseling'
    }
  ],
  district: [
    {
      key: 'period',
      value: 'Reporting Period'
    },
    {
      key: 'division',
      value: 'Division'
    },
    {
      key: 'district',
      value: 'District'
    },
    {
      key: 'perInfChld',
      value: 'Registered infant and children aged U2 years receiving specified nutrition services'
    },
    {
      key: 'perRegPlw',
      value: 'Registered PW receiving specified nutrition services'
    },
    {
      key: 'noPrgEnr',
      value: 'Pregnant women enrolled'
    },
    {
      key: 'noAncWghtMsr',
      value: 'ANC services where weight measured (unique)'
    },
    {
      key: 'noNtrCoun',
      value: 'Nutrition counselling at 1st ANC'
    },

    {
      key: 'noAncIfaDis',
      value: 'ANC services more >=30 IFA distribute'
    },
    {
      key: 'NoIfaWghtCoun',
      value: 'ANC where >=30IFA, weight, counselling test'
    },
    {
      key: 'composite_index',
      value: 'Composite Index'
    },
    {
      key: 'rank',
      value: 'Rank'
    },
    {
      key: 'chldUndr2yrs',
      value: 'Children enrolled under 2 years of age'
    },
    {
      key: 'chld0_6mns',
      value: 'Children enrolled (0 - < 6 months)'
    },
    {
      key: 'chld0_23mns',
      value: 'Children enrolled (6 - 23 months)'
    },
    {
      key: 'counAbtBrstFeedng',
      value: 'Child counselled about breast feeding'
    },
    {
      key: 'counOnCompFeedng',
      value: 'Child counselled on complementary feeding'
    },
    {
      key: 'u2SpcCoun',
      value: 'children aged U2 years receiving specified counseling'
    }
  ],
  upazila: [
    {
      key: 'period',
      value: 'Reporting Period'
    },
    {
      key: 'district',
      value: 'District'
    },
    {
      key: 'upazila',
      value: 'Upazila'
    },
    {
      key: 'perInfChld',
      value: 'Registered infant and children aged U2 years receiving specified nutrition services'
    },
    {
      key: 'perRegPlw',
      value: 'Registered PW receiving specified nutrition services'
    },
    {
      key: 'noPrgEnr',
      value: 'Pregnant women enrolled'
    },
    {
      key: 'noAncWghtMsr',
      value: 'ANC services where weight measured (unique)'
    },
    {
      key: 'noNtrCoun',
      value: 'Nutrition counselling at 1st ANC'
    },
    {
      key: 'noAncIfaDis',
      value: 'ANC services more >=30 IFA distribute'
    },
    {
      key: 'NoIfaWghtCoun',
      value: 'ANC where >=30IFA, weight, counselling test'
    },
    {
      key: 'composite_index',
      value: 'Composite Index'
    },
    {
      key: 'rank',
      value: 'Rank'
    },
    {
      key: 'chldUndr2yrs',
      value: 'Children enrolled under 2 years of age'
    },
    {
      key: 'chld0_6mns',
      value: 'Children enrolled (0 - < 6 months)'
    },
    {
      key: 'chld0_23mns',
      value: 'Children enrolled (6 - 23 months)'
    },
    {
      key: 'counAbtBrstFeedng',
      value: 'Child counselled about breast feeding'
    },
    {
      key: 'counOnCompFeedng',
      value: 'Child counselled on complementary feeding'
    },
    {
      key: 'u2SpcCoun',
      value: 'children aged U2 years receiving specified counseling'
    }
  ]





};


//Community clinic Configs
export const communityClinicDataColumns: KeyValueObject[] = [
  {
    key: 'period',
    value: 'Reporting Period'
  },
  {
    key: 'cc_name',
    value: 'Clinic'
  },
  {
    key: 'excBrFe',
    value: 'Exclusive Breast Feeding'
  },
  {
    key: 'adFoodSup',
    value: 'Additional Food Supplement'
  },
  {
    key: 'lowHaz',
    value: 'Low HAZ	'
  },
  {
    key: 'lowWaz',
    value: 'Low WAZ	'
  },
  {
    key: 'lowWhz',
    value: 'Low WHZ'
  },

  {
    key: 'ifaDistAnc',
    value: 'ANC IFA Distribution'
  },
  {
    key: 'nutCunAnc',
    value: 'ANC Nutrition Counselling'
  },
  {
    key: 'ifaDistPnc',
    value: 'PNC IFA Distribution'
  },
  {
    key: 'preWomEnr',
    value: 'Pregnant Women Enrolled'
  },
  {
    key: 'weightMesAnc',
    value: 'ANC Servies Weight Measured'
  }
];





//Data
export const nationalPerformanceBasedOnCIColumn: PnriCIMeasureStandards[] = [
  {
    key: 'very_poor',
    value: 'Very Poor',
    lowerLimit: 0,
    upperLimit: 30
  },
  {
    key: 'poor',
    value: 'Poor',
    lowerLimit: 30,
    upperLimit: 50
  },
  {
    key: 'avg',
    value: 'Average',
    lowerLimit: 50,
    upperLimit: 75
  },
  {
    key: 'good',
    value: 'Good',
    lowerLimit: 75,
    upperLimit: 100
  }, {
    key: 'over_estimate',
    value: 'Over Estimate',
    lowerLimit: 100,
    upperLimit: 10000000000
  }
];
export const reginalPerformanceBasedOnCIColumn: PnriCIMeasureStandards[] = [
  {
    key: 'poor',
    value: 'Poor',
    lowerLimit: 0,
    upperLimit: 50
  },
  {
    key: 'avg',
    value: 'Average',
    lowerLimit: 50,
    upperLimit: 75
  },
  {
    key: 'good',
    value: 'Good',
    lowerLimit: 75,
    upperLimit: 100
  }, {
    key: 'over_estimate',
    value: 'Over Estimate',
    lowerLimit: 100,
    upperLimit: 10000000000
  }
];
export const standardPerformanceBasedOnCIColumn: PnriCIMeasureStandards[] = [
  {
    key: 'poor',
    value: 'Poor <50%',
    lowerLimit: 0,
    upperLimit: 50
  },
  {
    key: 'avg',
    value: 'Average 50-74%',
    lowerLimit: 50,
    upperLimit: 75
  },
  {
    key: 'good',
    value: 'Good >75%',
    lowerLimit: 75,
    upperLimit: 100
  }, {
    key: 'over_estimate',
    value: 'Over Estimate >100%',
    lowerLimit: 100,
    upperLimit: 10000000000
  }
];
export const geoCodeAdminCodeKeyMap: GeoCodeAdminCodeMap = {
  national: {
    geoCodeKey: 'division_geo_code',
    adminCodeKey: 'ADM1_PCODE',
    adminName: 'ADM1_EN',
    areas: divisions,
    subGeoCodeKey: 'division_geo_code',
    subAdminCodeKey: 'ADM1_PCODE'
  },
  division: {
    geoCodeKey: 'division_geo_code',
    adminCodeKey: 'ADM1_PCODE',
    adminName: 'ADM1_EN',
    areas: divisions,
    subGeoCodeKey: 'division_geo_code',
    subAdminCodeKey: 'ADM1_PCODE'
  },
  district: {
    geoCodeKey: 'division_geo_code',
    adminCodeKey: 'ADM1_PCODE',
    adminName: 'ADM2_EN',
    areas: districts,
    subGeoCodeKey: 'district_geo_code',
    subAdminCodeKey: 'ADM2_PCODE'
  },
  upazila: {
    geoCodeKey: 'district_geo_code',
    adminCodeKey: 'ADM2_PCODE',
    adminName: 'ADM3_EN',
    areas: upazilas,
    subGeoCodeKey: 'upazila_geo_code',
    subAdminCodeKey: 'ADM3_PCODE',
  },

};
export interface GeoCodeAdminCode {
  geoCodeKey: string;
  adminCodeKey: string;
  adminName: string;
  areas: FeatureCollection;
  subGeoCodeKey: string;
  subAdminCodeKey: string;
};
export interface GeoCodeAdminCodeMap {
  national: GeoCodeAdminCode;
  division: GeoCodeAdminCode;
  district: GeoCodeAdminCode;
  upazila: GeoCodeAdminCode;
};

//Date Transforms
export const getDateFromPeriod = (period: string): any => {
  if (period.indexOf('_') > 0) {
    const parts = period.split('_');
    return new Date(Number(parts[0]), Number(parts[1]));
  }
  return new Date();
};
export const parseTime = d3.timeParse('%Y_%m');
export const getShortPeriod = (date: Date, pipe: DatePipe): any => pipe.transform(date, 'MMM-YY');

//Line Charts

export interface LineChartModel extends KeyValueObject {
  path: SVGPathElement;
}

//Animations
export const pathAnimation = (path) => {
  const totalLength = path.node().getTotalLength() + 2000;
  path
    .attr('stroke-dasharray', totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(3000)
    .attr('stroke-dashoffset', 0);
};
export const barAnimation = (bars) => {
  console.log(bars);
  bars
    .transition()
    .ease(d3.easeBounce) // or any other ease function (optional)
    .duration(5000);
};
export const lineCircleTransition = 500;
export const rectTransition = 3000;
export const inputDebounceTime = 325;
export const barTransitionTime = 1800;
export const initTimeOut = 1500;

//Menus
export const menuGuideline = 'guideline';
export const menuReference = 'reference';
export const menuIndicator = 'indicator';
export const menuContributors = 'contributors';
export interface MenuItem {
  title: string;
  icon: string;
  url: string;
};
//Graph Text Wrap and Graph Configs
export const wrap = (ticktext, width, y, type) => {
  let x = 0;
  if (type === 'vertical') {
    x = -(margin.left + 12);
  }
  ticktext.each(function () {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();
    let word;
    let line = [];
    const lineNumber = 1;
    const lineHeight = .9; // ems
    const yPos = y;
    const dy = parseFloat(text.attr('dy'));
    let tspan = text.text(null).append('tspan').attr('x', x).attr('dy', dy + 'em').attr('y', yPos);
    word = words.pop();
    while (word) {
      line.push(word);
      tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(' '));
        line = [word];
        tspan = text.append('tspan').attr('x', x).attr('dy', lineNumber * lineHeight + dy + 'em').text(word);
      }
      word = words.pop();
    }

  });
};
export const makeXGridLines = (x) => d3.axisBottom(x)
  .ticks(20);
export const makeYGridLines = (y) => d3.axisBottom(y)
  .ticks(20);
export const getFocusArea = (chart) => chart.append('g').append('circle')
  .attr('width', 30)
  .attr('height', 30)
  .style('fill', 'none')
  .attr('stroke', 'grey')
  .style('cursor', 'pointer')
  .attr('r', circleRadiusHover)
  .style('opacity', 0);
export const getFocusText = (chart) => chart.append('g')
  .append('text')
  .style('opacity', 0)
  .attr('text-anchor', 'left')
  .attr('alignment-baseline', 'middle');
export const getTooltip = (id) => d3.select(id)
  .append('div')
  .style('visibility', 'hidden')
  .attr('class', 'tooltip');
export const addGraphNameLeftAxis = (chart, text) => {
  chart.append('g')
    .attr('class', 'text')
    .attr('transform', `translate(${margin.left},20)`) //use variable in translate
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', '0')
    .attr('y', '0')
    .attr('text-anchor', 'end')
    .text(text);

};
export const graphTextCoordinate = (value: any, scale: ScaleLinear<any, any, any>) => {
  if (value > 100) {
    return scale(90);
  }
  else if (value - 10 < 1) {
    return scale(1);
  }
  return scale(value - 10);
};

export const subGroupKey = 'keys';
export const subGroupLabel = 'label';
export const subGroupValue = 'value';

export const drawLegendBelowGraph = (legendGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>, type: string, width: number, height: number, legends: Legend[], key = 'value', starting = 1) => {

  let startingHeight = height + legendHGroupMarginTop + margin.top;
  const x = starting * (width / 2) - starting * margin.left;

  for (const legend of legends) {

    legendGroup.append(type)
      .attr('cx', x)
      .attr('cy', startingHeight)
      .attr('r', legendCircleRadius)
      .attr('x', x)
      .attr('y', startingHeight)
      .attr('width', 20)
      .attr('height', 20)
      .style('fill', getColorFromLabel(legend.key));

    const dy = type === 'rect' ? legendSquareDimension : 5;
    const dx = 25;

    const legendText = legendGroup.append('text')
      .attr('x', x)
      .attr('y', startingHeight);

    legendText.text(legend[key])
      .attr('dx', dx)
      .attr('dy', dy);
    startingHeight += legendHeight + legendMarginVertical;

    // const size = getTextSize(legend[key], legendGroup);
    // if (size.width >= width - 10) {

    //   const text = legend[key];
    //   // const partOne = text.slice(0, text.length / 2);
    //   // const partTwo = text.slice(text.length / 2, text.length);
    //   // // // Add a <tspan class="title"> for every data element.
    //   // legendText.append('tspan')
    //   //   .text(d => partOne)
    //   //   .attr('x', 0)
    //   //   .attr('dx', dx)
    //   //   .attr('dy', dy);

    //   // // // Add a <tspan class="author"> for every data element.
    //   // legendText.append('tspan')
    //   //   .text(partTwo)
    //   //   .attr('x', 0)
    //   //   .attr('dx', dx)
    //   //   .attr('dy', dy);

    //   const words = text.split(/\s+/).reverse();
    //   let word;
    //   let line = [];
    //   const lineNumber = 1;
    //   const lineHeight = 1; // ems
    //   let tspan = legendText.text(null).append('tspan').attr('x', x)
    //     .attr('dy', dy)
    //     .attr('dx', dx);
    //   word = words.pop();
    //   while (word) {
    //     line.push(word);
    //     tspan.text(line.join(' '));
    //     if (tspan.node().getComputedTextLength() > width) {
    //       line.pop();
    //       tspan.text(line.join(' '));
    //       line = [word];
    //       tspan = legendText.append('tspan').attr('x', x).attr('dx', dx)
    //         .attr('dy', lineNumber * lineHeight + dy).text(word);
    //       startingHeight += legendHeight + legendMarginVertical + lineNumber * lineHeight + dy;

    //     }
    //     word = words.pop();
    //   }

    // }
    // else {
    //   legendText.text(legend[key])
    //     .attr('dx', dx)
    //     .attr('dy', dy);
    //   startingHeight += legendHeight + legendMarginVertical;
    // }


  }
  legendGroup.selectAll('text').attr('class', 'legend').attr('alignment-baseline', 'center');

};

const getTextSize = (text, legendGroup) => {
  const container = legendGroup.append('g');
  container.append('text').text(text).style('font-size', 12).style('font-family', 'Arial');
  const size = container.node().getBBox();
  container.remove();
  return size;
};


export type AreaDropDown = {
  district_id?: number | string;
  district_geo_code?: string;
  district_name?: string;
  division_geo_code: string;
  division_id: number | string;
  division_name: string;
  upazila_id?: number | string;
  upazila_geo_code?: string;
  upazila_name?: string;
};


export const divisionDropDown: Array<AreaDropDown> = [
  {
    division_id: '4',
    division_geo_code: 'BD10',
    division_name: 'Barisal'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka'
  },
  {
    division_id: 3,
    division_geo_code: 'BD40',
    division_name: 'Khulna'
  },
  {
    division_id: 8,
    division_geo_code: 'BD45',
    division_name: 'Mymensingh'
  },
  {
    division_id: 2,
    division_geo_code: 'BD50',
    division_name: 'Rajshahi'
  },
  {
    division_id: 7,
    division_geo_code: 'BD55',
    division_name: 'Rangpur'
  },
  {
    division_id: 5,
    division_geo_code: 'BD60',
    division_name: 'Sylhet'
  }
];

export const districtDropDown: Array<AreaDropDown> = [
  {
    division_id: 3,
    division_geo_code: 'BD40',
    division_name: 'Khulna',
    district_id: 28,
    district_geo_code: 'BD4001',
    district_name: 'Bagerhat'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram',
    district_id: 11,
    district_geo_code: 'BD2003',
    district_name: 'Bandarban'
  },
  {
    division_id: 4,
    division_geo_code: 'BD10',
    division_name: 'Barisal',
    district_id: 35,
    district_geo_code: 'BD1004',
    district_name: 'Barguna'
  },
  {
    division_id: 4,
    division_geo_code: 'BD10',
    division_name: 'Barisal',
    district_id: 33,
    district_geo_code: 'BD1006',
    district_name: 'Barisal'
  },
  {
    division_id: 4,
    division_geo_code: 'BD10',
    division_name: 'Barisal',
    district_id: 34,
    district_geo_code: 'BD1009',
    district_name: 'Bhola'
  },
  {
    division_id: 2,
    division_geo_code: 'BD50',
    division_name: 'Rajshahi',
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram',
    district_id: 3,
    district_geo_code: 'BD2012',
    district_name: 'Brahmanbaria'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram',
    district_id: 6,
    district_geo_code: 'BD2013',
    district_name: 'Chandpur'
  },
  {
    division_id: 2,
    division_geo_code: 'BD50',
    division_name: 'Rajshahi',
    district_id: 18,
    district_geo_code: 'BD5070',
    district_name: 'Chapainawabganj'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram',
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram'
  },
  {
    division_id: 3,
    division_geo_code: 'BD40',
    division_name: 'Khulna',
    district_id: 24,
    district_geo_code: 'BD4018',
    district_name: 'Chuadanga'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram',
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram',
    district_id: 9,
    district_geo_code: 'BD2022',
    district_name: 'Coxsbazar'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 47,
    district_geo_code: 'BD3026',
    district_name: 'Dhaka'
  },
  {
    division_id: 7,
    division_geo_code: 'BD55',
    division_name: 'Rangpur',
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 52,
    district_geo_code: 'BD3029',
    district_name: 'Faridpur'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram',
    district_id: 2,
    district_geo_code: 'BD2030',
    district_name: 'Feni'
  },
  {
    division_id: 7,
    division_geo_code: 'BD55',
    division_name: 'Rangpur',
    district_id: 57,
    district_geo_code: 'BD5532',
    district_name: 'Gaibandha'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 41,
    district_geo_code: 'BD3033',
    district_name: 'Gazipur'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 51,
    district_geo_code: 'BD3035',
    district_name: 'Gopalganj'
  },
  {
    division_id: 5,
    division_geo_code: 'BD60',
    division_name: 'Sylhet',
    district_id: 38,
    district_geo_code: 'BD6036',
    district_name: 'Habiganj'
  },
  {
    division_id: 8,
    division_geo_code: 'BD45',
    division_name: 'Mymensingh',
    district_id: 63,
    district_geo_code: 'BD4539',
    district_name: 'Jamalpur'
  },
  {
    division_id: 3,
    division_geo_code: 'BD40',
    division_name: 'Khulna',
    district_id: 20,
    district_geo_code: 'BD4041',
    district_name: 'Jashore'
  },
  {
    division_id: 4,
    division_geo_code: 'BD10',
    division_name: 'Barisal',
    district_id: 30,
    district_geo_code: 'BD1042',
    district_name: 'Jhalakathi'
  },
  {
    division_id: 3,
    division_geo_code: 'BD40',
    division_name: 'Khulna',
    district_id: 29,
    district_geo_code: 'BD4044',
    district_name: 'Jhenaidah'
  },
  {
    division_id: 2,
    division_geo_code: 'BD50',
    division_name: 'Rajshahi',
    district_id: 17,
    district_geo_code: 'BD5038',
    district_name: 'Joypurhat'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram',
    district_id: 10,
    district_geo_code: 'BD2046',
    district_name: 'Khagrachhari'
  },
  {
    division_id: 3,
    division_geo_code: 'BD40',
    division_name: 'Khulna',
    district_id: 27,
    district_geo_code: 'BD4047',
    district_name: 'Khulna'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj'
  },
  {
    division_id: 7,
    division_geo_code: 'BD55',
    division_name: 'Rangpur',
    district_id: 60,
    district_geo_code: 'BD5549',
    district_name: 'Kurigram'
  },
  {
    division_id: 3,
    division_geo_code: 'BD40',
    division_name: 'Khulna',
    district_id: 25,
    district_geo_code: 'BD4050',
    district_name: 'Kushtia'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram',
    district_id: 7,
    district_geo_code: 'BD2051',
    district_name: 'Lakshmipur'
  },
  {
    division_id: 7,
    division_geo_code: 'BD55',
    division_name: 'Rangpur',
    district_id: 55,
    district_geo_code: 'BD5552',
    district_name: 'Lalmonirhat'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 50,
    district_geo_code: 'BD3054',
    district_name: 'Madaripur'
  },
  {
    division_id: 3,
    division_geo_code: 'BD40',
    division_name: 'Khulna',
    district_id: 26,
    district_geo_code: 'BD4055',
    district_name: 'Magura'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 46,
    district_geo_code: 'BD3056',
    district_name: 'Manikganj'
  },
  {
    division_id: 3,
    division_geo_code: 'BD40',
    division_name: 'Khulna',
    district_id: 22,
    district_geo_code: 'BD4057',
    district_name: 'Meherpur'
  },
  {
    division_id: 5,
    division_geo_code: 'BD60',
    division_name: 'Sylhet',
    district_id: 37,
    district_geo_code: 'BD6058',
    district_name: 'Moulvibazar'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 48,
    district_geo_code: 'BD3059',
    district_name: 'Munshiganj'
  },
  {
    division_id: 8,
    division_geo_code: 'BD45',
    division_name: 'Mymensingh',
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh'
  },
  {
    division_id: 2,
    division_geo_code: 'BD50',
    division_name: 'Rajshahi',
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon'
  },
  {
    division_id: 3,
    division_geo_code: 'BD40',
    division_name: 'Khulna',
    district_id: 23,
    district_geo_code: 'BD4065',
    district_name: 'Narail'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 43,
    district_geo_code: 'BD3067',
    district_name: 'Narayanganj'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 40,
    district_geo_code: 'BD3068',
    district_name: 'Narsingdi'
  },
  {
    division_id: 2,
    division_geo_code: 'BD50',
    division_name: 'Rajshahi',
    district_id: 16,
    district_geo_code: 'BD5069',
    district_name: 'Natore'
  },
  {
    division_id: 8,
    division_geo_code: 'BD45',
    division_name: 'Mymensingh',
    district_id: 64,
    district_geo_code: 'BD4572',
    district_name: 'Netrokona'
  },
  {
    division_id: 7,
    division_geo_code: 'BD55',
    division_name: 'Rangpur',
    district_id: 56,
    district_geo_code: 'BD5573',
    district_name: 'Nilphamari'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram',
    district_id: 5,
    district_geo_code: 'BD2075',
    district_name: 'Noakhali'
  },
  {
    division_id: 2,
    division_geo_code: 'BD50',
    division_name: 'Rajshahi',
    district_id: 13,
    district_geo_code: 'BD5076',
    district_name: 'Pabna'
  },
  {
    division_id: 7,
    division_geo_code: 'BD55',
    division_name: 'Rangpur',
    district_id: 53,
    district_geo_code: 'BD5577',
    district_name: 'Panchagarh'
  },
  {
    division_id: 4,
    division_geo_code: 'BD10',
    division_name: 'Barisal',
    district_id: 31,
    district_geo_code: 'BD1078',
    district_name: 'Patuakhali'
  },
  {
    division_id: 4,
    division_geo_code: 'BD10',
    division_name: 'Barisal',
    district_id: 32,
    district_geo_code: 'BD1079',
    district_name: 'Pirojpur'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 49,
    district_geo_code: 'BD3082',
    district_name: 'Rajbari'
  },
  {
    division_id: 2,
    division_geo_code: 'BD50',
    division_name: 'Rajshahi',
    district_id: 15,
    district_geo_code: 'BD5081',
    district_name: 'Rajshahi'
  },
  {
    division_id: 1,
    division_geo_code: 'BD20',
    division_name: 'Chattagram',
    district_id: 4,
    district_geo_code: 'BD2084',
    district_name: 'Rangamati'
  },
  {
    division_id: 7,
    division_geo_code: 'BD55',
    division_name: 'Rangpur',
    district_id: 59,
    district_geo_code: 'BD5585',
    district_name: 'Rangpur'
  },
  {
    division_id: 3,
    division_geo_code: 'BD40',
    division_name: 'Khulna',
    district_id: 21,
    district_geo_code: 'BD4087',
    district_name: 'Satkhira'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 42,
    district_geo_code: 'BD3086',
    district_name: 'Shariatpur'
  },
  {
    division_id: 8,
    division_geo_code: 'BD45',
    division_name: 'Mymensingh',
    district_id: 61,
    district_geo_code: 'BD4589',
    district_name: 'Sherpur'
  },
  {
    division_id: 2,
    division_geo_code: 'BD50',
    division_name: 'Rajshahi',
    district_id: 12,
    district_geo_code: 'BD5088',
    district_name: 'Sirajganj'
  },
  {
    division_id: 5,
    division_geo_code: 'BD60',
    division_name: 'Sylhet',
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj'
  },
  {
    division_id: 5,
    division_geo_code: 'BD60',
    division_name: 'Sylhet',
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet'
  },
  {
    division_id: 6,
    division_geo_code: 'BD30',
    division_name: 'Dhaka',
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail'
  },
  {
    division_id: 7,
    division_geo_code: 'BD55',
    division_name: 'Rangpur',
    district_id: 58,
    district_geo_code: 'BD5594',
    district_name: 'Thakurgaon'
  }
];

export const upazilaDropDown: Array<AreaDropDown> = [
  {
    district_id: 20,
    district_geo_code: 'BD4041',
    district_name: 'Jashore',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 172,
    upazila_geo_code: 'BD404104',
    upazila_name: 'Abhaynagar'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 127,
    upazila_geo_code: 'BD501006',
    upazila_name: 'Adamdighi'
  },
  {
    district_id: 55,
    district_geo_code: 'BD5552',
    district_name: 'Lalmonirhat',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 421,
    upazila_geo_code: 'BD555202',
    upazila_name: 'Aditmari'
  },
  {
    district_id: 33,
    district_geo_code: 'BD1006',
    district_name: 'Barisal',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 255,
    upazila_geo_code: 'BD100602',
    upazila_name: 'Agailjhara'
  },
  {
    district_id: 38,
    district_geo_code: 'BD6036',
    district_name: 'Habiganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 294,
    upazila_geo_code: 'BD603602',
    upazila_name: 'Ajmiriganj'
  },
  {
    district_id: 3,
    district_geo_code: 'BD2012',
    district_name: 'Brahmanbaria',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 29,
    upazila_geo_code: 'BD201202',
    upazila_name: 'Akhaura'
  },
  {
    district_id: 17,
    district_geo_code: 'BD5038',
    district_name: 'Joypurhat',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 150,
    upazila_geo_code: 'BD503813',
    upazila_name: 'Akkelpur'
  },
  {
    district_id: 24,
    district_geo_code: 'BD4018',
    district_name: 'Chuadanga',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 193,
    upazila_geo_code: 'BD401807',
    upazila_name: 'Alamdanga'
  },
  {
    district_id: 52,
    district_geo_code: 'BD3029',
    district_name: 'Faridpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 391,
    upazila_geo_code: 'BD302903',
    upazila_name: 'Alfadanga'
  },
  {
    district_id: 11,
    district_geo_code: 'BD2003',
    district_name: 'Bandarban',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 98,
    upazila_geo_code: 'BD200304',
    upazila_name: 'Alikadam'
  },
  {
    district_id: 35,
    district_geo_code: 'BD1004',
    district_name: 'Barguna',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 266,
    upazila_geo_code: 'BD100409',
    upazila_name: 'Amtali'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 72,
    upazila_geo_code: 'BD201504',
    upazila_name: 'Anwara'
  },
  {
    district_id: 43,
    district_geo_code: 'BD3067',
    district_name: 'Narayanganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 328,
    upazila_geo_code: 'BD306702',
    upazila_name: 'Araihazar'
  },
  {
    district_id: 3,
    district_geo_code: 'BD2012',
    district_name: 'Brahmanbaria',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 28,
    upazila_geo_code: 'BD201233',
    upazila_name: 'Ashuganj'
  },
  {
    district_id: 21,
    district_geo_code: 'BD4087',
    district_name: 'Satkhira',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 179,
    upazila_geo_code: 'BD408704',
    upazila_name: 'Assasuni'
  },
  {
    district_id: 13,
    district_geo_code: 'BD5076',
    district_name: 'Pabna',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 118,
    upazila_geo_code: 'BD507605',
    upazila_name: 'Atghoria'
  },
  {
    district_id: 64,
    district_geo_code: 'BD4572',
    district_name: 'Netrokona',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 485,
    upazila_geo_code: 'BD457204',
    upazila_name: 'Atpara'
  },
  {
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 166,
    upazila_geo_code: 'BD506403',
    upazila_name: 'Atrai'
  },
  {
    district_id: 53,
    district_geo_code: 'BD5577',
    district_name: 'Panchagarh',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 402,
    upazila_geo_code: 'BD557704',
    upazila_name: 'Atwari'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 355,
    upazila_geo_code: 'BD304802',
    upazila_name: 'Austagram'
  },
  {
    district_id: 33,
    district_geo_code: 'BD1006',
    district_name: 'Barisal',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 251,
    upazila_geo_code: 'BD100603',
    upazila_name: 'Babuganj'
  },
  {
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 161,
    upazila_geo_code: 'BD506406',
    upazila_name: 'Badalgachi'
  },
  {
    district_id: 59,
    district_geo_code: 'BD5585',
    district_name: 'Rangpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 443,
    upazila_geo_code: 'BD558503',
    upazila_name: 'Badargonj'
  },
  {
    district_id: 16,
    district_geo_code: 'BD5069',
    district_name: 'Natore',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 146,
    upazila_geo_code: 'BD506909',
    upazila_name: 'Bagatipara'
  },
  {
    district_id: 28,
    district_geo_code: 'BD4001',
    district_name: 'Bagerhat',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 216,
    upazila_geo_code: 'BD400108',
    upazila_name: 'Bagerhat Sadar'
  },
  {
    district_id: 15,
    district_geo_code: 'BD5081',
    district_name: 'Rajshahi',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 139,
    upazila_geo_code: 'BD508110',
    upazila_name: 'Bagha'
  },
  {
    district_id: 4,
    district_geo_code: 'BD2084',
    district_name: 'Rangamati',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 36,
    upazila_geo_code: 'BD208407',
    upazila_name: 'Baghaichari'
  },
  {
    district_id: 20,
    district_geo_code: 'BD4041',
    district_name: 'Jashore',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 173,
    upazila_geo_code: 'BD404109',
    upazila_name: 'Bagherpara'
  },
  {
    district_id: 15,
    district_geo_code: 'BD5081',
    district_name: 'Rajshahi',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 142,
    upazila_geo_code: 'BD508112',
    upazila_name: 'Bagmara'
  },
  {
    district_id: 38,
    district_geo_code: 'BD6036',
    district_name: 'Habiganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 293,
    upazila_geo_code: 'BD603605',
    upazila_name: 'Bahubal'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 354,
    upazila_geo_code: 'BD304806',
    upazila_name: 'Bajitpur'
  },
  {
    district_id: 33,
    district_geo_code: 'BD1006',
    district_name: 'Barisal',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 250,
    upazila_geo_code: 'BD100607',
    upazila_name: 'Bakerganj'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 272,
    upazila_geo_code: 'BD609108',
    upazila_name: 'Balaganj'
  },
  {
    district_id: 58,
    district_geo_code: 'BD5594',
    district_name: 'Thakurgaon',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 439,
    upazila_geo_code: 'BD559408',
    upazila_name: 'Baliadangi'
  },
  {
    district_id: 49,
    district_geo_code: 'BD3082',
    district_name: 'Rajbari',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 379,
    upazila_geo_code: 'BD308207',
    upazila_name: 'Baliakandi'
  },
  {
    district_id: 35,
    district_geo_code: 'BD1004',
    district_name: 'Barguna',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 269,
    upazila_geo_code: 'BD100419',
    upazila_name: 'Bamna'
  },
  {
    district_id: 33,
    district_geo_code: 'BD1006',
    district_name: 'Barisal',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 253,
    upazila_geo_code: 'BD100610',
    upazila_name: 'Banaripara'
  },
  {
    district_id: 3,
    district_geo_code: 'BD2012',
    district_name: 'Brahmanbaria',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 31,
    upazila_geo_code: 'BD201204',
    upazila_name: 'Bancharampur'
  },
  {
    district_id: 43,
    district_geo_code: 'BD3067',
    district_name: 'Narayanganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 329,
    upazila_geo_code: 'BD306706',
    upazila_name: 'Bandar'
  },
  {
    district_id: 11,
    district_geo_code: 'BD2003',
    district_name: 'Bandarban',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 97,
    upazila_geo_code: 'BD200314',
    upazila_name: 'Bandarban Sadar'
  },
  {
    district_id: 38,
    district_geo_code: 'BD6036',
    district_name: 'Habiganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 295,
    upazila_geo_code: 'BD603611',
    upazila_name: 'Baniachong'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 70,
    upazila_geo_code: 'BD201508',
    upazila_name: 'Banshkhali'
  },
  {
    district_id: 16,
    district_geo_code: 'BD5069',
    district_name: 'Natore',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 145,
    upazila_geo_code: 'BD506915',
    upazila_name: 'Baraigram'
  },
  {
    district_id: 35,
    district_geo_code: 'BD1004',
    district_name: 'Barguna',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 267,
    upazila_geo_code: 'BD100428',
    upazila_name: 'Barguna Sadar'
  },
  {
    district_id: 64,
    district_geo_code: 'BD4572',
    district_name: 'Netrokona',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 482,
    upazila_geo_code: 'BD457209',
    upazila_name: 'Barhatta'
  },
  {
    district_id: 33,
    district_geo_code: 'BD1006',
    district_name: 'Barisal',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 249,
    upazila_geo_code: 'BD100651',
    upazila_name: 'Barisal Sadar'
  },
  {
    district_id: 4,
    district_geo_code: 'BD2084',
    district_name: 'Rangamati',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 37,
    upazila_geo_code: 'BD208421',
    upazila_name: 'Barkal'
  },
  {
    district_id: 37,
    district_geo_code: 'BD6058',
    district_name: 'Moulvibazar',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 285,
    upazila_geo_code: 'BD605814',
    upazila_name: 'Barlekha'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 2,
    upazila_geo_code: 'BD201909',
    upazila_name: 'Barura'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 333,
    upazila_geo_code: 'BD309309',
    upazila_name: 'Basail'
  },
  {
    district_id: 31,
    district_geo_code: 'BD1078',
    district_name: 'Patuakhali',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 234,
    upazila_geo_code: 'BD107838',
    upazila_name: 'Bauphal'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 273,
    upazila_geo_code: 'BD609117',
    upazila_name: 'Beanibazar'
  },
  {
    district_id: 5,
    district_geo_code: 'BD2075',
    district_name: 'Noakhali',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 45,
    upazila_geo_code: 'BD207507',
    upazila_name: 'Begumganj'
  },
  {
    district_id: 40,
    district_geo_code: 'BD3068',
    district_name: 'Narsingdi',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 311,
    upazila_geo_code: 'BD306807',
    upazila_name: 'Belabo'
  },
  {
    district_id: 4,
    district_geo_code: 'BD2084',
    district_name: 'Rangamati',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 40,
    upazila_geo_code: 'BD208429',
    upazila_name: 'Belaichari'
  },
  {
    district_id: 12,
    district_geo_code: 'BD5088',
    district_name: 'Sirajganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 104,
    upazila_geo_code: 'BD508811',
    upazila_name: 'Belkuchi'
  },
  {
    district_id: 13,
    district_geo_code: 'BD5076',
    district_name: 'Pabna',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 117,
    upazila_geo_code: 'BD507616',
    upazila_name: 'Bera'
  },
  {
    district_id: 35,
    district_geo_code: 'BD1004',
    district_name: 'Barguna',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 268,
    upazila_geo_code: 'BD100447',
    upazila_name: 'Betagi'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 347,
    upazila_geo_code: 'BD304811',
    upazila_name: 'Bhairab'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 464,
    upazila_geo_code: 'BD456113',
    upazila_name: 'Bhaluka'
  },
  {
    district_id: 32,
    district_geo_code: 'BD1079',
    district_name: 'Pirojpur',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 246,
    upazila_geo_code: 'BD107914',
    upazila_name: 'Bhandaria'
  },
  {
    district_id: 52,
    district_geo_code: 'BD3029',
    district_name: 'Faridpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 395,
    upazila_geo_code: 'BD302910',
    upazila_name: 'Bhanga'
  },
  {
    district_id: 13,
    district_geo_code: 'BD5076',
    district_name: 'Pabna',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 115,
    upazila_geo_code: 'BD507619',
    upazila_name: 'Bhangura'
  },
  {
    district_id: 42,
    district_geo_code: 'BD3086',
    district_name: 'Shariatpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 326,
    upazila_geo_code: 'BD308614',
    upazila_name: 'Bhedarganj'
  },
  {
    district_id: 25,
    district_geo_code: 'BD4050',
    district_name: 'Kushtia',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 201,
    upazila_geo_code: 'BD405015',
    upazila_name: 'Bheramara'
  },
  {
    district_id: 34,
    district_geo_code: 'BD1009',
    district_name: 'Bhola',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 259,
    upazila_geo_code: 'BD100918',
    upazila_name: 'Bhola Sadar'
  },
  {
    district_id: 18,
    district_geo_code: 'BD5070',
    district_name: 'Chapainawabganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 158,
    upazila_geo_code: 'BD507018',
    upazila_name: 'Bholahat'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 334,
    upazila_geo_code: 'BD309319',
    upazila_name: 'Bhuapur'
  },
  {
    district_id: 60,
    district_geo_code: 'BD5549',
    district_name: 'Kurigram',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 450,
    upazila_geo_code: 'BD554906',
    upazila_name: 'Bhurungamari'
  },
  {
    district_id: 3,
    district_geo_code: 'BD2012',
    district_name: 'Brahmanbaria',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 32,
    upazila_geo_code: 'BD201207',
    upazila_name: 'Bijoynagar'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 407,
    upazila_geo_code: 'BD552710',
    upazila_name: 'Birampur'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 405,
    upazila_geo_code: 'BD552712',
    upazila_name: 'Birganj'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 415,
    upazila_geo_code: 'BD552717',
    upazila_name: 'Birol'
  },
  {
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 302,
    upazila_geo_code: 'BD609018',
    upazila_name: 'Bishwambarpur'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 274,
    upazila_geo_code: 'BD609120',
    upazila_name: 'Bishwanath'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 71,
    upazila_geo_code: 'BD201512',
    upazila_name: 'Boalkhali'
  },
  {
    district_id: 52,
    district_geo_code: 'BD3029',
    district_name: 'Faridpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 392,
    upazila_geo_code: 'BD302918',
    upazila_name: 'Boalmari'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 409,
    upazila_geo_code: 'BD552721',
    upazila_name: 'Bochaganj'
  },
  {
    district_id: 53,
    district_geo_code: 'BD5577',
    district_name: 'Panchagarh',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 401,
    upazila_geo_code: 'BD557725',
    upazila_name: 'Boda'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 123,
    upazila_geo_code: 'BD501020',
    upazila_name: 'Bogra Sadar'
  },
  {
    district_id: 63,
    district_geo_code: 'BD4539',
    district_name: 'Jamalpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 481,
    upazila_geo_code: 'BD453907',
    upazila_name: 'Bokshiganj'
  },
  {
    district_id: 34,
    district_geo_code: 'BD1009',
    district_name: 'Bhola',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 260,
    upazila_geo_code: 'BD100921',
    upazila_name: 'Borhan Sddin'
  },
  {
    district_id: 27,
    district_geo_code: 'BD4047',
    district_name: 'Khulna',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 212,
    upazila_geo_code: 'BD404712',
    upazila_name: 'Botiaghata'
  },
  {
    district_id: 3,
    district_geo_code: 'BD2012',
    district_name: 'Brahmanbaria',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 24,
    upazila_geo_code: 'BD201213',
    upazila_name: 'Brahmanbaria Sadar'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 3,
    upazila_geo_code: 'BD201915',
    upazila_name: 'Brahmanpara'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 16,
    upazila_geo_code: 'BD201918',
    upazila_name: 'Burichang'
  },
  {
    district_id: 9,
    district_geo_code: 'BD2022',
    district_name: 'Coxsbazar',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 81,
    upazila_geo_code: 'BD202216',
    upazila_name: 'Chakaria'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 73,
    upazila_geo_code: 'BD201518',
    upazila_name: 'Chandanaish'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 4,
    upazila_geo_code: 'BD201927',
    upazila_name: 'Chandina'
  },
  {
    district_id: 6,
    district_geo_code: 'BD2013',
    district_name: 'Chandpur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 55,
    upazila_geo_code: 'BD201322',
    upazila_name: 'Chandpur Sadar'
  },
  {
    district_id: 18,
    district_geo_code: 'BD5070',
    district_name: 'Chapainawabganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 155,
    upazila_geo_code: 'BD507066',
    upazila_name: 'Chapainawabganj Sadar'
  },
  {
    district_id: 52,
    district_geo_code: 'BD3029',
    district_name: 'Faridpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 396,
    upazila_geo_code: 'BD302921',
    upazila_name: 'Charbhadrasan'
  },
  {
    district_id: 34,
    district_geo_code: 'BD1009',
    district_name: 'Bhola',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 261,
    upazila_geo_code: 'BD100925',
    upazila_name: 'Charfesson'
  },
  {
    district_id: 15,
    district_geo_code: 'BD5081',
    district_name: 'Rajshahi',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 137,
    upazila_geo_code: 'BD508125',
    upazila_name: 'Charghat'
  },
  {
    district_id: 60,
    district_geo_code: 'BD5549',
    district_name: 'Kurigram',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 456,
    upazila_geo_code: 'BD554908',
    upazila_name: 'Charrajibpur'
  },
  {
    district_id: 5,
    district_geo_code: 'BD2075',
    district_name: 'Noakhali',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 50,
    upazila_geo_code: 'BD207510',
    upazila_name: 'Chatkhil'
  },
  {
    district_id: 13,
    district_geo_code: 'BD5076',
    district_name: 'Pabna',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 119,
    upazila_geo_code: 'BD507622',
    upazila_name: 'Chatmohar'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 5,
    upazila_geo_code: 'BD201931',
    upazila_name: 'Chauddagram'
  },
  {
    district_id: 12,
    district_geo_code: 'BD5088',
    district_name: 'Sirajganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 105,
    upazila_geo_code: 'BD508827',
    upazila_name: 'Chauhali'
  },
  {
    district_id: 2,
    district_geo_code: 'BD2030',
    district_name: 'Feni',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 18,
    upazila_geo_code: 'BD203014',
    upazila_name: 'Chhagalnaiya'
  },
  {
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 303,
    upazila_geo_code: 'BD609023',
    upazila_name: 'Chhatak'
  },
  {
    district_id: 60,
    district_geo_code: 'BD5549',
    district_name: 'Kurigram',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 454,
    upazila_geo_code: 'BD554909',
    upazila_name: 'Chilmari'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 416,
    upazila_geo_code: 'BD552730',
    upazila_name: 'Chirirbandar'
  },
  {
    district_id: 28,
    district_geo_code: 'BD4001',
    district_name: 'Bagerhat',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 223,
    upazila_geo_code: 'BD400114',
    upazila_name: 'Chitalmari'
  },
  {
    district_id: 20,
    district_geo_code: 'BD4041',
    district_name: 'Jashore',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 174,
    upazila_geo_code: 'BD404111',
    upazila_name: 'Chougachha'
  },
  {
    district_id: 24,
    district_geo_code: 'BD4018',
    district_name: 'Chuadanga',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 192,
    upazila_geo_code: 'BD401823',
    upazila_name: 'Chuadanga Sadar'
  },
  {
    district_id: 38,
    district_geo_code: 'BD6036',
    district_name: 'Habiganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 297,
    upazila_geo_code: 'BD603626',
    upazila_name: 'Chunarughat'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 11,
    upazila_geo_code: 'BD201967',
    upazila_name: 'Comilla Sadar'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 275,
    upazila_geo_code: 'BD207521',
    upazila_name: 'Companiganj'
  },
  {
    district_id: 5,
    district_geo_code: 'BD2075',
    district_name: 'Noakhali',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 44,
    upazila_geo_code: 'BD609127',
    upazila_name: 'Companiganj'
  },
  {
    district_id: 9,
    district_geo_code: 'BD2022',
    district_name: 'Coxsbazar',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 80,
    upazila_geo_code: 'BD202224',
    upazila_name: 'Coxsbazar Sadar'
  },
  {
    district_id: 2,
    district_geo_code: 'BD2030',
    district_name: 'Feni',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 23,
    upazila_geo_code: 'BD203025',
    upazila_name: 'Daganbhuiyan'
  },
  {
    district_id: 27,
    district_geo_code: 'BD4047',
    district_name: 'Khulna',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 213,
    upazila_geo_code: 'BD404717',
    upazila_name: 'Dakop'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 283,
    upazila_geo_code: 'BD609131',
    upazila_name: 'Dakshinsurma'
  },
  {
    district_id: 42,
    district_geo_code: 'BD3086',
    district_name: 'Shariatpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 327,
    upazila_geo_code: 'BD308625',
    upazila_name: 'Damudya'
  },
  {
    district_id: 24,
    district_geo_code: 'BD4018',
    district_name: 'Chuadanga',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 194,
    upazila_geo_code: 'BD401831',
    upazila_name: 'Damurhuda'
  },
  {
    district_id: 31,
    district_geo_code: 'BD1078',
    district_name: 'Patuakhali',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 237,
    upazila_geo_code: 'BD107852',
    upazila_name: 'Dashmina'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 6,
    upazila_geo_code: 'BD201936',
    upazila_name: 'Daudkandi'
  },
  {
    district_id: 25,
    district_geo_code: 'BD4050',
    district_name: 'Kushtia',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 200,
    upazila_geo_code: 'BD405039',
    upazila_name: 'Daulatpur'
  },
  {
    district_id: 21,
    district_geo_code: 'BD4087',
    district_name: 'Satkhira',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 180,
    upazila_geo_code: 'BD408725',
    upazila_name: 'Debhata'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 1,
    upazila_geo_code: 'BD201940',
    upazila_name: 'Debidwar'
  },
  {
    district_id: 53,
    district_geo_code: 'BD5577',
    district_name: 'Panchagarh',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 400,
    upazila_geo_code: 'BD557734',
    upazila_name: 'Debiganj'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 335,
    upazila_geo_code: 'BD309323',
    upazila_name: 'Delduar'
  },
  {
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 310,
    upazila_geo_code: 'BD609029',
    upazila_name: 'Derai'
  },
  {
    district_id: 63,
    district_geo_code: 'BD4539',
    district_name: 'Jamalpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 478,
    upazila_geo_code: 'BD453915',
    upazila_name: 'Dewangonj'
  },
  {
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 163,
    upazila_geo_code: 'BD506428',
    upazila_name: 'Dhamoirhat'
  },
  {
    district_id: 47,
    district_geo_code: 'BD3026',
    district_name: 'Dhaka',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 366,
    upazila_geo_code: 'BD302614',
    upazila_name: 'Dhamrai'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 344,
    upazila_geo_code: 'BD309325',
    upazila_name: 'Dhanbari'
  },
  {
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 307,
    upazila_geo_code: 'BD609032',
    upazila_name: 'Dharmapasha'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 467,
    upazila_geo_code: 'BD456116',
    upazila_name: 'Dhobaura'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 130,
    upazila_geo_code: 'BD501027',
    upazila_name: 'Dhunot'
  },
  {
    district_id: 10,
    district_geo_code: 'BD2046',
    district_name: 'Khagrachhari',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 89,
    upazila_geo_code: 'BD204643',
    upazila_name: 'Dighinala'
  },
  {
    district_id: 27,
    district_geo_code: 'BD4047',
    district_name: 'Khulna',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 208,
    upazila_geo_code: 'BD404740',
    upazila_name: 'Digholia'
  },
  {
    district_id: 56,
    district_geo_code: 'BD5573',
    district_name: 'Nilphamari',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 424,
    upazila_geo_code: 'BD557312',
    upazila_name: 'Dimla'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 412,
    upazila_geo_code: 'BD552764',
    upazila_name: 'Dinajpur Sadar'
  },
  {
    district_id: 47,
    district_geo_code: 'BD3026',
    district_name: 'Dhaka',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 369,
    upazila_geo_code: 'BD302618',
    upazila_name: 'Dohar'
  },
  {
    district_id: 56,
    district_geo_code: 'BD5573',
    district_name: 'Nilphamari',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 423,
    upazila_geo_code: 'BD557315',
    upazila_name: 'Domar'
  },
  {
    district_id: 34,
    district_geo_code: 'BD1009',
    district_name: 'Bhola',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 262,
    upazila_geo_code: 'BD100929',
    upazila_name: 'Doulatkhan'
  },
  {
    district_id: 46,
    district_geo_code: 'BD3056',
    district_name: 'Manikganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 363,
    upazila_geo_code: 'BD305610',
    upazila_name: 'Doulatpur'
  },
  {
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 305,
    upazila_geo_code: 'BD609033',
    upazila_name: 'Dowarabazar'
  },
  {
    district_id: 31,
    district_geo_code: 'BD1078',
    district_name: 'Patuakhali',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 236,
    upazila_geo_code: 'BD107855',
    upazila_name: 'Dumki'
  },
  {
    district_id: 27,
    district_geo_code: 'BD4047',
    district_name: 'Khulna',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 211,
    upazila_geo_code: 'BD404730',
    upazila_name: 'Dumuria'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 126,
    upazila_geo_code: 'BD501033',
    upazila_name: 'Dupchanchia'
  },
  {
    district_id: 15,
    district_geo_code: 'BD5081',
    district_name: 'Rajshahi',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 135,
    upazila_geo_code: 'BD508131',
    upazila_name: 'Durgapur'
  },
  {
    district_id: 64,
    district_geo_code: 'BD4572',
    district_name: 'Netrokona',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 483,
    upazila_geo_code: 'BD457218',
    upazila_name: 'Durgapur'
  },
  {
    district_id: 28,
    district_geo_code: 'BD4001',
    district_name: 'Bagerhat',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 215,
    upazila_geo_code: 'BD400134',
    upazila_name: 'Fakirhat'
  },
  {
    district_id: 6,
    district_geo_code: 'BD2013',
    district_name: 'Chandpur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 59,
    upazila_geo_code: 'BD201345',
    upazila_name: 'Faridgonj'
  },
  {
    district_id: 13,
    district_geo_code: 'BD5076',
    district_name: 'Pabna',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 121,
    upazila_geo_code: 'BD507633',
    upazila_name: 'Faridpur'
  },
  {
    district_id: 52,
    district_geo_code: 'BD3029',
    district_name: 'Faridpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 390,
    upazila_geo_code: 'BD302947',
    upazila_name: 'Faridpur Sadar'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 77,
    upazila_geo_code: 'BD201533',
    upazila_name: 'Fatikchhari'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 276,
    upazila_geo_code: 'BD609135',
    upazila_name: 'Fenchuganj'
  },
  {
    district_id: 2,
    district_geo_code: 'BD2030',
    district_name: 'Feni',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 19,
    upazila_geo_code: 'BD203029',
    upazila_name: 'Feni Sadar'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 411,
    upazila_geo_code: 'BD552738',
    upazila_name: 'Fulbari'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 462,
    upazila_geo_code: 'BD456120',
    upazila_name: 'Fulbaria'
  },
  {
    district_id: 2,
    district_geo_code: 'BD2030',
    district_name: 'Feni',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 21,
    upazila_geo_code: 'BD203041',
    upazila_name: 'Fulgazi'
  },
  {
    district_id: 27,
    district_geo_code: 'BD4047',
    district_name: 'Khulna',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 207,
    upazila_geo_code: 'BD404769',
    upazila_name: 'Fultola'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 131,
    upazila_geo_code: 'BD501040',
    upazila_name: 'Gabtali'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 471,
    upazila_geo_code: 'BD456122',
    upazila_name: 'Gafargaon'
  },
  {
    district_id: 57,
    district_geo_code: 'BD5532',
    district_name: 'Gaibandha',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 429,
    upazila_geo_code: 'BD553224',
    upazila_name: 'Gaibandha Sadar'
  },
  {
    district_id: 48,
    district_geo_code: 'BD3059',
    district_name: 'Munshiganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 374,
    upazila_geo_code: 'BD305924',
    upazila_name: 'Gajaria'
  },
  {
    district_id: 31,
    district_geo_code: 'BD1078',
    district_name: 'Patuakhali',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 240,
    upazila_geo_code: 'BD107857',
    upazila_name: 'Galachipa'
  },
  {
    district_id: 59,
    district_geo_code: 'BD5585',
    district_name: 'Rangpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 441,
    upazila_geo_code: 'BD558527',
    upazila_name: 'Gangachara'
  },
  {
    district_id: 22,
    district_geo_code: 'BD4057',
    district_name: 'Meherpur',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 188,
    upazila_geo_code: 'BD405747',
    upazila_name: 'Gangni'
  },
  {
    district_id: 41,
    district_geo_code: 'BD3033',
    district_name: 'Gazipur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 320,
    upazila_geo_code: 'BD303330',
    upazila_name: 'Gazipur Sadar'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 336,
    upazila_geo_code: 'BD309328',
    upazila_name: 'Ghatail'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 406,
    upazila_geo_code: 'BD552743',
    upazila_name: 'Ghoraghat'
  },
  {
    district_id: 46,
    district_geo_code: 'BD3056',
    district_name: 'Manikganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 361,
    upazila_geo_code: 'BD305622',
    upazila_name: 'Gior'
  },
  {
    district_id: 49,
    district_geo_code: 'BD3082',
    district_name: 'Rajbari',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 377,
    upazila_geo_code: 'BD308229',
    upazila_name: 'Goalanda'
  },
  {
    district_id: 57,
    district_geo_code: 'BD5532',
    district_name: 'Gaibandha',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 432,
    upazila_geo_code: 'BD553230',
    upazila_name: 'Gobindaganj'
  },
  {
    district_id: 15,
    district_geo_code: 'BD5081',
    district_name: 'Rajshahi',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 140,
    upazila_geo_code: 'BD508134',
    upazila_name: 'Godagari'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 277,
    upazila_geo_code: 'BD609138',
    upazila_name: 'Golapganj'
  },
  {
    district_id: 18,
    district_geo_code: 'BD5070',
    district_name: 'Chapainawabganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 156,
    upazila_geo_code: 'BD507037',
    upazila_name: 'Gomostapur'
  },
  {
    district_id: 51,
    district_geo_code: 'BD3035',
    district_name: 'Gopalganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 385,
    upazila_geo_code: 'BD303532',
    upazila_name: 'Gopalganj Sadar'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 337,
    upazila_geo_code: 'BD309338',
    upazila_name: 'Gopalpur'
  },
  {
    district_id: 42,
    district_geo_code: 'BD3086',
    district_name: 'Shariatpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 325,
    upazila_geo_code: 'BD308636',
    upazila_name: 'Gosairhat'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 470,
    upazila_geo_code: 'BD456123',
    upazila_name: 'Gouripur'
  },
  {
    district_id: 33,
    district_geo_code: 'BD1006',
    district_name: 'Barisal',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 254,
    upazila_geo_code: 'BD100632',
    upazila_name: 'Gournadi'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 278,
    upazila_geo_code: 'BD609141',
    upazila_name: 'Gowainghat'
  },
  {
    district_id: 10,
    district_geo_code: 'BD2046',
    district_name: 'Khagrachhari',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 96,
    upazila_geo_code: null,
    upazila_name: 'Guimara'
  },
  {
    district_id: 16,
    district_geo_code: 'BD5069',
    district_name: 'Natore',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 148,
    upazila_geo_code: 'BD506941',
    upazila_name: 'Gurudaspur'
  },
  {
    district_id: 38,
    district_geo_code: 'BD6036',
    district_name: 'Habiganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 298,
    upazila_geo_code: 'BD603644',
    upazila_name: 'Habiganj Sadar'
  },
  {
    district_id: 6,
    district_geo_code: 'BD2013',
    district_name: 'Chandpur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 52,
    upazila_geo_code: 'BD201347',
    upazila_name: 'Haimchar'
  },
  {
    district_id: 6,
    district_geo_code: 'BD2013',
    district_name: 'Chandpur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 57,
    upazila_geo_code: 'BD201349',
    upazila_name: 'Hajiganj'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 413,
    upazila_geo_code: 'BD552747',
    upazila_name: 'Hakimpur'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 469,
    upazila_geo_code: 'BD456124',
    upazila_name: 'Haluaghat'
  },
  {
    district_id: 29,
    district_geo_code: 'BD4044',
    district_name: 'Jhenaidah',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 226,
    upazila_geo_code: 'BD404414',
    upazila_name: 'Harinakundu'
  },
  {
    district_id: 58,
    district_geo_code: 'BD5594',
    district_name: 'Thakurgaon',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 438,
    upazila_geo_code: 'BD559451',
    upazila_name: 'Haripur'
  },
  {
    district_id: 46,
    district_geo_code: 'BD3056',
    district_name: 'Manikganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 358,
    upazila_geo_code: 'BD305628',
    upazila_name: 'Harirampur'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 76,
    upazila_geo_code: 'BD201537',
    upazila_name: 'Hathazari'
  },
  {
    district_id: 5,
    district_geo_code: 'BD2075',
    district_name: 'Noakhali',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 46,
    upazila_geo_code: 'BD207536',
    upazila_name: 'Hatia'
  },
  {
    district_id: 55,
    district_geo_code: 'BD5552',
    district_name: 'Lalmonirhat',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 419,
    upazila_geo_code: 'BD555233',
    upazila_name: 'Hatibandha'
  },
  {
    district_id: 33,
    district_geo_code: 'BD1006',
    district_name: 'Barisal',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 258,
    upazila_geo_code: 'BD100636',
    upazila_name: 'Hizla'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 7,
    upazila_geo_code: 'BD201954',
    upazila_name: 'Homna'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 349,
    upazila_geo_code: 'BD304827',
    upazila_name: 'Hossainpur'
  },
  {
    district_id: 13,
    district_geo_code: 'BD5076',
    district_name: 'Pabna',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 114,
    upazila_geo_code: 'BD507639',
    upazila_name: 'Ishurdi'
  },
  {
    district_id: 63,
    district_geo_code: 'BD4539',
    district_name: 'Jamalpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 477,
    upazila_geo_code: 'BD453929',
    upazila_name: 'Islampur'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 472,
    upazila_geo_code: 'BD456131',
    upazila_name: 'Iswarganj'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 345,
    upazila_geo_code: 'BD304833',
    upazila_name: 'Itna'
  },
  {
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 304,
    upazila_geo_code: 'BD609047',
    upazila_name: 'Jagannathpur'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 279,
    upazila_geo_code: 'BD609153',
    upazila_name: 'Jaintiapur'
  },
  {
    district_id: 56,
    district_geo_code: 'BD5573',
    district_name: 'Nilphamari',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 425,
    upazila_geo_code: 'BD557336',
    upazila_name: 'Jaldhaka'
  },
  {
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 308,
    upazila_geo_code: 'BD609050',
    upazila_name: 'Jamalganj'
  },
  {
    district_id: 63,
    district_geo_code: 'BD4539',
    district_name: 'Jamalpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 475,
    upazila_geo_code: 'BD453936',
    upazila_name: 'Jamalpur Sadar'
  },
  {
    district_id: 20,
    district_geo_code: 'BD4041',
    district_name: 'Jashore',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 177,
    upazila_geo_code: 'BD404147',
    upazila_name: 'Jessore Sadar'
  },
  {
    district_id: 30,
    district_geo_code: 'BD1042',
    district_name: 'Jhalakathi',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 230,
    upazila_geo_code: 'BD104240',
    upazila_name: 'Jhalakathi Sadar'
  },
  {
    district_id: 29,
    district_geo_code: 'BD4044',
    district_name: 'Jhenaidah',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 224,
    upazila_geo_code: 'BD404419',
    upazila_name: 'Jhenaidah Sadar'
  },
  {
    district_id: 61,
    district_geo_code: 'BD4589',
    district_name: 'Sherpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 461,
    upazila_geo_code: 'BD458937',
    upazila_name: 'Jhenaigati'
  },
  {
    district_id: 20,
    district_geo_code: 'BD4041',
    district_name: 'Jashore',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 175,
    upazila_geo_code: 'BD404123',
    upazila_name: 'Jhikargacha'
  },
  {
    district_id: 24,
    district_geo_code: 'BD4018',
    district_name: 'Chuadanga',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 195,
    upazila_geo_code: 'BD401855',
    upazila_name: 'Jibannagar'
  },
  {
    district_id: 17,
    district_geo_code: 'BD5038',
    district_name: 'Joypurhat',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 154,
    upazila_geo_code: 'BD503847',
    upazila_name: 'Joypurhat Sadar'
  },
  {
    district_id: 4,
    district_geo_code: 'BD2084',
    district_name: 'Rangamati',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 41,
    upazila_geo_code: 'BD208447',
    upazila_name: 'Juraichari'
  },
  {
    district_id: 37,
    district_geo_code: 'BD6058',
    district_name: 'Moulvibazar',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 291,
    upazila_geo_code: 'BD605835',
    upazila_name: 'Juri'
  },
  {
    district_id: 5,
    district_geo_code: 'BD2075',
    district_name: 'Noakhali',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 48,
    upazila_geo_code: 'BD207547',
    upazila_name: 'Kabirhat'
  },
  {
    district_id: 6,
    district_geo_code: 'BD2013',
    district_name: 'Chandpur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 53,
    upazila_geo_code: 'BD201358',
    upazila_name: 'Kachua'
  },
  {
    district_id: 28,
    district_geo_code: 'BD4001',
    district_name: 'Bagerhat',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 221,
    upazila_geo_code: 'BD400138',
    upazila_name: 'Kachua'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 122,
    upazila_geo_code: 'BD501054',
    upazila_name: 'Kahaloo'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 410,
    upazila_geo_code: 'BD552756',
    upazila_name: 'Kaharol'
  },
  {
    district_id: 17,
    district_geo_code: 'BD5038',
    district_name: 'Joypurhat',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 151,
    upazila_geo_code: 'BD503858',
    upazila_name: 'Kalai'
  },
  {
    district_id: 31,
    district_geo_code: 'BD1078',
    district_name: 'Patuakhali',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 238,
    upazila_geo_code: 'BD107866',
    upazila_name: 'Kalapara'
  },
  {
    district_id: 21,
    district_geo_code: 'BD4087',
    district_name: 'Satkhira',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 181,
    upazila_geo_code: 'BD408743',
    upazila_name: 'Kalaroa'
  },
  {
    district_id: 23,
    district_geo_code: 'BD4065',
    district_name: 'Narail',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 191,
    upazila_geo_code: 'BD406528',
    upazila_name: 'Kalia'
  },
  {
    district_id: 41,
    district_geo_code: 'BD3033',
    district_name: 'Gazipur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 318,
    upazila_geo_code: 'BD303332',
    upazila_name: 'Kaliakair'
  },
  {
    district_id: 41,
    district_geo_code: 'BD3033',
    district_name: 'Gazipur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 317,
    upazila_geo_code: 'BD303334',
    upazila_name: 'Kaliganj'
  },
  {
    district_id: 55,
    district_geo_code: 'BD5552',
    district_name: 'Lalmonirhat',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 418,
    upazila_geo_code: 'BD555239',
    upazila_name: 'Kaliganj'
  },
  {
    district_id: 21,
    district_geo_code: 'BD4087',
    district_name: 'Satkhira',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 185,
    upazila_geo_code: 'BD408747',
    upazila_name: 'Kaliganj'
  },
  {
    district_id: 29,
    district_geo_code: 'BD4044',
    district_name: 'Jhenaidah',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 227,
    upazila_geo_code: 'BD404433',
    upazila_name: 'Kaliganj'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 343,
    upazila_geo_code: 'BD309347',
    upazila_name: 'Kalihati'
  },
  {
    district_id: 50,
    district_geo_code: 'BD3054',
    district_name: 'Madaripur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 383,
    upazila_geo_code: 'BD305440',
    upazila_name: 'Kalkini'
  },
  {
    district_id: 64,
    district_geo_code: 'BD4572',
    district_name: 'Netrokona',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 488,
    upazila_geo_code: 'BD457240',
    upazila_name: 'Kalmakanda'
  },
  {
    district_id: 49,
    district_geo_code: 'BD3082',
    district_name: 'Rajbari',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 380,
    upazila_geo_code: 'BD308247',
    upazila_name: 'Kalukhali'
  },
  {
    district_id: 7,
    district_geo_code: 'BD2051',
    district_name: 'Lakshmipur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 61,
    upazila_geo_code: 'BD205133',
    upazila_name: 'Kamalnagar'
  },
  {
    district_id: 12,
    district_geo_code: 'BD5088',
    district_name: 'Sirajganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 106,
    upazila_geo_code: 'BD508844',
    upazila_name: 'Kamarkhand'
  },
  {
    district_id: 37,
    district_geo_code: 'BD6058',
    district_name: 'Moulvibazar',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 286,
    upazila_geo_code: 'BD605856',
    upazila_name: 'Kamolganj'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 280,
    upazila_geo_code: 'BD609159',
    upazila_name: 'Kanaighat'
  },
  {
    district_id: 41,
    district_geo_code: 'BD3033',
    district_name: 'Gazipur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 319,
    upazila_geo_code: 'BD303336',
    upazila_name: 'Kapasia'
  },
  {
    district_id: 4,
    district_geo_code: 'BD2084',
    district_name: 'Rangamati',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 34,
    upazila_geo_code: 'BD208436',
    upazila_name: 'Kaptai'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 353,
    upazila_geo_code: 'BD304842',
    upazila_name: 'Karimgonj'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 79,
    upazila_geo_code: null,
    upazila_name: 'Karnafuli'
  },
  {
    district_id: 3,
    district_geo_code: 'BD2012',
    district_name: 'Brahmanbaria',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 25,
    upazila_geo_code: 'BD201263',
    upazila_name: 'Kasba'
  },
  {
    district_id: 51,
    district_geo_code: 'BD3035',
    district_name: 'Gopalganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 386,
    upazila_geo_code: 'BD303543',
    upazila_name: 'Kashiani'
  },
  {
    district_id: 30,
    district_geo_code: 'BD1042',
    district_name: 'Jhalakathi',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 231,
    upazila_geo_code: 'BD104243',
    upazila_name: 'Kathalia'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 346,
    upazila_geo_code: 'BD304845',
    upazila_name: 'Katiadi'
  },
  {
    district_id: 59,
    district_geo_code: 'BD5585',
    district_name: 'Rangpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 446,
    upazila_geo_code: 'BD558542',
    upazila_name: 'Kaunia'
  },
  {
    district_id: 4,
    district_geo_code: 'BD2084',
    district_name: 'Rangamati',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 35,
    upazila_geo_code: 'BD107947',
    upazila_name: 'Kawkhali'
  },
  {
    district_id: 32,
    district_geo_code: 'BD1079',
    district_name: 'Pirojpur',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 244,
    upazila_geo_code: 'BD107947',
    upazila_name: 'Kawkhali'
  },
  {
    district_id: 12,
    district_geo_code: 'BD5088',
    district_name: 'Sirajganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 107,
    upazila_geo_code: 'BD508850',
    upazila_name: 'Kazipur'
  },
  {
    district_id: 64,
    district_geo_code: 'BD4572',
    district_name: 'Netrokona',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 484,
    upazila_geo_code: 'BD457247',
    upazila_name: 'Kendua'
  },
  {
    district_id: 47,
    district_geo_code: 'BD3026',
    district_name: 'Dhaka',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 367,
    upazila_geo_code: 'BD302638',
    upazila_name: 'Keraniganj'
  },
  {
    district_id: 20,
    district_geo_code: 'BD4041',
    district_name: 'Jashore',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 176,
    upazila_geo_code: 'BD404138',
    upazila_name: 'Keshabpur'
  },
  {
    district_id: 10,
    district_geo_code: 'BD2046',
    district_name: 'Khagrachhari',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 88,
    upazila_geo_code: 'BD204649',
    upazila_name: 'Khagrachhari Sadar'
  },
  {
    district_id: 64,
    district_geo_code: 'BD4572',
    district_name: 'Netrokona',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 487,
    upazila_geo_code: 'BD457238',
    upazila_name: 'Khaliajuri'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 414,
    upazila_geo_code: 'BD552760',
    upazila_name: 'Khansama'
  },
  {
    district_id: 17,
    district_geo_code: 'BD5038',
    district_name: 'Joypurhat',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 152,
    upazila_geo_code: 'BD503861',
    upazila_name: 'Khetlal'
  },
  {
    district_id: 25,
    district_geo_code: 'BD4050',
    district_name: 'Kushtia',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 198,
    upazila_geo_code: 'BD405063',
    upazila_name: 'Khoksa'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 352,
    upazila_geo_code: 'BD304849',
    upazila_name: 'Kishoreganj Sadar'
  },
  {
    district_id: 56,
    district_geo_code: 'BD5573',
    district_name: 'Nilphamari',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 426,
    upazila_geo_code: 'BD557345',
    upazila_name: 'Kishorganj'
  },
  {
    district_id: 51,
    district_geo_code: 'BD3035',
    district_name: 'Gopalganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 388,
    upazila_geo_code: 'BD303551',
    upazila_name: 'Kotalipara'
  },
  {
    district_id: 29,
    district_geo_code: 'BD4044',
    district_name: 'Jhenaidah',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 228,
    upazila_geo_code: 'BD404442',
    upazila_name: 'Kotchandpur'
  },
  {
    district_id: 27,
    district_geo_code: 'BD4047',
    district_name: 'Khulna',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 214,
    upazila_geo_code: 'BD404753',
    upazila_name: 'Koyra'
  },
  {
    district_id: 37,
    district_geo_code: 'BD6058',
    district_name: 'Moulvibazar',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 287,
    upazila_geo_code: 'BD605865',
    upazila_name: 'Kulaura'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 351,
    upazila_geo_code: 'BD304854',
    upazila_name: 'Kuliarchar'
  },
  {
    district_id: 25,
    district_geo_code: 'BD4050',
    district_name: 'Kushtia',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 197,
    upazila_geo_code: 'BD405071',
    upazila_name: 'Kumarkhali'
  },
  {
    district_id: 60,
    district_geo_code: 'BD5549',
    district_name: 'Kurigram',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 448,
    upazila_geo_code: 'BD554952',
    upazila_name: 'Kurigram Sadar'
  },
  {
    district_id: 25,
    district_geo_code: 'BD4050',
    district_name: 'Kushtia',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 196,
    upazila_geo_code: 'BD405079',
    upazila_name: 'Kushtia Sadar'
  },
  {
    district_id: 9,
    district_geo_code: 'BD2022',
    district_name: 'Coxsbazar',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 82,
    upazila_geo_code: 'BD202245',
    upazila_name: 'Kutubdia'
  },
  {
    district_id: 38,
    district_geo_code: 'BD6036',
    district_name: 'Habiganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 296,
    upazila_geo_code: 'BD603668',
    upazila_name: 'Lakhai'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 8,
    upazila_geo_code: 'BD201972',
    upazila_name: 'Laksam'
  },
  {
    district_id: 7,
    district_geo_code: 'BD2051',
    district_name: 'Lakshmipur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 60,
    upazila_geo_code: 'BD205143',
    upazila_name: 'Lakshmipur Sadar'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 17,
    upazila_geo_code: null,
    upazila_name: 'Lalmai'
  },
  {
    district_id: 34,
    district_geo_code: 'BD1009',
    district_name: 'Bhola',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 265,
    upazila_geo_code: 'BD100954',
    upazila_name: 'Lalmohan'
  },
  {
    district_id: 55,
    district_geo_code: 'BD5552',
    district_name: 'Lalmonirhat',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 417,
    upazila_geo_code: 'BD555255',
    upazila_name: 'Lalmonirhat Sadar'
  },
  {
    district_id: 16,
    district_geo_code: 'BD5069',
    district_name: 'Natore',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 147,
    upazila_geo_code: 'BD506944',
    upazila_name: 'Lalpur'
  },
  {
    district_id: 11,
    district_geo_code: 'BD2003',
    district_name: 'Bandarban',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 101,
    upazila_geo_code: 'BD200351',
    upazila_name: 'Lama'
  },
  {
    district_id: 4,
    district_geo_code: 'BD2084',
    district_name: 'Rangamati',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 38,
    upazila_geo_code: 'BD208458',
    upazila_name: 'Langadu'
  },
  {
    district_id: 10,
    district_geo_code: 'BD2046',
    district_name: 'Khagrachhari',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 91,
    upazila_geo_code: 'BD204661',
    upazila_name: 'Laxmichhari'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 75,
    upazila_geo_code: 'BD201547',
    upazila_name: 'Lohagara'
  },
  {
    district_id: 23,
    district_geo_code: 'BD4065',
    district_name: 'Narail',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 190,
    upazila_geo_code: 'BD406552',
    upazila_name: 'Lohagara'
  },
  {
    district_id: 48,
    district_geo_code: 'BD3059',
    district_name: 'Munshiganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 373,
    upazila_geo_code: 'BD305944',
    upazila_name: 'Louhajanj'
  },
  {
    district_id: 64,
    district_geo_code: 'BD4572',
    district_name: 'Netrokona',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 486,
    upazila_geo_code: 'BD457256',
    upazila_name: 'Madan'
  },
  {
    district_id: 63,
    district_geo_code: 'BD4539',
    district_name: 'Jamalpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 480,
    upazila_geo_code: 'BD453958',
    upazila_name: 'Madarganj'
  },
  {
    district_id: 50,
    district_geo_code: 'BD3054',
    district_name: 'Madaripur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 381,
    upazila_geo_code: 'BD305454',
    upazila_name: 'Madaripur Sadar'
  },
  {
    district_id: 38,
    district_geo_code: 'BD6036',
    district_name: 'Habiganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 299,
    upazila_geo_code: 'BD603671',
    upazila_name: 'Madhabpur'
  },
  {
    district_id: 52,
    district_geo_code: 'BD3029',
    district_name: 'Faridpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 397,
    upazila_geo_code: 'BD302956',
    upazila_name: 'Madhukhali'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 338,
    upazila_geo_code: 'BD309357',
    upazila_name: 'Madhupur'
  },
  {
    district_id: 26,
    district_geo_code: 'BD4055',
    district_name: 'Magura',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 204,
    upazila_geo_code: 'BD405557',
    upazila_name: 'Magura Sadar'
  },
  {
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 165,
    upazila_geo_code: 'BD506447',
    upazila_name: 'Manda'
  },
  {
    district_id: 10,
    district_geo_code: 'BD2046',
    district_name: 'Khagrachhari',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 93,
    upazila_geo_code: 'BD204667',
    upazila_name: 'Manikchari'
  },
  {
    district_id: 46,
    district_geo_code: 'BD3056',
    district_name: 'Manikganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 360,
    upazila_geo_code: 'BD305646',
    upazila_name: 'Manikganj Sadar'
  },
  {
    district_id: 20,
    district_geo_code: 'BD4041',
    district_name: 'Jashore',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 171,
    upazila_geo_code: 'BD404161',
    upazila_name: 'Manirampur'
  },
  {
    district_id: 32,
    district_geo_code: 'BD1079',
    district_name: 'Pirojpur',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 247,
    upazila_geo_code: 'BD107958',
    upazila_name: 'Mathbaria'
  },
  {
    district_id: 10,
    district_geo_code: 'BD2046',
    district_name: 'Khagrachhari',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 95,
    upazila_geo_code: 'BD204670',
    upazila_name: 'Matiranga'
  },
  {
    district_id: 6,
    district_geo_code: 'BD2013',
    district_name: 'Chandpur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 58,
    upazila_geo_code: 'BD201379',
    upazila_name: 'Matlab North'
  },
  {
    district_id: 6,
    district_geo_code: 'BD2013',
    district_name: 'Chandpur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 56,
    upazila_geo_code: 'BD201376',
    upazila_name: 'Matlab South'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 12,
    upazila_geo_code: 'BD201975',
    upazila_name: 'Meghna'
  },
  {
    district_id: 33,
    district_geo_code: 'BD1006',
    district_name: 'Barisal',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 256,
    upazila_geo_code: 'BD100662',
    upazila_name: 'Mehendiganj'
  },
  {
    district_id: 22,
    district_geo_code: 'BD4057',
    district_name: 'Meherpur',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 187,
    upazila_geo_code: 'BD405787',
    upazila_name: 'Meherpur Sadar'
  },
  {
    district_id: 63,
    district_geo_code: 'BD4539',
    district_name: 'Jamalpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 476,
    upazila_geo_code: 'BD453961',
    upazila_name: 'Melandah'
  },
  {
    district_id: 25,
    district_geo_code: 'BD4050',
    district_name: 'Kushtia',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 199,
    upazila_geo_code: 'BD405094',
    upazila_name: 'Mirpur'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 67,
    upazila_geo_code: 'BD201553',
    upazila_name: 'Mirsharai'
  },
  {
    district_id: 31,
    district_geo_code: 'BD1078',
    district_name: 'Patuakhali',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 239,
    upazila_geo_code: 'BD107876',
    upazila_name: 'Mirzaganj'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 339,
    upazila_geo_code: 'BD309366',
    upazila_name: 'Mirzapur'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 356,
    upazila_geo_code: 'BD304859',
    upazila_name: 'Mithamoin'
  },
  {
    district_id: 59,
    district_geo_code: 'BD5585',
    district_name: 'Rangpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 444,
    upazila_geo_code: 'BD558558',
    upazila_name: 'Mithapukur'
  },
  {
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 160,
    upazila_geo_code: 'BD506450',
    upazila_name: 'Mohadevpur'
  },
  {
    district_id: 10,
    district_geo_code: 'BD2046',
    district_name: 'Khagrachhari',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 92,
    upazila_geo_code: 'BD204665',
    upazila_name: 'Mohalchari'
  },
  {
    district_id: 26,
    district_geo_code: 'BD4055',
    district_name: 'Magura',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 205,
    upazila_geo_code: 'BD405566',
    upazila_name: 'Mohammadpur'
  },
  {
    district_id: 9,
    district_geo_code: 'BD2022',
    district_name: 'Coxsbazar',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 84,
    upazila_geo_code: 'BD202249',
    upazila_name: 'Moheshkhali'
  },
  {
    district_id: 29,
    district_geo_code: 'BD4044',
    district_name: 'Jhenaidah',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 229,
    upazila_geo_code: 'BD404471',
    upazila_name: 'Moheshpur'
  },
  {
    district_id: 64,
    district_geo_code: 'BD4572',
    district_name: 'Netrokona',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 489,
    upazila_geo_code: 'BD457263',
    upazila_name: 'Mohongonj'
  },
  {
    district_id: 15,
    district_geo_code: 'BD5081',
    district_name: 'Rajshahi',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 136,
    upazila_geo_code: 'BD508153',
    upazila_name: 'Mohonpur'
  },
  {
    district_id: 28,
    district_geo_code: 'BD4001',
    district_name: 'Bagerhat',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 217,
    upazila_geo_code: 'BD400156',
    upazila_name: 'Mollahat'
  },
  {
    district_id: 28,
    district_geo_code: 'BD4001',
    district_name: 'Bagerhat',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 222,
    upazila_geo_code: 'BD400158',
    upazila_name: 'Mongla'
  },
  {
    district_id: 40,
    district_geo_code: 'BD3068',
    district_name: 'Narsingdi',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 312,
    upazila_geo_code: 'BD306852',
    upazila_name: 'Monohardi'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 13,
    upazila_geo_code: 'BD201974',
    upazila_name: 'Monohargonj'
  },
  {
    district_id: 34,
    district_geo_code: 'BD1009',
    district_name: 'Bhola',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 263,
    upazila_geo_code: 'BD100965',
    upazila_name: 'Monpura'
  },
  {
    district_id: 28,
    district_geo_code: 'BD4001',
    district_name: 'Bagerhat',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 220,
    upazila_geo_code: 'BD400160',
    upazila_name: 'Morrelganj'
  },
  {
    district_id: 37,
    district_geo_code: 'BD6058',
    district_name: 'Moulvibazar',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 288,
    upazila_geo_code: 'BD605874',
    upazila_name: 'Moulvibazar Sadar'
  },
  {
    district_id: 22,
    district_geo_code: 'BD4057',
    district_name: 'Meherpur',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 186,
    upazila_geo_code: 'BD405760',
    upazila_name: 'Mujibnagar'
  },
  {
    district_id: 51,
    district_geo_code: 'BD3035',
    district_name: 'Gopalganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 389,
    upazila_geo_code: 'BD303558',
    upazila_name: 'Muksudpur'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 465,
    upazila_geo_code: 'BD456165',
    upazila_name: 'Muktagacha'
  },
  {
    district_id: 33,
    district_geo_code: 'BD1006',
    district_name: 'Barisal',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 257,
    upazila_geo_code: 'BD100669',
    upazila_name: 'Muladi'
  },
  {
    district_id: 48,
    district_geo_code: 'BD3059',
    district_name: 'Munshiganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 370,
    upazila_geo_code: 'BD305956',
    upazila_name: 'Munshiganj Sadar'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 9,
    upazila_geo_code: 'BD201981',
    upazila_name: 'Muradnagar'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 466,
    upazila_geo_code: 'BD456152',
    upazila_name: 'Mymensingh Sadar'
  },
  {
    district_id: 38,
    district_geo_code: 'BD6036',
    district_name: 'Habiganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 292,
    upazila_geo_code: 'BD603677',
    upazila_name: 'Nabiganj'
  },
  {
    district_id: 3,
    district_geo_code: 'BD2012',
    district_name: 'Brahmanbaria',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 30,
    upazila_geo_code: 'BD201285',
    upazila_name: 'Nabinagar'
  },
  {
    district_id: 18,
    district_geo_code: 'BD5070',
    district_name: 'Chapainawabganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 157,
    upazila_geo_code: 'BD507056',
    upazila_name: 'Nachol'
  },
  {
    district_id: 52,
    district_geo_code: 'BD3029',
    district_name: 'Faridpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 394,
    upazila_geo_code: 'BD302962',
    upazila_name: 'Nagarkanda'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 340,
    upazila_geo_code: 'BD309376',
    upazila_name: 'Nagarpur'
  },
  {
    district_id: 60,
    district_geo_code: 'BD5549',
    district_name: 'Kurigram',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 449,
    upazila_geo_code: 'BD554961',
    upazila_name: 'Nageshwari'
  },
  {
    district_id: 11,
    district_geo_code: 'BD2003',
    district_name: 'Bandarban',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 99,
    upazila_geo_code: 'BD200373',
    upazila_name: 'Naikhongchhari'
  },
  {
    district_id: 30,
    district_geo_code: 'BD1042',
    district_name: 'Jhalakathi',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 232,
    upazila_geo_code: 'BD104273',
    upazila_name: 'Nalchity'
  },
  {
    district_id: 16,
    district_geo_code: 'BD5069',
    district_name: 'Natore',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 149,
    upazila_geo_code: null,
    upazila_name: 'Naldanga'
  },
  {
    district_id: 61,
    district_geo_code: 'BD4589',
    district_name: 'Sherpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 458,
    upazila_geo_code: 'BD458970',
    upazila_name: 'Nalitabari'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 473,
    upazila_geo_code: 'BD456172',
    upazila_name: 'Nandail'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 10,
    upazila_geo_code: 'BD201987',
    upazila_name: 'Nangalkot'
  },
  {
    district_id: 4,
    district_geo_code: 'BD2084',
    district_name: 'Rangamati',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 42,
    upazila_geo_code: 'BD208475',
    upazila_name: 'Naniarchar'
  },
  {
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 168,
    upazila_geo_code: 'BD506460',
    upazila_name: 'Naogaon Sadar'
  },
  {
    district_id: 23,
    district_geo_code: 'BD4065',
    district_name: 'Narail',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 189,
    upazila_geo_code: 'BD406576',
    upazila_name: 'Narail Sadar'
  },
  {
    district_id: 43,
    district_geo_code: 'BD3067',
    district_name: 'Narayanganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 330,
    upazila_geo_code: 'BD306758',
    upazila_name: 'Narayanganj Sadar'
  },
  {
    district_id: 42,
    district_geo_code: 'BD3086',
    district_name: 'Shariatpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 323,
    upazila_geo_code: 'BD308665',
    upazila_name: 'Naria'
  },
  {
    district_id: 40,
    district_geo_code: 'BD3068',
    district_name: 'Narsingdi',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 313,
    upazila_geo_code: 'BD306860',
    upazila_name: 'Narsingdi Sadar'
  },
  {
    district_id: 3,
    district_geo_code: 'BD2012',
    district_name: 'Brahmanbaria',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 26,
    upazila_geo_code: 'BD201290',
    upazila_name: 'Nasirnagar'
  },
  {
    district_id: 16,
    district_geo_code: 'BD5069',
    district_name: 'Natore',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 143,
    upazila_geo_code: 'BD506963',
    upazila_name: 'Natore Sadar'
  },
  {
    district_id: 47,
    district_geo_code: 'BD3026',
    district_name: 'Dhaka',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 368,
    upazila_geo_code: 'BD302662',
    upazila_name: 'Nawabganj'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 404,
    upazila_geo_code: 'BD552769',
    upazila_name: 'Nawabganj'
  },
  {
    district_id: 32,
    district_geo_code: 'BD1079',
    district_name: 'Pirojpur',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 243,
    upazila_geo_code: 'BD107976',
    upazila_name: 'Nazirpur'
  },
  {
    district_id: 32,
    district_geo_code: 'BD1079',
    district_name: 'Pirojpur',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 248,
    upazila_geo_code: 'BD107987',
    upazila_name: 'Nesarabad'
  },
  {
    district_id: 64,
    district_geo_code: 'BD4572',
    district_name: 'Netrokona',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 491,
    upazila_geo_code: 'BD457274',
    upazila_name: 'Netrokona Sadar'
  },
  {
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 164,
    upazila_geo_code: 'BD506469',
    upazila_name: 'Niamatpur'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 357,
    upazila_geo_code: 'BD304876',
    upazila_name: 'Nikli'
  },
  {
    district_id: 56,
    district_geo_code: 'BD5573',
    district_name: 'Nilphamari',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 427,
    upazila_geo_code: 'BD557364',
    upazila_name: 'Nilphamari Sadar'
  },
  {
    district_id: 5,
    district_geo_code: 'BD2075',
    district_name: 'Noakhali',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 43,
    upazila_geo_code: 'BD207587',
    upazila_name: 'Noakhali Sadar'
  },
  {
    district_id: 61,
    district_geo_code: 'BD4589',
    district_name: 'Sherpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 460,
    upazila_geo_code: 'BD458967',
    upazila_name: 'Nokla'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 128,
    upazila_geo_code: 'BD501067',
    upazila_name: 'Nondigram'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 284,
    upazila_geo_code: null,
    upazila_name: 'Osmaninagar'
  },
  {
    district_id: 15,
    district_geo_code: 'BD5081',
    district_name: 'Rajshahi',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 134,
    upazila_geo_code: 'BD508172',
    upazila_name: 'Paba'
  },
  {
    district_id: 13,
    district_geo_code: 'BD5076',
    district_name: 'Pabna',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 116,
    upazila_geo_code: 'BD507655',
    upazila_name: 'Pabna Sadar'
  },
  {
    district_id: 27,
    district_geo_code: 'BD4047',
    district_name: 'Khulna',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 206,
    upazila_geo_code: 'BD404764',
    upazila_name: 'Paikgasa'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 350,
    upazila_geo_code: 'BD304879',
    upazila_name: 'Pakundia'
  },
  {
    district_id: 40,
    district_geo_code: 'BD3068',
    district_name: 'Narsingdi',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 314,
    upazila_geo_code: 'BD306863',
    upazila_name: 'Palash'
  },
  {
    district_id: 57,
    district_geo_code: 'BD5532',
    district_name: 'Gaibandha',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 430,
    upazila_geo_code: 'BD553267',
    upazila_name: 'Palashbari'
  },
  {
    district_id: 53,
    district_geo_code: 'BD5577',
    district_name: 'Panchagarh',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 399,
    upazila_geo_code: 'BD557773',
    upazila_name: 'Panchagarh Sadar'
  },
  {
    district_id: 10,
    district_geo_code: 'BD2046',
    district_name: 'Khagrachhari',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 90,
    upazila_geo_code: 'BD204677',
    upazila_name: 'Panchari'
  },
  {
    district_id: 17,
    district_geo_code: 'BD5038',
    district_name: 'Joypurhat',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 153,
    upazila_geo_code: 'BD503874',
    upazila_name: 'Panchbibi'
  },
  {
    district_id: 49,
    district_geo_code: 'BD3082',
    district_name: 'Rajbari',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 378,
    upazila_geo_code: 'BD308273',
    upazila_name: 'Pangsa'
  },
  {
    district_id: 54,
    district_geo_code: 'BD5527',
    district_name: 'Dinajpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 408,
    upazila_geo_code: 'BD552777',
    upazila_name: 'Parbatipur'
  },
  {
    district_id: 2,
    district_geo_code: 'BD2030',
    district_name: 'Feni',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 22,
    upazila_geo_code: 'BD203051',
    upazila_name: 'Parshuram'
  },
  {
    district_id: 55,
    district_geo_code: 'BD5552',
    district_name: 'Lalmonirhat',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 420,
    upazila_geo_code: 'BD555270',
    upazila_name: 'Patgram'
  },
  {
    district_id: 35,
    district_geo_code: 'BD1004',
    district_name: 'Barguna',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 270,
    upazila_geo_code: 'BD100485',
    upazila_name: 'Pathorghata'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 68,
    upazila_geo_code: 'BD201561',
    upazila_name: 'Patiya'
  },
  {
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 162,
    upazila_geo_code: 'BD506475',
    upazila_name: 'Patnitala'
  },
  {
    district_id: 31,
    district_geo_code: 'BD1078',
    district_name: 'Patuakhali',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 235,
    upazila_geo_code: 'BD107895',
    upazila_name: 'Patuakhali Sadar'
  },
  {
    district_id: 9,
    district_geo_code: 'BD2022',
    district_name: 'Coxsbazar',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 85,
    upazila_geo_code: 'BD202256',
    upazila_name: 'Pekua'
  },
  {
    district_id: 60,
    district_geo_code: 'BD5549',
    district_name: 'Kurigram',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 451,
    upazila_geo_code: 'BD554918',
    upazila_name: 'Phulbari'
  },
  {
    district_id: 57,
    district_geo_code: 'BD5532',
    district_name: 'Gaibandha',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 434,
    upazila_geo_code: 'BD553221',
    upazila_name: 'Phulchari'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 468,
    upazila_geo_code: 'BD456181',
    upazila_name: 'Phulpur'
  },
  {
    district_id: 59,
    district_geo_code: 'BD5585',
    district_name: 'Rangpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 447,
    upazila_geo_code: 'BD558573',
    upazila_name: 'Pirgacha'
  },
  {
    district_id: 58,
    district_geo_code: 'BD5594',
    district_name: 'Thakurgaon',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 436,
    upazila_geo_code: 'BD559482',
    upazila_name: 'Pirganj'
  },
  {
    district_id: 59,
    district_geo_code: 'BD5585',
    district_name: 'Rangpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 445,
    upazila_geo_code: 'BD558576',
    upazila_name: 'Pirgonj'
  },
  {
    district_id: 32,
    district_geo_code: 'BD1079',
    district_name: 'Pirojpur',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 242,
    upazila_geo_code: 'BD107980',
    upazila_name: 'Pirojpur Sadar'
  },
  {
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 169,
    upazila_geo_code: 'BD506479',
    upazila_name: 'Porsha'
  },
  {
    district_id: 64,
    district_geo_code: 'BD4572',
    district_name: 'Netrokona',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 490,
    upazila_geo_code: 'BD457283',
    upazila_name: 'Purbadhala'
  },
  {
    district_id: 15,
    district_geo_code: 'BD5081',
    district_name: 'Rajshahi',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 138,
    upazila_geo_code: 'BD508182',
    upazila_name: 'Puthia'
  },
  {
    district_id: 12,
    district_geo_code: 'BD5088',
    district_name: 'Sirajganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 108,
    upazila_geo_code: 'BD508861',
    upazila_name: 'Raigonj'
  },
  {
    district_id: 7,
    district_geo_code: 'BD2051',
    district_name: 'Lakshmipur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 62,
    upazila_geo_code: 'BD205158',
    upazila_name: 'Raipur'
  },
  {
    district_id: 40,
    district_geo_code: 'BD3068',
    district_name: 'Narsingdi',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 315,
    upazila_geo_code: 'BD306864',
    upazila_name: 'Raipura'
  },
  {
    district_id: 30,
    district_geo_code: 'BD1042',
    district_name: 'Jhalakathi',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 233,
    upazila_geo_code: 'BD104284',
    upazila_name: 'Rajapur'
  },
  {
    district_id: 60,
    district_geo_code: 'BD5549',
    district_name: 'Kurigram',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 452,
    upazila_geo_code: 'BD554977',
    upazila_name: 'Rajarhat'
  },
  {
    district_id: 4,
    district_geo_code: 'BD2084',
    district_name: 'Rangamati',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 39,
    upazila_geo_code: 'BD208478',
    upazila_name: 'Rajasthali'
  },
  {
    district_id: 49,
    district_geo_code: 'BD3082',
    district_name: 'Rajbari',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 376,
    upazila_geo_code: 'BD308276',
    upazila_name: 'Rajbari Sadar'
  },
  {
    district_id: 37,
    district_geo_code: 'BD6058',
    district_name: 'Moulvibazar',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 289,
    upazila_geo_code: 'BD605880',
    upazila_name: 'Rajnagar'
  },
  {
    district_id: 50,
    district_geo_code: 'BD3054',
    district_name: 'Madaripur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 384,
    upazila_geo_code: 'BD305480',
    upazila_name: 'Rajoir'
  },
  {
    district_id: 7,
    district_geo_code: 'BD2051',
    district_name: 'Lakshmipur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 64,
    upazila_geo_code: 'BD205165',
    upazila_name: 'Ramganj'
  },
  {
    district_id: 10,
    district_geo_code: 'BD2046',
    district_name: 'Khagrachhari',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 94,
    upazila_geo_code: 'BD204680',
    upazila_name: 'Ramgarh'
  },
  {
    district_id: 7,
    district_geo_code: 'BD2051',
    district_name: 'Lakshmipur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 63,
    upazila_geo_code: 'BD205173',
    upazila_name: 'Ramgati'
  },
  {
    district_id: 28,
    district_geo_code: 'BD4001',
    district_name: 'Bagerhat',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 219,
    upazila_geo_code: 'BD400173',
    upazila_name: 'Rampal'
  },
  {
    district_id: 9,
    district_geo_code: 'BD2022',
    district_name: 'Coxsbazar',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 86,
    upazila_geo_code: 'BD202266',
    upazila_name: 'Ramu'
  },
  {
    district_id: 31,
    district_geo_code: 'BD1078',
    district_name: 'Patuakhali',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 241,
    upazila_geo_code: null,
    upazila_name: 'Rangabali'
  },
  {
    district_id: 4,
    district_geo_code: 'BD2084',
    district_name: 'Rangamati',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 33,
    upazila_geo_code: 'BD208487',
    upazila_name: 'Rangamati Sadar'
  },
  {
    district_id: 59,
    district_geo_code: 'BD5585',
    district_name: 'Rangpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 440,
    upazila_geo_code: 'BD558549',
    upazila_name: 'Rangpur Sadar'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 65,
    upazila_geo_code: 'BD201570',
    upazila_name: 'Rangunia'
  },
  {
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 167,
    upazila_geo_code: 'BD506485',
    upazila_name: 'Raninagar'
  },
  {
    district_id: 58,
    district_geo_code: 'BD5594',
    district_name: 'Thakurgaon',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 437,
    upazila_geo_code: 'BD559486',
    upazila_name: 'Ranisankail'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 78,
    upazila_geo_code: 'BD201574',
    upazila_name: 'Raozan'
  },
  {
    district_id: 11,
    district_geo_code: 'BD2003',
    district_name: 'Bandarban',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 100,
    upazila_geo_code: 'BD200389',
    upazila_name: 'Rowangchhari'
  },
  {
    district_id: 60,
    district_geo_code: 'BD5549',
    district_name: 'Kurigram',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 455,
    upazila_geo_code: 'BD554979',
    upazila_name: 'Rowmari'
  },
  {
    district_id: 11,
    district_geo_code: 'BD2003',
    district_name: 'Bandarban',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 102,
    upazila_geo_code: 'BD200391',
    upazila_name: 'Ruma'
  },
  {
    district_id: 43,
    district_geo_code: 'BD3067',
    district_name: 'Narayanganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 331,
    upazila_geo_code: 'BD306768',
    upazila_name: 'Rupganj'
  },
  {
    district_id: 27,
    district_geo_code: 'BD4047',
    district_name: 'Khulna',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 209,
    upazila_geo_code: 'BD404775',
    upazila_name: 'Rupsha'
  },
  {
    district_id: 52,
    district_geo_code: 'BD3029',
    district_name: 'Faridpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 393,
    upazila_geo_code: 'BD302984',
    upazila_name: 'Sadarpur'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 14,
    upazila_geo_code: 'BD201933',
    upazila_name: 'Sadarsouth'
  },
  {
    district_id: 57,
    district_geo_code: 'BD5532',
    district_name: 'Gaibandha',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 428,
    upazila_geo_code: 'BD553282',
    upazila_name: 'Sadullapur'
  },
  {
    district_id: 57,
    district_geo_code: 'BD5532',
    district_name: 'Gaibandha',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 431,
    upazila_geo_code: 'BD553288',
    upazila_name: 'Saghata'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 341,
    upazila_geo_code: 'BD309385',
    upazila_name: 'Sakhipur'
  },
  {
    district_id: 52,
    district_geo_code: 'BD3029',
    district_name: 'Faridpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 398,
    upazila_geo_code: 'BD302990',
    upazila_name: 'Saltha'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 69,
    upazila_geo_code: 'BD201578',
    upazila_name: 'Sandwip'
  },
  {
    district_id: 13,
    district_geo_code: 'BD5076',
    district_name: 'Pabna',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 120,
    upazila_geo_code: 'BD507672',
    upazila_name: 'Santhia'
  },
  {
    district_id: 19,
    district_geo_code: 'BD5064',
    district_name: 'Naogaon',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 170,
    upazila_geo_code: 'BD506486',
    upazila_name: 'Sapahar'
  },
  {
    district_id: 3,
    district_geo_code: 'BD2012',
    district_name: 'Brahmanbaria',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 27,
    upazila_geo_code: 'BD201294',
    upazila_name: 'Sarail'
  },
  {
    district_id: 28,
    district_geo_code: 'BD4001',
    district_name: 'Bagerhat',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 218,
    upazila_geo_code: 'BD400177',
    upazila_name: 'Sarankhola'
  },
  {
    district_id: 63,
    district_geo_code: 'BD4539',
    district_name: 'Jamalpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 479,
    upazila_geo_code: 'BD453985',
    upazila_name: 'Sarishabari'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 74,
    upazila_geo_code: 'BD201582',
    upazila_name: 'Satkania'
  },
  {
    district_id: 21,
    district_geo_code: 'BD4087',
    district_name: 'Satkhira',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 182,
    upazila_geo_code: 'BD408782',
    upazila_name: 'Satkhira Sadar'
  },
  {
    district_id: 46,
    district_geo_code: 'BD3056',
    district_name: 'Manikganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 359,
    upazila_geo_code: 'BD305670',
    upazila_name: 'Saturia'
  },
  {
    district_id: 47,
    district_geo_code: 'BD3026',
    district_name: 'Dhaka',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 365,
    upazila_geo_code: 'BD302672',
    upazila_name: 'Savar'
  },
  {
    district_id: 5,
    district_geo_code: 'BD2075',
    district_name: 'Noakhali',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 49,
    upazila_geo_code: 'BD207580',
    upazila_name: 'Senbug'
  },
  {
    district_id: 12,
    district_geo_code: 'BD5088',
    district_name: 'Sirajganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 109,
    upazila_geo_code: 'BD508867',
    upazila_name: 'Shahjadpur'
  },
  {
    district_id: 6,
    district_geo_code: 'BD2013',
    district_name: 'Chandpur',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 54,
    upazila_geo_code: 'BD201395',
    upazila_name: 'Shahrasti'
  },
  {
    district_id: 29,
    district_geo_code: 'BD4044',
    district_name: 'Jhenaidah',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 225,
    upazila_geo_code: 'BD404480',
    upazila_name: 'Shailkupa'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 125,
    upazila_geo_code: 'BD501085',
    upazila_name: 'Shajahanpur'
  },
  {
    district_id: 26,
    district_geo_code: 'BD4055',
    district_name: 'Magura',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 202,
    upazila_geo_code: 'BD405585',
    upazila_name: 'Shalikha'
  },
  {
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 309,
    upazila_geo_code: 'BD609086',
    upazila_name: 'Shalla'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 124,
    upazila_geo_code: 'BD501081',
    upazila_name: 'Shariakandi'
  },
  {
    district_id: 42,
    district_geo_code: 'BD3086',
    district_name: 'Shariatpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 322,
    upazila_geo_code: 'BD308669',
    upazila_name: 'Shariatpur Sadar'
  },
  {
    district_id: 20,
    district_geo_code: 'BD4041',
    district_name: 'Jashore',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 178,
    upazila_geo_code: 'BD404190',
    upazila_name: 'Sharsha'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 132,
    upazila_geo_code: 'BD501088',
    upazila_name: 'Sherpur'
  },
  {
    district_id: 61,
    district_geo_code: 'BD4589',
    district_name: 'Sherpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 457,
    upazila_geo_code: 'BD458988',
    upazila_name: 'Sherpur Sadar'
  },
  {
    district_id: 46,
    district_geo_code: 'BD3056',
    district_name: 'Manikganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 362,
    upazila_geo_code: 'BD305678',
    upazila_name: 'Shibaloy'
  },
  {
    district_id: 50,
    district_geo_code: 'BD3054',
    district_name: 'Madaripur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 382,
    upazila_geo_code: 'BD305487',
    upazila_name: 'Shibchar'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 133,
    upazila_geo_code: 'BD501094',
    upazila_name: 'Shibganj'
  },
  {
    district_id: 18,
    district_geo_code: 'BD5070',
    district_name: 'Chapainawabganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 159,
    upazila_geo_code: 'BD507088',
    upazila_name: 'Shibganj'
  },
  {
    district_id: 40,
    district_geo_code: 'BD3068',
    district_name: 'Narsingdi',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 316,
    upazila_geo_code: 'BD306876',
    upazila_name: 'Shibpur'
  },
  {
    district_id: 21,
    district_geo_code: 'BD4087',
    district_name: 'Satkhira',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 183,
    upazila_geo_code: 'BD408786',
    upazila_name: 'Shyamnagar'
  },
  {
    district_id: 46,
    district_geo_code: 'BD3056',
    district_name: 'Manikganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 364,
    upazila_geo_code: 'BD305682',
    upazila_name: 'Singiar'
  },
  {
    district_id: 16,
    district_geo_code: 'BD5069',
    district_name: 'Natore',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 144,
    upazila_geo_code: 'BD506991',
    upazila_name: 'Singra'
  },
  {
    district_id: 48,
    district_geo_code: 'BD3059',
    district_name: 'Munshiganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 372,
    upazila_geo_code: 'BD305974',
    upazila_name: 'Sirajdikhan'
  },
  {
    district_id: 12,
    district_geo_code: 'BD5088',
    district_name: 'Sirajganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 110,
    upazila_geo_code: 'BD508878',
    upazila_name: 'Sirajganj Sadar'
  },
  {
    district_id: 8,
    district_geo_code: 'BD2015',
    district_name: 'Chattogram',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 66,
    upazila_geo_code: 'BD201586',
    upazila_name: 'Sitakunda'
  },
  {
    district_id: 2,
    district_geo_code: 'BD2030',
    district_name: 'Feni',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 20,
    upazila_geo_code: 'BD203094',
    upazila_name: 'Sonagazi'
  },
  {
    district_id: 5,
    district_geo_code: 'BD2075',
    district_name: 'Noakhali',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 51,
    upazila_geo_code: 'BD207583',
    upazila_name: 'Sonaimori'
  },
  {
    district_id: 43,
    district_geo_code: 'BD3067',
    district_name: 'Narayanganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 332,
    upazila_geo_code: 'BD306704',
    upazila_name: 'Sonargaon'
  },
  {
    district_id: 14,
    district_geo_code: 'BD5010',
    district_name: 'Bogura',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 129,
    upazila_geo_code: 'BD501095',
    upazila_name: 'Sonatala'
  },
  {
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 301,
    upazila_geo_code: 'BD609027',
    upazila_name: 'South Sunamganj'
  },
  {
    district_id: 61,
    district_geo_code: 'BD4589',
    district_name: 'Sherpur',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 459,
    upazila_geo_code: 'BD458990',
    upazila_name: 'Sreebordi'
  },
  {
    district_id: 37,
    district_geo_code: 'BD6058',
    district_name: 'Moulvibazar',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 290,
    upazila_geo_code: 'BD605883',
    upazila_name: 'Sreemangal'
  },
  {
    district_id: 48,
    district_geo_code: 'BD3059',
    district_name: 'Munshiganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 371,
    upazila_geo_code: 'BD305984',
    upazila_name: 'Sreenagar'
  },
  {
    district_id: 41,
    district_geo_code: 'BD3033',
    district_name: 'Gazipur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 321,
    upazila_geo_code: 'BD303386',
    upazila_name: 'Sreepur'
  },
  {
    district_id: 26,
    district_geo_code: 'BD4055',
    district_name: 'Magura',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 203,
    upazila_geo_code: 'BD405595',
    upazila_name: 'Sreepur'
  },
  {
    district_id: 5,
    district_geo_code: 'BD2075',
    district_name: 'Noakhali',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 47,
    upazila_geo_code: 'BD207585',
    upazila_name: 'Subarnachar'
  },
  {
    district_id: 13,
    district_geo_code: 'BD5076',
    district_name: 'Pabna',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 113,
    upazila_geo_code: 'BD507683',
    upazila_name: 'Sujanagar'
  },
  {
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 300,
    upazila_geo_code: 'BD609089',
    upazila_name: 'Sunamganj Sadar'
  },
  {
    district_id: 57,
    district_geo_code: 'BD5532',
    district_name: 'Gaibandha',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 433,
    upazila_geo_code: 'BD553291',
    upazila_name: 'Sundarganj'
  },
  {
    district_id: 56,
    district_geo_code: 'BD5573',
    district_name: 'Nilphamari',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 422,
    upazila_geo_code: 'BD557385',
    upazila_name: 'Syedpur'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 281,
    upazila_geo_code: 'BD609162',
    upazila_name: 'Sylhet Sadar'
  },
  {
    district_id: 39,
    district_geo_code: 'BD6090',
    district_name: 'Sunamganj',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 306,
    upazila_geo_code: 'BD609092',
    upazila_name: 'Tahirpur'
  },
  {
    district_id: 21,
    district_geo_code: 'BD4087',
    district_name: 'Satkhira',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 184,
    upazila_geo_code: 'BD408790',
    upazila_name: 'Tala'
  },
  {
    district_id: 35,
    district_geo_code: 'BD1004',
    district_name: 'Barguna',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 271,
    upazila_geo_code: null,
    upazila_name: 'Taltali'
  },
  {
    district_id: 44,
    district_geo_code: 'BD3093',
    district_name: 'Tangail',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 342,
    upazila_geo_code: 'BD309395',
    upazila_name: 'Tangail Sadar'
  },
  {
    district_id: 15,
    district_geo_code: 'BD5081',
    district_name: 'Rajshahi',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 141,
    upazila_geo_code: 'BD508194',
    upazila_name: 'Tanore'
  },
  {
    district_id: 59,
    district_geo_code: 'BD5585',
    district_name: 'Rangpur',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 442,
    upazila_geo_code: 'BD558592',
    upazila_name: 'Taragonj'
  },
  {
    district_id: 45,
    district_geo_code: 'BD3048',
    district_name: 'Kishoreganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 348,
    upazila_geo_code: 'BD304892',
    upazila_name: 'Tarail'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 474,
    upazila_geo_code: null,
    upazila_name: 'Tarakanda'
  },
  {
    district_id: 12,
    district_geo_code: 'BD5088',
    district_name: 'Sirajganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 111,
    upazila_geo_code: 'BD508889',
    upazila_name: 'Tarash'
  },
  {
    district_id: 34,
    district_geo_code: 'BD1009',
    district_name: 'Bhola',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 264,
    upazila_geo_code: 'BD100991',
    upazila_name: 'Tazumuddin'
  },
  {
    district_id: 9,
    district_geo_code: 'BD2022',
    district_name: 'Coxsbazar',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 87,
    upazila_geo_code: 'BD202290',
    upazila_name: 'Teknaf'
  },
  {
    district_id: 27,
    district_geo_code: 'BD4047',
    district_name: 'Khulna',
    division_geo_code: 'BD40',
    division_id: 3,
    division_name: 'Khulna',
    upazila_id: 210,
    upazila_geo_code: 'BD404794',
    upazila_name: 'Terokhada'
  },
  {
    district_id: 53,
    district_geo_code: 'BD5577',
    district_name: 'Panchagarh',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 403,
    upazila_geo_code: 'BD557790',
    upazila_name: 'Tetulia'
  },
  {
    district_id: 58,
    district_geo_code: 'BD5594',
    district_name: 'Thakurgaon',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 435,
    upazila_geo_code: 'BD559494',
    upazila_name: 'Thakurgaon Sadar'
  },
  {
    district_id: 11,
    district_geo_code: 'BD2003',
    district_name: 'Bandarban',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 103,
    upazila_geo_code: 'BD200395',
    upazila_name: 'Thanchi'
  },
  {
    district_id: 1,
    district_geo_code: 'BD2019',
    district_name: 'Comilla',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 15,
    upazila_geo_code: 'BD201994',
    upazila_name: 'Titas'
  },
  {
    district_id: 48,
    district_geo_code: 'BD3059',
    district_name: 'Munshiganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 375,
    upazila_geo_code: 'BD305994',
    upazila_name: 'Tongibari'
  },
  {
    district_id: 62,
    district_geo_code: 'BD4561',
    district_name: 'Mymensingh',
    division_geo_code: 'BD45',
    division_id: 8,
    division_name: 'Mymensingh',
    upazila_id: 463,
    upazila_geo_code: 'BD456194',
    upazila_name: 'Trishal'
  },
  {
    district_id: 51,
    district_geo_code: 'BD3035',
    district_name: 'Gopalganj',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 387,
    upazila_geo_code: 'BD303591',
    upazila_name: 'Tungipara'
  },
  {
    district_id: 9,
    district_geo_code: 'BD2022',
    district_name: 'Coxsbazar',
    division_geo_code: 'BD20',
    division_id: 1,
    division_name: 'Chattagram',
    upazila_id: 83,
    upazila_geo_code: 'BD202294',
    upazila_name: 'Ukhiya'
  },
  {
    district_id: 60,
    district_geo_code: 'BD5549',
    district_name: 'Kurigram',
    division_geo_code: 'BD55',
    division_id: 7,
    division_name: 'Rangpur',
    upazila_id: 453,
    upazila_geo_code: 'BD554994',
    upazila_name: 'Ulipur'
  },
  {
    district_id: 12,
    district_geo_code: 'BD5088',
    district_name: 'Sirajganj',
    division_geo_code: 'BD50',
    division_id: 2,
    division_name: 'Rajshahi',
    upazila_id: 112,
    upazila_geo_code: 'BD508894',
    upazila_name: 'Ullapara'
  },
  {
    district_id: 33,
    district_geo_code: 'BD1006',
    district_name: 'Barisal',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 252,
    upazila_geo_code: 'BD100694',
    upazila_name: 'Wazirpur'
  },
  {
    district_id: 42,
    district_geo_code: 'BD3086',
    district_name: 'Shariatpur',
    division_geo_code: 'BD30',
    division_id: 6,
    division_name: 'Dhaka',
    upazila_id: 324,
    upazila_geo_code: 'BD308694',
    upazila_name: 'Zajira'
  },
  {
    district_id: 36,
    district_geo_code: 'BD6091',
    district_name: 'Sylhet',
    division_geo_code: 'BD60',
    division_id: 5,
    division_name: 'Sylhet',
    upazila_id: 282,
    upazila_geo_code: 'BD609194',
    upazila_name: 'Zakiganj'
  },
  {
    district_id: 32,
    district_geo_code: 'BD1079',
    district_name: 'Pirojpur',
    division_geo_code: 'BD10',
    division_id: 4,
    division_name: 'Barisal',
    upazila_id: 245,
    upazila_geo_code: 'BD107990',
    upazila_name: 'Zianagar'
  }
];










/*
chart.selectAll('myLegend')
    .data(legends)
    .enter()
    .append('g')
    .append('text')
    .attr('x', (d, i) => 30 + i * 100)
    .attr('y', 30)
    .text((d: LineChartModel) => d.value)
    .style('fill', (d) => getColorFromLabel(d.key))
    .style('font-size', 14)
    .on('click', (e, d) => {
      currentOpacity = +d3.selectAll('.lines').style('opacity');
      // Change the opacity: from 0 to 1 or from 1 to 0
      d3.selectAll('.lines').transition().style('opacity', currentOpacity === 1 ? 0 : 1);
      // Change the opacity: from 0 to 1 of current line
      d3.selectAll('.' + d.key).transition().style('opacity', 1);
    });

*/
