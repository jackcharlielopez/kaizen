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
import { maxPerLesson, maxPerSet, subjectEnum } from "@/@types/srs.model";

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

const data1 = {
  labels: [],
  datasets: [],
};

const data2 = {
  labels: [],
  datasets: [],
};

const legend = {
  display: true,
  position: "top",
  labels: {
    generateLabels: () => {
      return Object.keys(subjectEnum).map((subject, index) => {
        return {
          text:
            subject.charAt(0).toUpperCase() + subject.substr(1).toLowerCase(),
          fillStyle: colors[index],
          hidden: false,
          lineCap: "butt",
          strokeStyle: colors[index],
          lineWidth: 1,
        };
      });
    },
  },
};

const tooltip = {
  enabled: true,
  intersect: false,
  callbacks: {
    title: (context: { raw: { title: any } }[]) => {
      return context[0].raw.title;
    },
    label: (context: { raw: { label: any } }) => {
      return context.raw.label;
    },
  },
};

const colors = ["#3498db", "#9b59b6", "#2ecc71", "#e67e22"];

const ReportGraph = ({ reports }: { reports: any }) => {
  const datasets1: any = [];
  const datasets2: any = [];

  Object.values(subjectEnum).forEach((subject: any, i: number) => {
    const dataBars: any = [];
    const dataPoints: any = [];

    if (!reports[subject]) return;

    const lessons = Object.keys(reports[subject]);

    lessons.map((lesson) => {
      const attemptLength = reports[subject][lesson].length;
      let attemptsCombinedScore = 0;
      let attemptsCombinedTime = 0;
      reports[subject][lesson].map(
        (attempt: { correct: number; time: number }, index: number) => {
          attemptsCombinedScore += attempt.correct;
          attemptsCombinedTime += attempt.time;

          if (index + 1 < attemptLength) return;

          dataBars.push({
            x: lesson,
            y: attemptLength,
            title: `Total Attempts for ${subject}${lesson}: ${attemptLength}`,
            label: `Average Score: ${Math.round(
              attemptsCombinedScore / attemptLength
            )}`,
          });

          dataPoints.push({
            x: lesson,
            y: Math.round(attemptsCombinedTime / attemptLength),
            title: `Average Time per Lesson: ${Math.round(
              attemptsCombinedTime / attemptLength
            )}`,
          });
        }
      );
    });

    datasets1.push({
      type: "bar" as const,
      data: dataBars,
      fill: false,
      backgroundColor: colors[i] + 75,
      borderColor: colors[i],
    });

    datasets2.push({
      type: "line" as const,
      data: dataPoints,
      fill: false,
      backgroundColor: colors[i] + 75,
      borderColor: colors[i],
    });
  });

  data1.datasets = datasets1;
  data2.datasets = datasets2;

  const options1 = {
    type: "bar",
    responsive: true,
    maintainAspectRatio: true,
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
          stepSize: 1,
        },
        beginAtZero: true,
        position: "left",
        title: {
          display: true,
          text: "Quiz Attempts",
        },
      },
    },
    plugins: {
      legend,
      tooltip,
      title: {
        display: true,
        text: "Students progress through each subject and lesson",
      },
    },
  };

  const options2 = {
    type: "line",
    responsive: true,
    maintainAspectRatio: true,
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
          stepSize: 1,
        },
        beginAtZero: true,
        position: "left",
        title: {
          display: true,
          text: "Average Time to Pass",
        },
      },
    },
    plugins: {
      legend,
      tooltip,
      title: {
        display: true,
        text: "Students progress through each subject and lesson",
      },
    },
  };

  return (
    <div>
      <Chart type="bar" data={data1} options={options1} />
      <Chart type="line" data={data2} options={options2} />
    </div>
  );
};

export default ReportGraph;
