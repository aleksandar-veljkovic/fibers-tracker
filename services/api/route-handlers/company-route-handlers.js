const { ValidationError } = require('joi');
const { UniqueConstraintError } = require('sequelize');
const BaseRouteHandlers = require('../base-route-handlers');

// ------------------------------------------------
// Company
// ------------------------------------------------

class CompanyRouteHandlers extends BaseRouteHandlers {
  /**
   * Fetch all companies
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
    async fetchAllCompaniesHandler(req, res, next) {
        this.utils.log('Fetch all companies request received');

        try {
            const companies = await this.companyController.findAll({});
            this.sendResponse(res, 200, 'Success', companies);
        } catch (err) {
            this.utils.log(err);
            this.sendResponse(res, 500, 'Error', { error: 'internal_error', error_description: 'Internal server error' });
        }

        return next();
    }

  /**
   * Create new company
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
    async createCompanyHandler(req, res, next) {
        this.utils.log('Create company request received');
        if (req.body == null) {
            this.sendResponse(res, 400, 'Error', { error: 'invalid_request', error_description: 'Invalid request object' });
            return next();
        }

        const companyData = req.body;

        try {
            const company = await this.companyController.create(companyData);
            this.sendResponse(res, 201, 'Company created', company);
        } catch (err) {
            if (err instanceof ValidationError) {
                this.sendResponse(res, 400, 'Error', { error: 'invalid_request', error_description: err.message });
            } else if (err instanceof UniqueConstraintError) {
                this.sendResponse(res, 400, 'Error', { error: 'invalid_request', error_description: 'Company already exists' });
            } else {
                this.utils.log(err);
                this.sendResponse(res, 500, 'Error', { error: 'internal_error', error_description: 'Internal server error' });
            }
        }

        return next();
    }

    /**
     * Fetch one company by id
     * @param {} req
     * @param {*} res
     * @param {*} next
     * @returns
     */
    async fetchSingleCompanyHandler(req, res, next) {
        this.utils.log('Fetch single company request received');

        const companyId = req.params.id;

        try {
            const company = await this.companyController.findOne({ id: companyId });
            if (company == null) {
                this.sendResponse(res, 404, 'Error', { error: 'not_found', error_description: 'Company not found' });
            }
            this.sendResponse(res, 200, 'Success', company);
        } catch (err) {
            if (err instanceof ValidationError) {
                this.sendResponse(res, 400, 'Error', { error: 'invalid_request', error_description: err.message });
            } else {
                this.utils.log(err);
                this.sendResponse(res, 500, 'Error', { error: 'internal_error', error_description: 'Internal server error' });
            }
        }

        return next();
    }

    /**
     * Update one company
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @returns
     */
    async updateCompanyHandler(req, res, next) {
        this.utils.log('Update company request received');

        const { id: companyId } = req.params;
        const companyUpdate = req.body;

        try {
            const company = await this.companyController.findOne({ id: companyId });
            
            if (company == null) {
                this.sendResponse(res, 404, 'Error', { error: 'not_found', error_description: 'Company not found' });
            } else {
                await this.companyController.findAndUpdate({ id: companyId }, companyUpdate);
                this.sendResponse(res, 201, 'Company updated', null);
            }
        } catch (err) {
            if (err instanceof ValidationError) {
                this.sendResponse(res, 400, 'Error', { error: 'invalid_request', error_description: err.message });
            } else {
                this.utils.log(err);
                this.sendResponse(res, 500, 'Error', { error: 'internal_error', error_description: 'Internal server error' });
            }
        }

        return next();
    }

  /**
   * Delete company
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
    async deleteCompanyHandler(req, res, next) {
        this.utils.log('Delete company request received');

        const { id: companyId } = req.params;

        try {
            const company = await this.companyController.findOne({ id: companyId });
            if (company == null) {
                this.sendResponse(res, 404, 'Error', { error: 'not_found', error_description: 'Company not found' });
            } else {
                await this.companyController
                .findAndDelete({ id: companyId });
                this.sendResponse(res, 201, 'Company deleted', null);
            }
        } catch (err) {
            if (err instanceof ValidationError) {
                this.sendResponse(res, 400, 'Error', { error: 'invalid_request', error_description: err.message });
            } else {
                this.utils.log(err);
                this.sendResponse(res, 500, 'Error', { error: 'internal_error', error_description: 'Internal server error' });
            }
        }

        return next();
    }
}

module.exports = CompanyRouteHandlers;
