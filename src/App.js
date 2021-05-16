import React, { Component } from "react";
const compareImages = require("resemblejs/compareImages");
import "./App.css";

const imagesPath = "../cypress/screenshots/test.spec.js";
const optionsResemble = {
  output: {
    errorColor: {
      red: 0,
      green: 255,
      blue: 0,
    },
    errorType: "movement",
    largeImageThreshold: 1200,
    useCrossOrigin: false,
    outputDiff: true,
  },
  scaleToSameSize: true,
  ignore: "antialiasing",
};

const testQty = 3

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { listImages: [], images: null };
  }

  importAll(r) {
    return r.keys().map((r) => {
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
    console.log(listOfImages)
    this.setState({ listImages: listOfImages });
  }

  async compareImages(img1, img2) {
    try {
      const data = await compareImages(img1, img2, optionsResemble);
      return data;
    } catch (e) {
      console.log(e);
    }
  }

  async generateReport(listImages) {
    const components = [];
    for (let i = 0; i < testQty; i++) {
      const couple = [];
      listImages.forEach((imgRoute) => {
        if (imgRoute.indexOf(`image-${i + 1}`) > -1) {
          couple.push(imgRoute);
        }
      });

      if (couple.length > 0) {
        let data = await this.compareImages(
          couple[0].slice(1),
          couple[1].slice(1)
        );
        components.push({
          image: couple[0].slice(1),
          base: couple[0].slice(1),
          compared: data.getImageDataUrl(),
          date: couple[0].slice(1).split("/")[1],
          data: {
            ...data,
          },
        });
        /*  components.push(
          <div className={"row-container"} key={i}>
            <img src={couple[0].slice(1)} />
            <img src={couple[1].slice(1)} />
          </div>
        ); */
      }
    }
    this.setState({ images: components });
  }

  renderImages(images) {
    return images.map((setOfImages, index) => {
      return (
        <div className={"row-container"} key={index}>
          <div className="date-container">
            <p className="date-result">{setOfImages.date}</p>
          </div>
          <div className="image-container">
            <img className="image-result" src={setOfImages.base} />
          </div>
          <div className="image-container">
            <img className="image-result" src={setOfImages.image} />
          </div>
          <div className="image-container">
            <img className="image-result" src={setOfImages.compared} />
          </div>
          <div className="data-container">
            <p className="data-result">
              Is Same Dimension: {setOfImages.data.isSameDimensions + ""}
            </p>
            <p className="data-result">
              Mismatch Percentage: {setOfImages.data.misMatchPercentage + ""}
            </p>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.generateReport(this.state.listImages)}>
          Generar Reporte
        </button>
        <div className="headers-container">
          <p>Date</p>
          <p>Image Base</p>
          <p>Current Image</p>
          <p>Resemble JS Comparison</p>
          <p>Resemble JS Data</p>
        </div>
        <div className="report-container">
          {this.state.images && this.renderImages(this.state.images)}
        </div>
      </div>
    );
  }
}

export default App;
