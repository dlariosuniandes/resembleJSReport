import React, { Component } from "react";
const compareImages =  require("resemblejs/compareImages")
import "./App.css";

const imagesPath = "../cypress/screenshots/test.spec.js";
const optionsResemble = {
    output: {
        errorColor: {
            red: 0,
            green: 255,
            blue: 0
        },
        errorType: "movement",
        largeImageThreshold: 1200,
        useCrossOrigin: false,
        outputDiff: true
    },
    scaleToSameSize: true,
    ignore: "antialiasing"
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { listImages: [], reportFlag: false };
  }

  importAll(r) {
    return r.keys().map((r) => {
      console.log(r);
      return r;
    });
  }
  componentDidMount() {
    const listOfImages = this.importAll(
      require.context(
        "../cypress/screenshots/test.spec.js",
        true,
        /\.(png|jpe?g|svg)$/
      )
    );
    this.setState({ listImages: listOfImages });
  }

  async generateReport(listImages) {
    const components = [];
    for (let i = 0; i < listImages.length; i++) {
      const couple = [];
      listImages.forEach((imgRoute) => {
        if (imgRoute.indexOf(`image-${i + 1}`) > -1) {
          couple.push(imgRoute);
        }
      });
      const data = await compareImages(
        imagesPath + couple[0].slice(1),
        imagesPath + couple[0].slice(0),
        optionsResemble
      );
      if (couple.length > 0) {
        components.push(
          <div className={"row-container"} key={i}>
            <img src={couple[0].slice(1)} />
            <img src={couple[0].slice(0)} />
          </div>
        );
      }
    }
    return components;
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.setState({ reportFlag: true })}>
          {" "}
          Generar Reporte
        </button>
        <div className="report-container">
          {this.state.reportFlag
            ? this.generateReport(this.state.listImages)
            : null}
        </div>
      </div>
    );
  }
}

export default App;
