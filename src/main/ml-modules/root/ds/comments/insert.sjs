'use strict';

declareUpdate();

const DataHub = require('/data-hub/5/datahub.sjs');
const datahub = new DataHub();

// These values can come in from a users request.
var user;
var comment;
var articleId;

var uuid = sem.uuidString();

let instance = {
    'info': {
        'title': 'HubArticleComment',
        'version': '0.0.1'
    },
    'HubArticleComment': {
        'id': uuid,
        'name': user,
        'created': fn.currentDateTime(),
        'comment': comment,
        'articleId': articleId
    }
}

let uri = '/data/comments/' + uuid + '.json'

let headers = {};
let triples = [];
let outputFormat = datahub.flow.consts.JSON;

let envelope = datahub.flow.flowUtils.makeEnvelope(instance, headers, triples, outputFormat);

xdmp.documentInsert(uri, envelope, {
    'permissions':
        [
            xdmp.permission('data-hub-operator', 'read'),
            xdmp.permission('data-hub-operator', 'update')
        ],
    'collections': 'HubArticleComment'
});

envelope