import React, { PureComponent } from 'react'

// @ts-ignore
const dataToPoints = ({ data, limit, width = 1, height = 1, margin = 0, max = Math.max.apply(Math, data), min = Math.min.apply(Math, data) }) => {
    const len = data.length;

    if (limit && limit < len) {
        data = data.slice(len - limit);
    }

    const vfactor = (height - margin * 2) / ((max - min) || 2);
    const hfactor = (width - margin * 2) / ((limit || len) - (len > 1 ? 1 : 0));

    // @ts-ignore
    return data.map((d, i) => ({
        x: i * hfactor + margin,
        y: (max === min ? 1 : (max - d)) * vfactor + margin
    }));
};

interface Props {
  data: any[],
    limit?: number,
    width: number,
    height: number,
    svgWidth?: number,
    svgHeight?: number,
    preserveAspectRatio: string,
    margin: number,
    style?: object,
    min?: number,
    max?: number,
    onMouseMove?: any
}

interface State {
}


class SparklinesColor extends PureComponent<Props, State> {

    render() {
        const {  data, limit, width, height, svgWidth, svgHeight, preserveAspectRatio, margin, style, max, min} = this.props;

        if (data.length === 0) return null;

        const points = dataToPoints({ data, limit, width, height, margin, max, min });

        const svgOpts = { style: style, viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: preserveAspectRatio };
        // @ts-ignore
        if (svgWidth > 0) svgOpts.width = svgWidth;
        // @ts-ignore
        if (svgHeight > 0) svgOpts.height = svgHeight;

        return (
            <svg {...svgOpts}>
                {
                    React.Children.map(this.props.children, function(child) {
                        // @ts-ignore
                        return React.cloneElement(child, { data, points, width, height, margin });
                    })
                }
            </svg>
        );
    }
}

export default SparklinesColor