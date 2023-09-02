/* eslint-disable prefer-const */
/* eslint-disable max-len */
import { Legend } from 'src/app/utils/models';
import { circleRadius, getColorFromLabel, lineCircleTransition } from './../../utils/utility';
/* eslint-disable space-before-function-paren */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import * as d3 from 'd3';

function radialChart(width = 378, height, legendHeight = 200, graphTitle: Legend) {
   if (width === 0) { width = 378; }


   let margin = { top: 20, left: 20, bottom: 20, right: 20 };
   let textSize = 14;
   let arcPadding = 15;
   let colors = d3.scaleLinear(d3.schemeTableau10);
   let backgroundArcColor = '#f7f7f7';
   let lineColor = '#c7c7c7';
   let arcWidth;
   let chartRadius;

   let data = null;
   let pointValue = (point) => point.value;
   let pointKey = (point) => point.key;

   let max;
   let cornerRadius = 0;

   let svg; let canvas; let tooltip;
   let arc;
   let scale;

   const PI = Math.PI;
   const arcMinRadius = 20;

   function chart(selection) {

      selection.each(function () {
         svg = d3.select(this)
            .append('svg')
            .attr('width', '100%')
            .attr('height', height + legendHeight);


         canvas = svg.append('g')
            .attr('class', graphTitle.key)
            .attr('width', width)
            .attr('height', height)
            .attr('transform', `translate(${width / 2}, ${height / 2})`);


         tooltip = d3.select(this)
            .append('div')
            .attr('class', 'tooltip');

         if (!max) {
            max = getMaxDataValue();
         }

         scale = d3.scaleLinear()
            .domain([0, max])
            .range([0, 2 * PI]);

         arc = d3.arc()
            .innerRadius((d, i) => getInnerRadius(i))
            .outerRadius((d, i) => getOuterRadius(i))
            .startAngle(0)
            .cornerRadius(cornerRadius)
            .endAngle((d) => scale(d));

         chartRadius = calculateChartRadius();
         arcWidth = (chartRadius - data.length * arcPadding) / data.length;
         draw();
      });
   }

   // #region Chart drawing

   function draw() {
      drawBackgroundArcs();
      drawDataArcs();
      drawLines();
      drawLabels();
   }

   function drawBackgroundArcs() {
      const backgroundArcs = canvas.append('g')
         .attr('class', 'background-arc')
         .selectAll('path')
         .data(getBackgroundArcsData())
         .enter()
         .append('path')
         .attr('class', 'background-arc')
         .style('fill', (d) => getColorFromLabel(d.key) + '10');

      backgroundArcs.transition()
         .delay((d, i) => i * 200)
         .duration(1000)
         .attrTween('d', arcTween);

   }

   function drawDataArcs() {
      const dataArcs = canvas.append('g')
         .selectAll('path')
         .data(data)
         .enter()
         .append('path')
         .attr('class', 'arc')
         .attr('data-key', function (d) { return pointKey(d); })
         .style('fill', (d) => getColorFromLabel(pointKey(d)));


      dataArcs
         .on('mouseover', (event, d) => highlight(d))
         .on('mouseleave', function () {
            // d3.select('.' + graphTitle.key).selectAll('.arc').attr('opacity', 1);
            // d3.select('.' + graphTitle.key).selectAll(`.labels`).selectAll(`text`).attr('opacity', 1);
            // d3.select('.' + graphTitle.key).selectAll(`.lines`).selectAll('line').attr('opacity', 1);
            tooltip
               .transition()
               .duration(lineCircleTransition)
               .style('visibility', 'hidden');

         });

      dataArcs.transition()
         .delay((d, i) => i * 200)
         .duration(1000)
         .attrTween('d', arcTween);

      // const text = svg.append('text')
      //    .attr('x', 6)
      //    .attr('dy', 15);

      // text.append('textPath')
      //    .attr('xlink:href', '#yourPathId')
      //    .text('My counter text');

   }

   function drawLines() {
      const lines = canvas.select('.background-arc').append('g')
         .attr('class', 'lines')
         .attr('transform', `translate(${(-width / 2)}, ${(-chartRadius)}  )`);
      //.attr('transform', `translate(${(-width / 2)}, ${(-height / 2.3)}  )`);

      for (let i = 0; i < data.length; ++i) {
         const startX = width / 2.5 - chartRadius;
         let startY = ((i + 1) * (arcWidth + arcPadding) / 2 - (arcWidth + arcPadding)) - ((data.length - i) * 5);
         const endX = width / 2;
         const endY = startY;
         const radius = 3;
         const color = getColorFromLabel(pointKey(data[i]));

         lines
            .append('line')
            .attr('x1', startX)
            .attr('y1', startY)
            .attr('x2', endX)
            .attr('y2', endY)
            .attr('data-key', pointKey(data[i]))
            .style('stroke-width', 2)
            .style('stroke', color);


         lines
            .append('circle')
            .attr('cx', startX)
            .attr('cy', startY)
            .attr('r', radius)
            .style('fill', color);

         lines
            .append('circle')
            .attr('cx', endX - radius)
            .attr('cy', endY)
            .attr('r', radius)
            .style('fill', color);

         // lines
         //    .append('line')
         //    .attr('x1', startX - 25)
         //    .attr('y1', startY - 7)
         //    .attr('x2', startX)
         //    .attr('y2', startY - 7)
         //    .style('stroke-width', 1)
         //    .style('stroke', color);

         // lines
         //    .append('line')
         //    .attr('x1', startX - 25)
         //    .attr('y1', startY + 7)
         //    .attr('x2', startX)
         //    .attr('y2', startY + 7)
         //    .style('stroke-width', 1)
         //    .style('stroke', color);

         // lines
         //    .append('line')
         //    .attr('x1', startX)
         //    .attr('y1', startY - 7)
         //    .attr('x2', startX)
         //    .attr('y2', startY + 7)
         //    .style('stroke-width', 1)
         //    .style('stroke', color);
      }


   }

   function drawLabels() {
      const labels = canvas.append('g')
         .attr('class', 'labels')
         .attr('transform', `translate(${-width / 2}, ${(-chartRadius)})`);

      const center = canvas.append('g')
         .attr('class', 'center')
         .attr('transform', `translate(${-width / 2}, ${(-height / 2)})`);

      for (let i = 0; i < data.length; ++i) {
         const point = data[i];
         const startX = width / 2.5 - chartRadius;
         let startY = ((i + 1) * (arcWidth + arcPadding) / 2 - (arcWidth + arcPadding)) - ((data.length - i) * 5);

         const label = 'label-' + i;
         const text = pointValue(point) + '%';
         const labelSize = getTextSize(text);

         labels
            .append('text')
            .attr('class', label)
            .attr('x', startX - labelSize.width - 5)
            .attr('y', startY + textSize / 2)
            .attr('data-key', function () {
               return pointKey(point);
            })
            .text(function () {
               return text;
            })
            .style('font-size', textSize)
            .style('font-family', 'Arial')
            .style('font-weight', 'bold')
            .style('fill', getColorFromLabel(pointKey(point)));
         if (i + 1 === data.length) {
            const textSize = getTextSize(graphTitle.value);
            center.append('g').append('foreignObject')
               .attr('x', width / 2 - textSize.width / 2 - 5)
               .attr('y', height / 2 - (circleRadius + arcWidth + arcPadding) - margin.top)
               .attr('width', textSize.width)
               .attr('height', textSize.height * 2)
               .attr('class', 'text-portion')
               .append('xhtml:body')
               .html(`${graphTitle.value}`);

            center.append('image')
               .attr('xlink:href', `../../assets/icon/${graphTitle.key}.svg`)
               .attr('width', 50)
               .attr('height', 50)
               .attr('x', width / 2 - 25)
               .attr('y', height / 2 - (circleRadius + arcWidth + arcPadding) + textSize.height * 2);
         }
      }

   }

   // #endregion

   // #region Helper functions

   function calculateChartRadius() {
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      if (chartWidth < chartHeight) {
         return width / 2.5 - margin.left - margin.right;
      } else {
         return height / 2.5 - margin.top - margin.bottom;
      }
   }

   function getBackgroundArcsData() {
      const backgroundArcsData = [];
      for (let i = 0; i < data.length; ++i) {
         backgroundArcsData.push({
            value: max,
            key: pointKey(data[i])
         });
      }

      return backgroundArcsData;
   }

   function getMaxDataValue() {
      let max = 0;
      for (let i = 0; i < data.length; ++i) {
         const current = data[i];
         const currentValue = pointValue(current);
         if (currentValue > max) {
            max = currentValue;
         }

         return max;
      }
   }

   function arcTween(d, i) {
      const interpolate = d3.interpolate(0, pointValue(d));
      return t => arc(interpolate(t), i);
   }

   function getInnerRadius(index) {
      return arcMinRadius + (data.length - (index * .75)) * (arcWidth + arcPadding);
   }

   function getOuterRadius(index) {
      return getInnerRadius(index) + arcWidth + 5;
   }

   function getRandomColorPalette(length) {
      const palette = [];
      //random color palette
      const letters = '0123456789ABCDEF';
      for (let i = 0; i < length; ++i) {
         let color = '#';
         for (let j = 0; j < 6; ++j) {
            color += letters[Math.floor(Math.random() * 16)];
         }
         palette.push(color);
      }
      return palette;
   }

   function highlight(d) {

      // d3.select('.' + graphTitle.key).selectAll('.arc').attr('opacity', 0);
      // d3.select('.' + graphTitle.key).selectAll(`.arc[data-key='${pointKey(d)}']`).attr('opacity', 1);

      // d3.select('.' + graphTitle.key).selectAll(`.labels`).selectAll(`text`).attr('opacity', 0);
      // d3.select('.' + graphTitle.key).selectAll(`.labels`).selectAll(`text[data-key='${pointKey(d)}']`).attr('opacity', 1);
      // d3.select('.' + graphTitle.key).selectAll(`.lines`).selectAll('line').attr('opacity', 0);
      // d3.select('.' + graphTitle.key).selectAll(`.lines`).selectAll(`line[data-key='${pointKey(d)}']`).attr('opacity', 1);

      tooltip
         .style('background-color', getColorFromLabel(d.key))
         .transition()
         .duration(lineCircleTransition)
         .style('visibility', 'visible')
         .text(`${d.key} ${d.value}%`)
         .style('top', (10) + 'px')
         .style('left', (10) + 'px');

   }

   function getTextSize(text) {
      const container = d3.select('body').append('svg');
      container.append('text').text(text).style('font-size', textSize).style('font-family', 'Arial');
      const size = container.node().getBBox();
      container.remove();
      return size;
   }

   function getLongestLabelSize() {
      let longest = 0;
      for (let i = 0; i < data.length; ++i) {
         const point = data[i];
         const label = pointKey(point);
         const width = getTextSize(label).width;
         if (width > longest) {
            longest = width;
         }
      }

      return longest;
   }

   // #endregion

   // #region Getters and Setters

   chart.width = function (value) {
      if (!arguments.length) {
         return width;
      }
      width = value;
      return chart;
   };

   chart.height = function (value) {
      if (!arguments.length) {
         return height;
      }
      height = value;

      return chart;
   };

   chart.margin = function (value) {
      if (!arguments.length) {
         return margin;
      }
      margin = value;

      return chart;
   };

   chart.textSize = function (value) {
      if (!arguments.length) {
         return textSize;
      }
      textSize = value;

      return chart;
   };

   chart.arcPadding = function (value) {
      if (!arguments.length) {
         return arcPadding;
      }
      arcPadding = value;

      return chart;
   };

   chart.colors = function (value) {
      if (!arguments.length) {
         return colors;
      }
      colors = value;

      return chart;
   };

   chart.backgroundArcColor = function (value) {
      if (!arguments.length) {
         return backgroundArcColor;
      }
      backgroundArcColor = value;

      return chart;
   };

   chart.lineColor = function (value) {
      if (!arguments.length) {
         return lineColor;
      }
      lineColor = value;

      return chart;
   };

   chart.data = function (value) {
      if (!arguments.length) {
         return data;
      }
      data = value;

      return chart;
   };

   chart.pointValue = function (value) {
      if (!arguments.length) {
         return pointValue;
      }
      pointValue = value;

      return chart;
   };

   chart.pointKey = function (value) {
      if (!arguments.length) {
         return pointKey;
      }
      pointKey = value;

      return chart;
   };

   chart.max = function (value) {
      if (!arguments.length) {
         return max;
      }
      max = value;

      return chart;
   };

   chart.cornerRadius = function (value) {
      if (!arguments.length) {
         return cornerRadius;
      }
      cornerRadius = value;

      return chart;
   };


   // #endregion

   return chart;
}

export { radialChart as default };

