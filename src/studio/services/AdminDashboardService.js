import axios from "axios";

function getData(URL) {
    return axios.get(`https://demo.digitaldots.io/api/odoo/${URL}`)
        .then(response => {
            return {
                data: response.data,
                loading: false,
                error: false
            }
        })
        .catch(error => {
            console.log(error)
            return {
                data: [],
                loading: false,
                error: true
            }
        })
}

function submitForm(URL, payload) {
    return axios.post(`https://demo.digitaldots.io/api/stock/${URL}`, payload)
}

const purchaseOrdersDrilldown = {
    "jsonrpc": "2.0",
    "id": 788233667,
    "result": {
        "length": 30,
        "records": [
            {
                "id": 32,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00036",
                "date_order": "2020-04-22 16:04:59",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 32986.0,
                "amount_total": 32986.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 31,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00035",
                "date_order": "2020-04-22 16:04:48",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 50686.0,
                "amount_total": 50686.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 30,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00034",
                "date_order": "2020-04-22 15:04:59",
                "date_approve": false,
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 50686.0,
                "amount_total": 50686.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "cancel",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 29,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00033",
                "date_order": "2020-04-22 15:04:45",
                "date_approve": false,
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 50686.0,
                "amount_total": 50686.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "cancel",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 28,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00032",
                "date_order": "2020-04-22 15:04:19",
                "date_approve": false,
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 50686.0,
                "amount_total": 50686.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "cancel",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 26,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00030",
                "date_order": "2020-04-22 14:04:58",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 50686.0,
                "amount_total": 50686.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 25,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00029",
                "date_order": "2020-04-22 14:04:44",
                "date_approve": "2020-04-22 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 50686.0,
                "amount_total": 50686.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "cancel",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 24,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00028",
                "date_order": "2020-04-22 14:04:32",
                "date_approve": "2020-04-22 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 50686.0,
                "amount_total": 50686.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "cancel",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 23,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00027",
                "date_order": "2020-04-21 08:48:24",
                "date_approve": "2020-04-21 00:00:00",
                "partner_id": [
                    33,
                    "Azure Interior, Colleen Diaz"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 385.0,
                "amount_total": 385.0,
                "currency_id": [
                    2,
                    "USD"
                ],
                "state": "done",
                "invoice_status": "invoiced",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 22,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00026",
                "date_order": "2020-04-21 08:46:46",
                "date_approve": "2020-04-21 00:00:00",
                "partner_id": [
                    14,
                    "Azure Interior"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 1500.0,
                "amount_total": 1560.0,
                "currency_id": [
                    2,
                    "USD"
                ],
                "state": "purchase",
                "invoice_status": "to invoice",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 21,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00025",
                "date_order": "2020-04-21 06:04:48",
                "date_approve": "2020-04-21 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 2400.0,
                "amount_total": 2400.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 13,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00017",
                "date_order": "2020-04-21 06:04:42",
                "date_approve": "2020-04-21 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 0.0,
                "amount_total": 0.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 19,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00023",
                "date_order": "2020-04-21 06:04:33",
                "date_approve": false,
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 0.0,
                "amount_total": 0.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "cancel",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 14,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00018",
                "date_order": "2020-04-21 06:04:17",
                "date_approve": "2020-04-21 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 0.0,
                "amount_total": 0.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "done",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 12,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00016",
                "date_order": "2020-04-21 06:04:09",
                "date_approve": false,
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 0.0,
                "amount_total": 0.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "cancel",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 11,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00015",
                "date_order": "2020-04-21 05:04:43",
                "date_approve": false,
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 0.0,
                "amount_total": 0.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "cancel",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 17,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00021",
                "date_order": "2020-04-21 00:57:00",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 500.0,
                "amount_total": 500.0,
                "currency_id": [
                    2,
                    "USD"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 34,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00038",
                "date_order": "2020-04-21 00:52:12",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 2250.0,
                "amount_total": 2250.0,
                "currency_id": [
                    2,
                    "USD"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 33,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00037",
                "date_order": "2020-04-21 00:52:12",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 2250.0,
                "amount_total": 2250.0,
                "currency_id": [
                    2,
                    "USD"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 18,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00022",
                "date_order": "2020-04-21 00:52:12",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 2250.0,
                "amount_total": 2250.0,
                "currency_id": [
                    2,
                    "USD"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 16,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00020",
                "date_order": "2020-04-21 00:52:12",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 2250.0,
                "amount_total": 2250.0,
                "currency_id": [
                    2,
                    "USD"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 15,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00019",
                "date_order": "2020-04-21 00:52:12",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 1000.0,
                "amount_total": 1000.0,
                "currency_id": [
                    2,
                    "USD"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 10,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00014",
                "date_order": "2020-04-20 22:04:10",
                "date_approve": "2020-04-22 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 0.0,
                "amount_total": 0.0,
                "currency_id": [
                    20,
                    "INR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 7,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00007",
                "date_order": "2020-04-16 10:12:10",
                "date_approve": "2020-04-21 00:00:00",
                "partner_id": [
                    12,
                    "Ready Mat"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 637.5,
                "amount_total": 637.5,
                "currency_id": [
                    1,
                    "EUR"
                ],
                "state": "cancel",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 6,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00006",
                "date_order": "2020-04-16 10:12:10",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    9,
                    "Wood Corner"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": "OP/00001, OP/00002",
                "amount_untaxed": 22325.0,
                "amount_total": 22325.0,
                "currency_id": [
                    1,
                    "EUR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 5,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00005",
                "date_order": "2020-04-16 10:12:09",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    10,
                    "Deco Addict"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 8658.0,
                "amount_total": 8658.0,
                "currency_id": [
                    1,
                    "EUR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 4,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00004",
                "date_order": "2020-04-16 10:12:09",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    12,
                    "Ready Mat"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 14563.0,
                "amount_total": 14563.0,
                "currency_id": [
                    1,
                    "EUR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 3,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00003",
                "date_order": "2020-04-16 10:12:09",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    14,
                    "Azure Interior"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 255.0,
                "amount_total": 255.0,
                "currency_id": [
                    1,
                    "EUR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 2,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00002",
                "date_order": "2020-04-16 10:12:09",
                "date_approve": "2020-04-23 00:00:00",
                "partner_id": [
                    11,
                    "Gemini Furniture"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 3095.0,
                "amount_total": 3095.0,
                "currency_id": [
                    1,
                    "EUR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            },
            {
                "id": 1,
                "message_unread": false,
                "partner_ref": false,
                "name": "P00001",
                "date_order": "2020-04-16 10:12:09",
                "date_approve": "2020-04-16 00:00:00",
                "partner_id": [
                    9,
                    "Wood Corner"
                ],
                "company_id": [
                    1,
                    "My Company (San Francisco)"
                ],
                "date_planned": false,
                "user_id": [
                    2,
                    "Mitchell Admin"
                ],
                "origin": false,
                "amount_untaxed": 28729.3,
                "amount_total": 28729.3,
                "currency_id": [
                    1,
                    "EUR"
                ],
                "state": "purchase",
                "invoice_status": "no",
                "activity_exception_decoration": false,
                "activity_exception_icon": false
            }
        ]
    }
}

export const dashBoardService = { getData, submitForm, purchaseOrdersDrilldown };
