const { ValidationError } = require('joi');
const { UniqueConstraintError } = require('sequelize');
const BaseRouteHandlers = require('../base-route-handlers');

// ------------------------------------------------
// Company
// ------------------------------------------------

class NetworkRouteHandlers extends BaseRouteHandlers {
  /**
   * Fetch all companies
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
    async fetchPartnersHandler(req, res, next) {
        this.utils.log('Fetch partners request received');

        const companies = await this.companyController.findAll({});
        for (const company of companies) {
            company.dataValues.departments = await this.departmentController.findAll({ company_id: company.id});
            // TODO: Filter private data
        }

        this.sendResponse(res, 200, 'Success', companies);
    }
}

module.exports = NetworkRouteHandlers;