'use strict';

const op = require('/MarkLogic/optic');

// These values can come in from a users request.
var articleId;
var limit;

limit = (limit > 100) ? 100 : limit;

let article =
    op.fromView('HubArticle', 'HubArticle')
        .where(op.eq(op.col('id'), articleId))
        .select('title')
        .limit(1)
        .result();

let result =
    op.fromView('HubArticleComment', 'HubArticleComment')
        .where(op.eq(op.col('articleId'), articleId))
        .orderBy(op.desc('created'))
        .limit(limit)
        .result();

let output =
{
    'title': (fn.exists(article)) ? fn.head(article)['HubArticle.HubArticle.title'] : null,
    'articleId': articleId,
    'result': result
};

output