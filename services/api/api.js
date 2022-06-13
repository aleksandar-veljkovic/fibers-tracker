const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

// API Route handlers
const BaseRouteHandlers = require('./base-route-handlers');
const CompanyRouteHandlers = require('./route-handlers/company-route-handlers');
const DepartmentRouteHandlers = require('./route-handlers/department-route-handlers');

// Cors middelware parameters
const cors = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['*'],
  exposeHeaders: ['*'],
});

/**
 * Rest Server main class, includes route handlers for handling specific API routes
 */
class RestServer {
  constructor(ctx) {
    this.config = ctx.config;
    this.utils = ctx.utils;

    // Initialize route handlers
    this.baseRouteHandlers = new BaseRouteHandlers(ctx);
    this.companyRouteHandlers = new CompanyRouteHandlers(ctx);
    this.departmentRouteHandlers = new DepartmentRouteHandlers(ctx);

    this.unprotectedRoutes = [
      {
        method: 'GET',
        path: '/',
      },
    ];

    this.init();
  }

  /**
     * Initialize server parameters
     */
  init() {
    // Initialize REST server
    this.server = restify.createServer({
        name: this.config.api.appName,
    });

    this.server.pre(cors.preflight);
    this.server.use(cors.actual);
    this.server.use(restify.plugins.queryParser({ mapParams: false }));
    this.server.use(restify.plugins.bodyParser());

    // Register API Routes
    this.registerRoutes();
  }

  /**
     * Register API routes and connect them with route handlers
     */
  registerRoutes() {
    // Healthcheck
    this.server.get('/', this.baseRouteHandlers.healthcheckHandler.bind(this.baseRouteHandlers));

    // Query handler
    this.server.get('/query/:id', this.baseRouteHandlers.queryHandler.bind(this.baseRouteHandlers));

    // Company handlers
    this.server.post('/companies', this.companyRouteHandlers.createCompanyHandler.bind(this.companyRouteHandlers));
    this.server.get('/companies', this.companyRouteHandlers.fetchAllCompaniesHandler.bind(this.companyRouteHandlers));
    this.server.get('/companies/:id', this.companyRouteHandlers.fetchSingleCompanyHandler.bind(this.companyRouteHandlers));
    this.server.put('/companies/:id', this.companyRouteHandlers.updateCompanyHandler.bind(this.companyRouteHandlers));
    this.server.del('/companies/:id', this.companyRouteHandlers.deleteCompanyHandler.bind(this.companyRouteHandlers));

    // Department handlers
    this.server.post('/departments', this.departmentRouteHandlers.createDepartmentHandler.bind(this.departmentRouteHandlers));
    this.server.get('/departments', this.departmentRouteHandlers.fetchAllDepartmentsHandler.bind(this.departmentRouteHandlers));
    this.server.get('/departments/:id', this.departmentRouteHandlers.fetchSingleDepartmentHandler.bind(this.departmentRouteHandlers));
    this.server.put('/departments/:id', this.departmentRouteHandlers.updateDepartmentHandler.bind(this.departmentRouteHandlers));
    this.server.del('/departments/:id', this.departmentRouteHandlers.deleteDepartmentHandler.bind(this.departmentRouteHandlers));
  }

  /**
    * Start REST API
    */
  start() {
    this.server.listen(
      this.config.api.port,
      this.config.api.host || 'localhost',
      () => this.utils.log(`${this.config.api.appName} API listening at ${
        this.server.address().address
      }:${
        this.config.api.port
      }`),
    );
  }
}

module.exports = RestServer;
