const { phaseStats } = mary.logStats.sopStats[0];

for (let i = 0; i < phaseStats.length; i++) {
  const { stepStats } = phaseStats[i];

  /*     -----                          -----     */
  const durationByStep = [];
  for (const step of stepStats) {
    const seconds = step.timeSpentMillis / 1000;
    durationByStep.push([`Step ${step.stepPosition}`, seconds]);
  }

  Highcharts.chart(`phase-${i + 1}-duration`, {
    chart: {
      type: "column",
    },
    title: {
      text: "Time Spent by Step",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Time Spent (seconds)",
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      headerFormat: "<b>Step {point.x}</b><br/>",
      pointFormat: "<b>{point.y:.2f} seconds</b>",
    },
    series: [
      {
        name: "Avg Duration",
        data: durationByStep,
        dataLabels: {
          enabled: true,
          format: "{point.y:.0f} s",
        },
      },
    ],
  });

  /*     -----                          -----     */
  const numSteps = [];
  let stepNum = 0;

  const stepBackData = [];
  const stepNextData = [];
  const sopCloseData = [];

  for (const step of stepStats) {
    numSteps.push(`Step ${stepNum}`);
    stepNum++;

    const { userActionStats } = step;
    const stepBackCount = userActionStats.StepBack;
    const stepNextCount = userActionStats.StepNext;
    const sopCloseCount = userActionStats.SopClose;

    stepBackData.push(stepBackCount ? stepBackCount : null);
    stepNextData.push(stepNextCount ? stepNextCount : null);
    sopCloseData.push(sopCloseCount ? sopCloseCount : null);
  }

  Highcharts.chart(`phase-${i + 1}-user-actions`, {
    chart: {
      type: "column",
    },
    title: {
      text: "User Actions by Step",
    },
    xAxis: {
      categories: numSteps,
    },
    yAxis: {
      min: 0,
      title: {
        text: "# of Actions",
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
        name: "Step Back",
        data: stepBackData,
      },
      {
        name: "Step Next",
        data: stepNextData,
      },
      {
        name: "SOP Close",
        data: sopCloseData,
      },
    ],
  });
}
