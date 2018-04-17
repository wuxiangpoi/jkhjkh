var less = require('./main.less');

(function (app) {

    require('./filters/index')(app);

    require('./services/index')(app);

    require('./components/index')(app);

    require('./dialogs/index')(app);

    require('./modules/router')(app);

})(app);
