export default {
    "workFlow":{
        "customer_id":"",
        "domain":"",
        "object_name":"",
        "action":""
    },
    "entity": {
       "tag_name":"",
       "user_input_type":"",
       "prompt_script":"",
       "bot_utterence":"",
       "options":[],
       "options_script":"",
       "validation_script":"",
       "output_sockets":[]
    },
    "begin":{
        "name":""
    },
    "injestion":{
        "endpoint":"",
        "document_type":"",
    },
    "cognitiveExtraction":{
        "pre_processing_script":"",
        "post_processing_script":"",
    },
    "classification":{
        "name": "",
        "upload_folder_path": "",
        "type": "",
        "password": "",
        "username": "",
        "host": "",
        "port": "",
        "notification_emails": "",
        "ftp_input_dir": "",
        "ftp_process_dir": "",
        "is_classification_required": false,
        "org": "",
        "auth_type": "",
        "tenant_id": "",
        "client_id": "",
        "client_secret": "",
        "email_move_folder_path":"",
        "action_after_email_processed":"",
    },
    "runScript":{
        "domain": "",
        "object_name": "",
        "action_name": "",
        "action_type": "",
        "tag": "",
        "bot_utterance": "",
        "options_script": "",
        "required_script": "",
        "active": true
    },
    "endWithMessage":{
        "message":""
    },
    "condition":{
        "domain": "",
        "object_name": "",
        "action_name": "",
        "action_type": "",
        "tag": "",
        "bot_utterance": "",
        "options_script": "",
        "required_script": "",
        "active": true
    }
}