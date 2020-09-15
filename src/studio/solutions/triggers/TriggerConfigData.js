module.exports.SCHEDULE_ZONE_ARR = [
    {label:'',value:''},
    {label:'IST',value:' +05:00'},
    {label:'PST',value:' +08:00'},
    {label:'UTC',value:' +00:00'}
]
module.exports.SCHEDULE_HOUR_ARR = [
    {label:'',value:''},
    {label:'Hours',value:'hours'}
]

module.exports.DIRECT_CONFIG_FORM = {
            
    "isPullEnabled": true,
    "isWorkFlowEnabled": true,
    "payload": "",
    "processId": "",
    "workFlowName": "",
    "solutionId": "",
    "type": "direct"
  }

module.exports.EMAIL_CONFIG_FORM = {
    "configutation": {
      "folderName": "",
      "hostName": "",
      "password": "",
      "portName": 0,
      "referenceName": "",
      "userName": ""
    },
    "isPullEnabled": true,
    "isWorkFlowEnabled": true,
    "pattern": [
      {
        "patternType": "sender",
        "regex": "support@digitaldots.ai"
      },
      {
        "patternType": "subject",
        "regex": "*order*"
      },
      {
        "patternType": "content",
        "regex": "*Place Order*"
      }
    ],
    "payload": {},
    "processId": "",
    "schedule": {
      "interval": [
        {
          "every": "hours",
          "hours": "",
          "min": ""
        }
      ],
      "time": [
        {
            "time":"",
            "zone":""
        }
      ],
      "type": "daily"
    },
    "solutionId":"",
    "type": "email",
    "workFlowName": ""
  }

module.exports.SFTP_CONFIG_FORM = {
    "configutation": {
      "folderName": "",
      "hostName": "",
      "password": "",
      "portName": "",
      "referenceName": "",
      "userName": ""
    },
    "isPullEnabled": true,
    "isWorkFlowEnabled": true,
    "pattern": [
      {
        "patternType": "fileName",
        "regex": "*.json"
      },
      {
        "patternType": "content",
        "regex": "id!==null"
      }
    ],
    "payload": {},
    "processId": "",
    "schedule": {
      "interval": [
        {
          "every": "hours",
          "hours": "",
          "min": ""
        }
      ],
      "time": [
        {
            "time":"",
            "zone":""
        }
      ],
      "type": "daily"
    },
    "solutionId":"",
    "type": "sftp",
    "workFlowName": ""
  }

module.exports.SCHEDULED_CONFIG_FORM = {
    "configutation": {
      "folderName": "",
      "hostName": "",
      "password": "",
      "portName": "",
      "referenceName": "",
      "userName": ""
    },
    "isPullEnabled": true,
    "name":"",
    "description":"",
    "isWorkFlowEnabled": true,
    "payload": "",
    "processId": "",
    "schedule": {
      "interval": [
        {
          "every": "hours",
          "hours": "",
          "min": ""
        }
      ],
      "time": [
        {
            "time":"",
            "zone":""
        }
      ],
      "type": "daily"
    },
    "solutionId":"",
    "type": "jms",
    "workFlowName": ""
  }


