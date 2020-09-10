const {
  sopsCompleted,
  sopsInitiated,
  completedSopsAverageDuration,
  completedSopsForWeekday,
  initiatedSopsForWeekday,
} = mary;

/*     -----                          -----     */
Highcharts.chart("all-sops", {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: "pie",
  },
  title: {
    text: "Completed/Initiated SOPs (All)",
  },
  tooltip: {
    pointFormat: "<b>{point.percentage:.1f}%</b>",
  },
  accessibility: {
    point: {
      valueSuffix: "%",
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.y}",
      },
    },
  },
  series: [
    {
      name: "SOPs",
      colorByPoint: true,
      data: [
        {
          name: "Completed",
          y: sopsCompleted,
          sliced: true,
          selected: true,
        },
        {
          name: "Initiated",
          y: sopsInitiated,
        },
      ],
    },
  ],
});

/*     -----                          -----     */
const avgDurationData = [];
let avgIdx = 0;
for (const sopId in completedSopsAverageDuration) {
  if (completedSopsAverageDuration.hasOwnProperty(sopId)) {
    const milliseconds = completedSopsAverageDuration[sopId];
    const minutes = milliseconds / 1000 / 60;
    // fixme: not the best way to find the title of the SOP by sopId below:
    avgDurationData.push([mary.logStats.sopStats[avgIdx].sopTitle, minutes]);
    avgIdx++;
  }
}

Highcharts.chart("avg-duration", {
  chart: {
    type: "column",
  },
  title: {
    text: "Avg Duration of Completed SOPs",
  },
  xAxis: {
    type: "category",
  },
  yAxis: {
    min: 0,
    title: {
      text: "Minutes",
    },
  },
  legend: {
    enabled: false,
  },
  tooltip: {
    pointFormat: "<b>{point.y:.2f} minutes</b>",
  },
  series: [
    {
      name: "Avg Duration",
      data: avgDurationData,
      dataLabels: {
        enabled: true,
        format: "{point.y:.0f} minutes",
      },
    },
  ],
});

/*     -----                          -----     */
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const completedData = [];
const initiatedData = [];
for (const day of daysOfWeek) {
  const numCompleted = completedSopsForWeekday[day];
  const numInitiated = initiatedSopsForWeekday[day];
  completedData.push(numCompleted ? numCompleted : null);
  initiatedData.push(numInitiated ? numInitiated : null);
}

Highcharts.chart("by-day", {
  chart: {
    type: "column",
  },
  title: {
    text: "Completed/Initiated SOPs by Day",
  },
  xAxis: {
    categories: daysOfWeek,
  },
  yAxis: {
    min: 0,
    title: {
      text: "# of SOPs",
    },
    stackLabels: {
      enabled: true,
      style: {
        fontWeight: "bold",
        color:
          // theme
          (Highcharts.defaultOptions.title.style &&
            Highcharts.defaultOptions.title.style.color) ||
          "gray",
      },
    },
  },
  legend: {
    align: "right",
    x: -30,
    verticalAlign: "top",
    y: 25,
    floating: true,
    backgroundColor:
      Highcharts.defaultOptions.legend.backgroundColor || "white",
    borderColor: "#CCC",
    borderWidth: 1,
    shadow: false,
  },
  tooltip: {
    headerFormat: "<b>{point.x}</b><br/>",
    pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
  },
  plotOptions: {
    column: {
      stacking: "normal",
      dataLabels: {
        enabled: true,
      },
    },
  },
  series: [
    {
      name: "Initiated",
      data: initiatedData,
    },
    {
      name: "Completed",
      data: completedData,
    },
  ],
});
