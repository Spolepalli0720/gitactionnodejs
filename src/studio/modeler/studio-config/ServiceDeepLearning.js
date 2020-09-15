module.exports.REST_DEEP_LEARNING = {
    label_path: 'Service Task',
    label_method: 'Operation',
    hideVersion: false,
    paths: [
        { name: 'SKL XGBoost Bin Classifier', 
            value: '/api/models/classifier/xgboost/{SELECTED_VERSION}', 
            methods: [
                { name: 'POST', value: 'POST/{scorers}/{target}/{objective}/{num_boost_round}/{eta}/{min_child_weight}/{scale_pos_weight}/{max_depth}/{n_estimators}/{subsample}/{dependencies}' }
            ],
            versions:['default'],
        },
        { name: 'Classify Document', 
            value: '/api/models/classifier/document/{SELECTED_VERSION}', 
            methods: [
                { name: 'POST', value: 'POST/{elements_config}/{classify_on}/{custom_modal_name}/{dependencies}/{bypass_classification}/{default_classification_class}/{task_max_retries}/{timeout}' }
            ],
            versions:['default'],
        },
		{ name: 'NER Classification', 
            value: 'https://ds-ner-api.bever.digitaldots.ai/process', 
            methods: [
                { name: 'POST', value: 'POST' }
            ],
            versions:['default'],
        },
		
		{ name: 'Emotex  Model', 
            value: 'https://ds-insights-api.bever.digitaldots.ai/predict', 
            methods: [
                { name: 'POST', value: 'POST' }
            ],
            versions:['default'],
        },
    ],
    versions:['default'],
}
