var http = require("http");



var middlewares = [
  function fun1(req, res, next) {
    parseBody(req, function(err, body) {
      if (err) return next(err);
      req.body = body;
      next();
    });
  },
  function fun2(req, res, next) {
    checkIdInDatabase(req.body.id, function(err, rows) {
      if (err) return next(err);
      res.dbResult = rows;
      next();
    });
  },
  function fun3(req, res, next) {
    if (res.dbResult && res.dbResult.length > 0) {
      res.end("true");
    } else {
      res.end("false");
    }
    next();
  }
];

var server = http.createServer(requestHandler);

function requestHandler(req, res) {
  var i = 0;

  //由middlewares链式调用
  function next(err) {
    if (err) {
      return res.end("error:", err.toString());
    }

    if (i < middlewares.length) {
      middlewares[i++](req, res, next);
    } else {
      return;
    }
  }

  //触发第一个middleware
  next();
}

server.listen(3000);
