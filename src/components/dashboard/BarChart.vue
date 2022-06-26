<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Bar } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: { Bar },
  props: {
    data: {},
    labels: {},
    chartTitle: {},
    chartId: { type: String, default: "bar-chart" },
    datasetIdKey: { type: String, default: "label" },
    width: { type: Number, default: 400 },
    height: { type: Number, default: 300 },
    cssClasses: { default: "", type: String },
    styles: { type: Object, default: () => {} },
    plugins: { type: Object, default: () => {} },
  },
  created() {
    this.formatData();
  },
  data() {
    return {
      chartData: {
        title: "bla",
        label: "qqq",
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
          {
            data: [40, 20, 102, 17],
            backgroundColor: "green",
            label: "Shekel",
          },
          {
            data: [30, 60, 11, 18],
            backgroundColor: "red",
            label: "Dollar",
          },
        ],
      },
      chartOptions: {
        plugins: {
          title: { display: true, text: this.chartTitle, font: { size: 25 } },
        },
        responsive: true,
      },
    };
  },
  methods: {
    randomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    randomNumberExclude(min, max, exclude) {
      let num = this.randomNumber(min, max);
      while (num in exclude) {
        num = this.randomNumber(min, max);
      }
      return num;
    },
    formatData() {
      this.chartData.labels = this.labels;
      const colorNumbers = [];
      const respData = {};
      for (const [label, valueDict] of Object.entries(this.data)) {
        const indexOfLabel = this.labels.indexOf(label);
        for (const key of Object.keys(valueDict)) {
          if (!respData[key]) {
            let colorNumber = this.randomNumberExclude(
              0,
              this.colors.length - 1,
              colorNumbers
            );
            colorNumbers.push(colorNumber);
            respData[key] = {
              data: Array(this.labels.length).fill(0),
              backgroundColor: this.colors[colorNumber],
              label: key,
            };
          }
          respData[key].data[indexOfLabel] = valueDict[key];
        }
      }
      this.chartData.datasets = Object.values(respData);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>