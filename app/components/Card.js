import React, { Component } from "react";
import { Text } from "react-native";
import { Card } from "react-native-elements";

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data
    };
  }

  render() {
    return (
      <Card
        title={null}
        image={{ url: "https://news.nationalgeographic.com/content/dam/news/photos/000/755/75552.ngsversion.1422285553360.adapt.1900.1.jpg" }}
        containerStyle={{ padding: 0, width: 160 }}
      >
        <Text style={{ marginBottom: 10 }}>
          hello
        </Text>
      </Card>
    );
  }
}