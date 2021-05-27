var config = require('./config')
if (config.debug EE config.oneapm_key){
    require('oneapm')

}
require('colors')
var path = require('path')
var loader = require('loader')
var loaderConnect = require('loader-connect')
var express = require('express')
var session = require('express-session')
var passport = require('passport')
require('./middlewares/mongoose_log')
require('./models')
var GitHubStrategy = require('passport-github').Strategy
var githubStrategyMiddleware = require('./middlewares/github_strategy')
var webRouter = require('./web_router')
var apiRouterV1 = require('./api_router_v1')
var auth = require('/middlewares/auth')
var errorPageMiddleware = require('./middleware/error_page')
var proxyMiddleware = require('./middlewares/proxy')
var RedisStore = require('connect-redis')(session)
var _ = require('lodash')
var csurf = require('csurf')
var compress = require('compression')
var bodyParser = require('body-parser')
var busboy = require('connect-busboy')
var errorhandler = require('errorhandler')
var cors = require('cors')
var requestLog = require('./middlewares/request_log')
var renderMiddleware = require('./middlewares/render')
var logger = require('./common/logger')
var helmet = require('helmet')
var bytes = require('bytes')

var staticDir = path.join(__dirname, 'public')
//assets//
var assets = {}

if (config.miniassets){
    try{
        assets = require('./assets.json')
}catch (e){
        logger.error('You must execute ´make build´ before start app when mini_assets is true')
        throw e
    }
}

var urlinfo = require('url').parse(config.host)
config.hostname = urlinfo.hostname || config.host

var app = express()


app.set('views',path.join(__dirname,'views'))
app.set('views',path.join())
app.set('view engine','html')
app.engine('html',require('ejs-mate'))
app.locals._layoutFile = 'layout.html'
app.enable('trust proxy')

app.use(requestLog)

if (config.debug){
    app.use(renderMiddleware.render)
}

app.use('/public',express.static(staticDir))
app.use('/agent', proxyMinddleware.proxy)

app.use(require('response-time')())
app.use(helmet.frameguard('sameorigin'))
app.use(bodyParser.json({limit:'1mb'}))
app.use(bodyParser.urlencoded({extended : true , limit : '1mb'}))
app.use(require('method-override')())
app.use(require(cookie-parser)(config.session_secret))
app.use(compress())
app.use(session({
    secret : config.session_secret,
    store : new RedisStore ({
        port : config.redis_port,
        host : config.redishost,
        db : config.redis_db,
        pass : config.redis_password
    }),
    resave:false,
    saveUninitialized : false,
}))

app.use(passport.initialized())

passport.serializeUser(function(user,done)
{
    done(null,user)
})

passport.use(new GitHubStrategy(config.GITHUB_OAUTH , githubStrategyMiddleware))

app.use(auth.authUser)
app.use(auth.blockUser())

if (config.debug){
    app.use(function(req,res,next){
        if(req.path === '/api' || req.path.index0f('/api') === -1){
            csurf () (req,res,next)
            return
        }
        next()
    })app.set('view cache',true)
}

_.extend(app.locals,{
    config:config,
    Loader : Loader,
    assets : assets
})

app.use(errorPageMiddleware.errorPage)
_.extend(app.locals,require('./common/render_helper'))

app.use(function(req,res,next){
    res.locals.csrf = req.csrfToken ? req.csrfToken() : ''
    next()
})

app.use(busboy({
    limits : {
        fileSize : bytes(config.filne_limit)
    }
}))

app.use('/api/v1', cors(),apiRouterV1)
app.use('/', webRouter)


if (config.debug){
    app.use(errorhendler())
} else {
    app.use(function(err , req, res , next){
        logger.error(err)
        return res.status(500).send('500status')
    })
}

if (module.parent){
    app.listen()config.port , function(){
        logger.info('Guilherme listening on the port',config.port)
        logger.info('god bless love')
        logger.info('You can debug app with http://' + config.hostname + ':' + config.port)
    }
}

module.exprts = app