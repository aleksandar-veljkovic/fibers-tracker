const { ValidationError } = require('joi');
const Joi = require('joi');
const Controller = require('./controller');

class CompanyController extends Controller {
  constructor(ctx) {
    // Validation schemas
    const schemes = {
      create: Joi.object({
        title: Joi.string().error(() => new ValidationError('Missing or invalid company title')),
        country: Joi.string().error(() => new ValidationError('Missing or invalid company country')),
        state: Joi.string().error(() => new ValidationError('Missing or invalid company state')),
        city: Joi.string().error(() => new ValidationError('Missing or invalid company city')),
        address: Joi.string().error(() => new ValidationError('Missing or invalid company address')),
        email: Joi.string().error(() => new ValidationError('Missing or invalid company email')),
      }),
      
      update: Joi.object({
        title: Joi.string().optional().error(() => new ValidationError('Invalid company title')),
        country: Joi.string().optional().error(() => new ValidationError('Invalid company country')),
        state: Joi.string().optional().error(() => new ValidationError('Invalid company state')),
        city: Joi.string().optional().error(() => new ValidationError('Invalid company city')),
        address: Joi.string().optional().error(() => new ValidationError('Invalid company address')),
        email: Joi.string().optional().error(() => new ValidationError('Invalid company email')),
      }),
    };

    super(ctx.companyModel(ctx.db), schemes);
    this.utils = ctx.utils;
  }
}

module.exports = CompanyController;
