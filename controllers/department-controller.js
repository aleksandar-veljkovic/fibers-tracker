const { ValidationError } = require('joi');
const Joi = require('joi');
const Controller = require('./controller');

class DepartmentController extends Controller {
  constructor(ctx) {
    // Validation schemas
    const schemes = {
      create: Joi.object({
        company_id: Joi.string().required().error(() => new ValidationError('Missing or invalid company id')),
        title: Joi.string().required().error(() => new ValidationError('Missing or invalid department title')),
        country: Joi.string().required().error(() => new ValidationError('Missing or invalid department country')),
        state: Joi.string().required().error(() => new ValidationError('Missing or invalid department state')),
        city: Joi.string().required().error(() => new ValidationError('Missing or invalid department city')),
        address: Joi.string().required().error(() => new ValidationError('Missing or invalid department address')),
        email: Joi.string().required().error(() => new ValidationError('Missing or invalid department email')),
        latitude: Joi.number().required().error(() => new ValidationError('Missing or invalid department location latitude')),
        longitude: Joi.number().required().error(() => new ValidationError('Missing or invalid department location longitude')),
        pub_address: Joi.string().required().error(() => new ValidationError('Missing or invalid department public address')),
        api: Joi.string().required().error(() => new ValidationError('Missing or invalid department api base')),
      }),
      
      update: Joi.object({
        company_id: Joi.string().error(() => new ValidationError('Invalid company id')),
        title: Joi.string().optional().error(() => new ValidationError('Invalid department title')),
        country: Joi.string().optional().error(() => new ValidationError('Invalid department country')),
        state: Joi.string().optional().error(() => new ValidationError('Invalid department state')),
        city: Joi.string().optional().error(() => new ValidationError('Invalid department city')),
        address: Joi.string().optional().error(() => new ValidationError('Invalid department address')),
        email: Joi.string().optional().error(() => new ValidationError('Invalid department email')),
        latitude: Joi.number().error(() => new ValidationError('Invalid department location latitude')),
        longitude: Joi.number().error(() => new ValidationError('Invalid department location longitude')),
        pub_address: Joi.string().error(() => new ValidationError('Invalid department public address')),
        api: Joi.string().error(() => new ValidationError('Invalid department api base')),
      }),
    };

    super(ctx.departmentModel(ctx.db), schemes);
    this.utils = ctx.utils;
  }
}

module.exports = DepartmentController;
