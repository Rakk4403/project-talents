import React from "react";
import PropTypes from "prop-types";
import * as d3 from 'd3';


// origin from https://codepen.io/Jackfiallos/pen/jLWrjb
class BubbleChart extends React.Component {
  constructor(props) {
    super(props);

    this.minValue = 1;
    this.maxValue = 100;
    this.mounted = false;

    this.state = {
      data: []
    };

    this.radiusScale = this.radiusScale.bind(this);
    this.simulatePositions = this.simulatePositions.bind(this);
    this.renderBubbles = this.renderBubbles.bind(this);

    this.ref = React.createRef();
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentDidMount() {
    if (this.props.data.length > 0) {
      this.minValue =
        0.95 *
        d3.min(this.props.data, item => {
          return item.v;
        });

      this.maxValue =
        1.05 *
        d3.max(this.props.data, item => {
          return item.v;
        });

      this.simulatePositions(this.props.data);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data !== this.props.data) {
      this.minValue =
        0.95 *
        d3.min(this.props.data, item => {
          return item.v;
        });

      this.maxValue =
        1.05 *
        d3.max(this.props.data, item => {
          return item.v;
        });

      this.simulatePositions(this.props.data);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  radiusScale = value => {
    return 10 + value * 5;
  };

  simulatePositions = data => {
    this.simulation = d3
      .forceSimulation()
      .nodes(data)
      .velocityDecay(0.5)
      .force("x", d3.forceX().strength(0.05))
      .force("y", d3.forceY().strength(0.05))
      .force(
        "collide",
        d3.forceCollide(d => {
          return this.radiusScale(d.v) + 2;
        })
      )
      .on("tick", () => {
        if (this.mounted) {
          this.setState({data});
        }
      });
  };

  renderBubbles = data => {
    const minValue =
      0.95 *
      d3.min(data, item => {
        return item.v;
      });

    const maxValue =
      1.05 *
      d3.max(data, item => {
        return item.v;
      });

    const color = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .interpolate(d3.interpolateHcl)
      .range(["#eb001b", "#f79e1b"]);

    // render simple circle element
    if (!this.props.useLabels) {
      const circles = data.map((item, index) => {
        return (
          <circle
            key={index}
            r={this.radiusScale(item.v)}
            cx={item.x}
            cy={item.y}
            fill={color(item.v)}
            stroke={d3.rgb(color(item.v)).brighter(2)}
            strokeWidth="2"
          />
        );
      });

      return (
        <g
          transform={`translate(${(this.ref.current ? this.ref.current.offsetWidth : 0) / 2}, ${(this.ref.current ? this.ref.current.offsetHeight : 0) / 2})`}
        >
          {circles}
        </g>
      );
    }

    // render circle and text elements inside a group
    return data.map((item, index) => {
      const fontSize = this.radiusScale(item.v) / 2;
      const width = (this.ref.current ? this.ref.current.offsetWidth : 0);
      const height = (this.ref.current ? this.ref.current.offsetHeight : 0);
      return (
        <g
          key={index}
          transform={`translate(${width / 2 +
          item.x}, ${height / 2 + item.y})`}
        >
          <circle
            r={this.radiusScale(item.v)}
            fill={color(item.v)}
            stroke={d3.rgb(color(item.v)).brighter(2)}
            strokeWidth="2"
          />
          <text
            dy="6"
            fill="#fff"
            textAnchor="middle"
            fontSize={`${fontSize}px`}
            fontWeight="bold"
          >
            {item.title}
          </text>
        </g>
      );
    });
  };

  render() {
    if (this.state.data.length) {
      return (
        <div ref={this.ref}>
          <svg width={this.props.width} height={this.props.height}>
            {this.renderBubbles(this.state.data)}
          </svg>
        </div>
      );
    }

    return <div>Loading</div>;
  }
}

BubbleChart.propTypes = {
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  useLabels: PropTypes.bool
};

BubbleChart.defaultProps = {
  data: [],
  useLabels: false,
  width: '100%',
  height: '100%',
};

export default BubbleChart;