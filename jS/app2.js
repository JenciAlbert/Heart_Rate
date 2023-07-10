"use strict";

import { readHeartRateFromDatabase } from "./firebase.js";

let chartDom = document.getElementById("main");
let myChart = echarts.init(chartDom);

readHeartRateFromDatabase()
  .then((data) => {
    const heartRates2 = data.map((item) => item.heartRate);
    const filteredHeartRates = heartRates2.filter((hr) => hr !== 0);
    const label = data.map((item) => item.timestamp);

    let option = {
      title: {
        text: "Heart Rate Data",
        textStyle: {
          fontSize: 40, // Adjust the font size as desired
        },
      },

      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Heart Rates", "SPM"],
        textStyle: {
          fontSize: 40, // Adjust the font size as desired
        },
      },
      grid: {
        left: "15%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: label,
        show: "true",
      },
      yAxis: {
        type: "value",
        show: "true",
      },
      series: [
        {
          name: "Heart Rates",
          type: "line",
          data: filteredHeartRates,
          lineStyle: {
            width: 3,
            // color: "red",
          },
          symbol: "circle", // Adjust the symbol type as desired
          symbolSize: 10,
        },
        {
          name: "SPM",
          type: "line",
          data: [
            100, 25, 87, 90, 0, 172, 191, 53, 49, 11, 0, 0, 0, 0, 0, 34, 76, 98,
            97, 89, 144, 123, 200, 165, 168, 180, 130, 100, 87, 32, 21, 0, 0, 0,
            45, 56, 78, 180, 130, 100, 87, 32, 21, 83, 66, 43, 82, 130, 166,
            188, 232, 222, 208, 198, 199, 91, 94, 153, 103, 167, 79, 25, 121,
            32, 95, 144, 63, 190, 92, 22, 169, 5, 67, 86, 61, 7, 182, 127, 76,
            89, 37, 11, 1, 139, 159, 4, 2, 14, 100, 25, 87, 90, 0, 172, 191, 53,
            49, 11, 159, 4, 2, 14, 100, 25, 87, 32, 95, 144, 63, 190, 92, 22,
            169, 5, 67, 86, 61, 7, 182, 127, 76, 89, 37, 11, 1, 139, 159, 4, 2,
            14, 100, 25, 87, 90, 0, 172, 191, 53, 49, 11, 159, 4, 2, 14, 100,
            25, 87, 32, 95, 144, 63, 190, 92, 22, 169, 5, 67, 86, 61, 7, 182,
            127, 76, 89, 37, 11, 1, 139, 159, 4, 2, 14, 100, 25, 87, 90, 0, 172,
            191, 53, 49, 11, 159, 4, 2, 14, 100, 25, 87, 32, 95, 144, 63, 190,
            92, 22, 169, 5, 67, 86, 61, 7, 182, 127, 76, 89, 37, 11, 1, 139,
            159, 4, 2, 14, 100, 25, 87, 90, 0, 172, 191, 53, 49, 11, 159, 4, 2,
            14, 100, 25, 87,
          ],
          lineStyle: {
            width: 3,
          },
          symbol: "circle", // Adjust the symbol type as desired
          symbolSize: 10,
        },
      ],
    };

    option && myChart.setOption(option);
  })
  .catch((error) => {
    console.log(error);
  });
