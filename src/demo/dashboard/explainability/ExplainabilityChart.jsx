import React from "react";
import * as d3 from "d3";

export default class ExplainabilityChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            productData: this.props.productData
        }
    }

    componentDidMount() {
        this.renderChart()
        let containerSVG = document.querySelector("svg g:first-of-type")
        containerSVG.setAttribute("fill", "#f6f6f6")
        let firstnodeSVG = containerSVG.querySelector("g circle")
        firstnodeSVG.setAttribute("fill", "#f6f6f6")
        document.querySelectorAll("text").forEach(txt => {
            txt.style.fontSize = "10px"
            txt.style.fontWeight = "bold"
        })
    }

    componentDidUpdate() {
        let containerSVG = document.querySelector("svg g:first-of-type")
        containerSVG.style.width = document.getElementById("explainationChartDiv").offsetWidth;
        let firstnodeSVG = containerSVG.querySelector("g circle")
        firstnodeSVG.style.width = document.getElementById("explainationChartDiv").offsetWidth;
    }

    renderChart() {
        const { productData } = this.state;

        let height = 1000;
        let width = document.getElementById("explainationChartDiv").offsetWidth;

        const parent = this

        const svg = d3.select(this.refs.explainationChart).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])

        var packLayout = d3.pack()
            .size([width, height / 1.4])
            .padding(5);

        var rootNode = d3.hierarchy(productData)

        rootNode.sum(d => d.value);

        packLayout(rootNode);

        svg.append("g");

        var nodes = d3.select('svg g')
            .selectAll('g')
            .style('max-width', d => `${d.data.percentage * 2}px`)
            .data(rootNode.descendants())
            .enter()
            .append('g')
            .attr('transform', (d) => 'translate(' + [d.x, d.y] + ')')

        nodes
            .append('circle')
            .attr("data-name", (d, i) => {
                return d.data.name
            })
            .attr('data-id', (d, i) => {
                return i
            })
            .attr('r', (d, i) => {
                return d.r
            })
            .on('click', onSelect)
            .attr("fill", d => d.data.name.includes("Positive") ? "#7AE23C" : "#F19194")

        nodes
            .append('text')
            .attr('dy', 4)
            .style('text-anchor', "middle")
            .text(d => d.children === undefined ? d.data.name.replace("Positive Product ", "").replace("Negative Product ", "").replace("Neutral Product ", "") : '')

        nodes.selectAll('text').attr("fill", "black")

        function onSelect() {
            if (!parent.props.disableClick) {
                if (this.dataset.id > 0) {
                    for (const node of nodes._groups[0]) {
                        let childCircle = node.children[0]
                        if (childCircle.dataset.id === this.dataset.id) {
                            let nodeCircle = d3.select(this)
                            nodeCircle.attr('stroke', '#8a8a8a');
                            nodeCircle.attr('stroke-width', '3');
                            node.setAttribute('style', 'opacity: 1');
                            parent.props.getInsightData(this.dataset)
                        } else {
                            childCircle.setAttribute('stroke', 'transparent');
                            childCircle.setAttribute('stroke-width', '0');
                            node.setAttribute('style', 'opacity: 0.3');
                        }
                    }
                }
            }
        }

        return svg.node();
    }

    render() {
        return (
            <div>
                <div id="explainationChartDiv" ref="explainationChart" className=""></div>
            </div>
        )
    }
}
