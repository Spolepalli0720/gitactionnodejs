const CHART_SETTINGS = [
    { label: 'Heading', key: 'options.heading.title', inputType: 'text' },
    {
        label: 'Align Heading', key: 'options.heading.align', inputType: 'select',
        selectValues: [
            { value: 'text-left', label: 'Left' },
            { value: 'text-center', label: 'Center' },
            { value: 'text-right', label: 'Right' },
        ]
    },
    { label: 'Deterministic', key: 'options.deterministic', inputType: 'checkbox' },
    { label: 'Chart Type', key: 'type', inputType: 'select', selectReference: 'variations' }
]



const CHART_APPEARANCE = [
    { label: 'Font Family', key: 'options.fontFamily', inputType: 'select',selectValues:[
        {value:'impact',label:'Impact'},
        {value:'Times New Roman',label:'Times New Roman'},
        {value:'courier new',label:'Courier New'},
        {value:'Arial',label:'Arial'},
        {value:'Georgia',label:'Georgia'},
        {value:'Segoe UI',label:'Segoe UI'}
        ] 
    },
    { label: 'Font Style', key: 'options.fontStyle', inputType: 'select',selectValues:[
        {value:'normal',label:'Normal'},
        {value:'italic',label:'Italic'},
        {value:'oblique',label:'Oblique'}
        ] 
    },
    { label: 'Font Weight', key: 'options.fontWeight', inputType: 'select',selectValues:[
        {value:'normal',label:'Normal'},
        {value:'light',label:'Light'},
        {value:'bold',label:'Bold'}
        ] 
    },
    { label: 'Word Space', key: 'options.padding', inputType: 'number' },
    { label: 'Rotations', key: 'options.rotations', inputType: 'number' },
    
    { label: 'Scale', key: 'options.scale', inputType: 'select',selectValues:[
        {value:'sqrt',label:'Square root'},
        {value:'log',label:'Logarithmic'}
        ] 
    },
    { label: 'Spiral', key: 'options.spiral', inputType: 'select',selectValues:[
        {value:'archimedean',label:'Archimedean'},
        {value:'rectangular',label:'Rectangular'}
        ] 
    }
    
]
const CHART_ANIMATION = [
    
    { label: 'Transtion Duration', key: 'options.transitionDuration', inputType: 'number' }
    
]

module.exports.PROPERTIES = {
    'word-cloud': {
        'WordCloud': {
            'Basic Settings': CHART_SETTINGS,
            'Appearance': CHART_APPEARANCE,
            'Animation': CHART_ANIMATION
        }
    }
}