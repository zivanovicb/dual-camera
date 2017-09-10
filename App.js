import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image
} from "react-native";
import { Camera, Permissions } from "expo";

export default class App extends React.Component {
  state = {
    topPicture: null,
    bottomPicture: null,
    captured: false
  };
  capture = (topPicture, bottomPicture) => {
    console.log("captured brrr");
    this.setState({ captured: true, topPicture, bottomPicture });
  };
  componentDidUpdate() {
    console.log("app se updateovala", this.state);
  }
  render() {
    const { captured } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Image
            style={{ width: "100%", height: "50%" }}
            source={{ uri: this.state.topPicture }}
          />
          <Image
            style={{ width: "100%", height: "50%" }}
            source={{ uri: this.state.bottomPicture }}
          />
        </View>
        {this.state.captured
          ? <Text>Slikano</Text>
          : <Cameras onFinished={this.capture} />}
      </View>
    );
  }
}

class Cameras extends React.Component {
  state = {
    hasCameraPermission: null,
    topType: Camera.Constants.Type.front,
    bottomType: Camera.Constants.Type.back,
    topPicture: null,
    bottomPicture: null
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  snap = () => {
    this.topCamera.takePictureAsync().then(res => {
      console.log("sikam gore");
      this.setState({ topPicture: res });
    });
    this.bottomCamera.takePictureAsync().then(res => {
      console.log("slikam dole");
      this.setState({
        bottomPicture: res
      });
    });
  };

  componentDidUpdate() {
    const { bottomPicture, topPicture } = this.state;
    if (topPicture && bottomPicture) {
      console.log("finished");
      this.props.onFinished(topPicture, bottomPicture);
    }
  }

  render() {
    console.log("Kamere renderovane");
    setTimeout(() => {
      console.log("gornja ", this.topCamera, "donja ", this.bottomCamera);
    }, 5000);
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={ref => (this.topCamera = ref)}
            style={{ flex: 1 }}
            type={this.state.topType}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: "flex-end",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                >
                  {" "}Flip{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>

          <Camera
            ref={ref => (this.bottomCamera = ref)}
            style={{ flex: 1 }}
            type={this.state.bottomType}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: "flex-end",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: "white" }}
                >
                  {" "}Flip{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
          <Button
            onPress={this.snap}
            title="SLIKAJ"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
