import React from "react";

import Chart from "react-apexcharts";

import { Lottie } from "@crello/react-lottie";
import emptyGraph from "../../assets/animations/emptyGraph.json";

import "./styles.css";

export default function BurndownGraph({
  planned = [],
  complete = [],
  DateRange = [],
  isEmpty = false,
}) {
  const OPTIONS_GRAPH = {
    series: [
      {
        name: "Planejado",
        data: planned,
      },
      {
        name: "Realizado",
        data: complete,
      },
    ],
    options: {
      chart: {
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      markers: {
        size: 5,
      },
      colors: ["#ACB4FF", "#87B36F"],
      title: {
        text: "Tarefas Realizadas",
        align: "left",
        style: {
          fontSize: 20,
          color: "#595959",
          fontFamily: "Roboto",
          fontWeight: "bold",
        },
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: DateRange,
        title: {
          text: "Tempo",
          style: {
            fontSize: 17,
            fontFamily: "Roboto",
            color: "#595959",
            fontWeight: "bold",
          },
        },
        labels: {
          style: {
            fontSize: 14,
            fontFamily: "Roboto",
            color: "#595959",
            fontWeight: "bold",
          },
        },
      },
      yaxis: {
        title: {
          text: "Demanda",
          style: {
            fontSize: 16,
            fontFamily: "Roboto",
            color: "#595959",
            fontWeight: "bold",
          },
        },
        labels: {
          style: {
            fontSize: 14,
            fontFamily: "Roboto",
            color: "#595959",
            fontWeight: "bold",
          },
        },
      },
    },
  };
  
  return (
    <div className="burndown-area">
      <div className="burndown-graph">
        {isEmpty ? 
        <Lottie
        width={800}
        height={300}
        style={ {margin: '30px'} }
        speed={.8}
        config={{
          animationData: emptyGraph,
          loop: false,
          autoplay: true,
        }}
      />  
      : 
        <Chart
          options={OPTIONS_GRAPH.options}
          series={OPTIONS_GRAPH.series}
          type="line"
          height={280}
          width={1024}  
        />
      }
      </div>
    </div>
  );
}
