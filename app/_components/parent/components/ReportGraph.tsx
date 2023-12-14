import React from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Legend,
  LineController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { maxPerLesson, maxPerSet } from "@/@types/srs.model";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const data = {
  labels: [],
  datasets: [],
};

const ReportGraph = ({ reports }: { reports: any }) => {
  const datasets: any = [];

  Object.keys(reports).forEach((subject: any, index: number) => {
    const dataPoints: any = [];
    const dataBars: any = [];
    const lessons = Object.keys(reports[subject]);

    lessons.map((lesson) => {
      reports[subject][lesson].map((attempt: any) => {
        dataPoints.push({
          x: lesson,
          y: attempt.time,
          Tooltip: `Score: ${attempt.correct}/${
            attempt.correct + attempt.incorrect
          } Date: ${new Date(attempt.date)}`,
        });
        dataBars.push({
          x: lesson,
          y: attempt.correct,
          Tooltip: `Score: ${attempt.correct}/${
            attempt.correct + attempt.incorrect
          } Date: ${new Date(attempt.date)}`,
        });
      });
    });

    datasets.push(
      {
        type: "line" as const,
        label: `Time to Complete`,
        data: dataPoints,
        fill: false,
        borderColor: "rgba(0, 128, 255, 1)",
        backgroundColor: "rgba(0, 128, 255, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0, 128, 255, 1)",
        yAxisID: "y",
      },
      {
        type: "bar" as const,
        label: `Results`,
        data: dataBars,
        fill: false,
        backgroundColor: "rgba(0, 128, 0, 0.6)",
        borderColor: "rgba(0, 128, 0, 1)",
        yAxisID: "y2",
      }
    );
  });

  data.datasets = datasets;

  const options = {
    type: "line",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        position: "bottom",
        title: {
          display: true,
          text: "Lesson",
        },
      },
      y: {
        ticks: {
          stepSize: 5,
        },
        grid: {
          display: false,
        },
        beginAtZero: true,
        position: "left",
        title: {
          display: true,
          text: "Time (seconds)",
        },
      },
      y2: {
        ticks: {
          stepSize: 1,
        },
        max: maxPerSet + 1,
        beginAtZero: true,
        position: "right",
        title: {
          display: true,
          text: "Answered Correctly",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Students progress through each subject and lesson",
      },
    },
  };

  return (
    <div>
      <Chart type="bar" data={data} options={options} />
    </div>
  );
};

export default ReportGraph;
