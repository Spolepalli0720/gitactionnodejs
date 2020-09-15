import React from 'react';
import ReactWordcloud from 'react-wordcloud';

export default function WordCloud(props){
    let defaultOptions = {
        fontSizes: [20, 60],
        rotationAngles: [0, 90],
        tooltipOptions: {
            allowHTML: true,
            arrow: false,
            placement: 'bottom',
          },
        ...props.options,
    }
    
    let options = JSON.parse(JSON.stringify(defaultOptions));
    if (!props.data || props.data.length === 0) {
        return (<div className='chart-message'>No data</div>)
    }else{
        return <ReactWordcloud options={options} words={props.data || []}  callbacks={{
            getWordColor: ({text, value }) => {
              if(value > 0){
                  return '#45f547'
              }else{
                  return '#f0412e'
              }
            }
          }}/>
    }
}