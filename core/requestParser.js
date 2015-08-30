// local includes
var log = require('./logger.js').log;

// parse param and build query for each param field
knownKeys = [
    'allProperties',
    'sortAsc',
    'sortDesc',
    'sortBy',
    'orderBy',
    'fields',
    'limit',
    'offset',
    'active',
    'search', //NEW
    'updatedSince'
];

sortKeys = [
    'asc',
    'ascending',
    'descending',
    'desc',
    '1',
    '-1'
];

queryKeys = [
    'name',
    'createdAt',
    'updatedAt',
    'coordinates',
    'identifiers',
    'properties',
    'uuid',
    'href'
];

badKeys = [
    '_id',
    'uuid',
    'url',
    'createdAt',
    'id',
    'href',
    '__v',
    'updatedAt'
];

// consumes params builds query, returns for view to exec
var parseParams = function(params, query) {

    var projections = {};
    var filters = {};
    var sorts = {};

    // filters
    if (params.active) {
        genActiveQuery(filters, params.active);
    }

    if (params.updatedSince) {
        genDateQuery(filters, params.updatedSince);
    }

    // add ons
    genAddOnsQuery(params, filters);

    // projections
    if (params.fields) {
        genProjectionQuery(projections, params.fields);
    }

    if (params.allProperties) {
        genPropQuery(projections, params.allProperties);
    }


    // Note: Cannot exclude and include at the same time in mongo
    query = query.find(filters);
    query = query.select(projections);
    if (params.search) {
        query = query.find({'$text': {'$search': params.search }});
    }


    // sort (cannot be seperated)
    if (params.sortAsc) {
        genAscQuery(sorts, params.sortAsc);
    }

    if (params.sortDesc) {
        genDescQuery(sorts, params.sortDesc);
    }

    if (params.sortBy) {
        genSortQuery(sorts, params.sortBy, params.orderBy);
    }


    query = query.sort(sorts);

    // Add in limits
    query = genLimitQuery(params, query);

    // Print what I think I sent
    log.debug("Parsed Params", {
        "filters": filters,
        "projections": projections,
        "sorts": sorts
    });

    return query;

};

var parseForVirts = function(params) {

    // Assume No fields will be hidden
    var hidden = {};

    // uuid, href are only virt fields (and probably will stay that way)
    if (params.fields) {
        // Fields => uuid and href mostly likey hidden
        hidden = {
            "uuid": 0,
            "href": 0
        };
        field_names = params.fields.split(",");
        field_names.forEach(function(field) {
            field = field.replace(":", ".");
            // remove virt fields found
            if (field == "uuid") {
                delete hidden.uuid;
            } else if (field == "href") {
                delete hidden.href;
            }
        });
    }

    return Object.keys(hidden).join(',');

};

var parseBody = function(body) {

    var state = true;
    if (!body || Object.keys(body).length === 0) {
        return false;
    }

    // nullifiy body if it contains any of our bad keys
    badKeys.forEach(function(badKey) {
        state = (!Boolean(body[badKey])) && state; // stays false if ever false 
        delete body[badKey];
    });

    body.updatedAt = Date();
    return state;
};

/* Parsing helper functions */

// Limit the number of tuples to be returned
var genLimitQuery = function(params, query) {

    var off = 0;
    var lim, per_page;

    // set default limit/per_page
    lim = per_page = 25;

    if (params.limit === "off") {
        //params.limit = 0;
        params.limit = 1000;
    }

    if (!isNaN(params.limit)) {
        lim = params.limit;
    } else {
        params.limit = lim;
    }

    if (!isNaN(params.offset)) {
        off = params.offset;
    }

    // per_page param overrides limit
    if (!isNaN(params.per_page)) {
        lim = params.per_page;
    }

    // page param overrides offset
    if (!isNaN(params.page)) {
        off = (params.page - 1) * lim;
    }

    log.debug('pagination', off);

    return query.skip(off).limit(lim);
};

// Include or not include properties
var genPropQuery = function(projections, prop) {
    // Some weird bug in mongo doesnt allow properties to be set to 0 
    // with other fields set to 1???
    if (prop === 'false' && JSON.stringify(projections) === '{}') {
        projections.properties = 0;
    }

    // Setting to true is the default case, unless fields are set then ..,
    if (prop === 'true' && JSON.stringify(projections) !== '{}') {
        projections.properties = 1;
    }
};

// Project only fields in fields
var genProjectionQuery = function(projections, fields) {
    field_names = fields.split(",");
    field_names.forEach(function(field) {
        field = field.replace(":", ".");
        projections[field] = 1;
    });
};

// Sorting by a specific field
var genAscQuery = function(sorts, asc) {
    sorts[asc] = 1;
};

var genDescQuery = function(sorts, desc) {
    sorts[desc] = -1;
};

var genSortQuery = function(sorts, sortBy, orderBy) {
    var order = orderBy || 'ascending';
    if (!~sortKeys.indexOf(order)) {
        console.log(order, " is not a known order");
        console.log(order, " is not a known order");
        console.log(order, " is not a known order");
        return;
    }

    if (order === "-1" || order === "1") {
        order = parseInt(order);
    }

    sorts[sortBy] = order;
}

// For active queries (require boolean values)
var genActiveQuery = function(filters, active) {
    filters.active = active;
};

// For date based queries
var genDateQuery = function(filters, date_str) {
    var date = new Date(date_str);
    //filters['updatedAt'] = {'$gte': date, '$lte': new Date()}
    filters.updatedAt = {
        '$gte': date
    };
};

// For queries specifiying specific fields
var genAddOnsQuery = function(params, filters) {
    paramKeys = Object.keys(params);
    paramKeys.forEach(function(pkey) {
        var core = pkey.split(":")[0];
        if ((!~knownKeys.indexOf(core)) 
        &&  (~queryKeys.indexOf(core))) {

            // Determine if mult options passed, restify packages it as an array
            if (typeof params[pkey] === "string") {
                filters[pkey.replace(":", ".")] = params[pkey];
            } else {
                filters[pkey.replace(":", ".")] = {
                    '$in': params[pkey]
                };
            }
        }
    });
};

exports.parseParams = parseParams;
exports.parseBody = parseBody;
exports.parseForVirts = parseForVirts;
exports.genLimitQuery = genLimitQuery;
