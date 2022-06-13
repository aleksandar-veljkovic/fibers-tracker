const { ValidationError } = require('joi');
const { UniqueConstraintError } = require('sequelize');
const BaseRouteHandlers = require('../base-route-handlers');

// ------------------------------------------------
// Department
// ------------------------------------------------

class DepartmentRouteHandlers extends BaseRouteHandlers {
  /**
   * Fetch all departments
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
    async fetchAllDepartmentsHandler(req, res, next) {
        this.utils.log('Fetch all departments request received');

        try {
            const departments = await this.departmentController.findAll({});    
            this.sendResponse(res, 200, 'Success', departments);
        } catch (err) {
            this.utils.log(err);
            this.sendResponse(res, 500, 'Error', { error: 'internal_error', error_description: 'Internal server error' });
        }

        return next();
    }

  /**
   * Create new department
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
    async createDepartmentHandler(req, res, next) {
        this.utils.log('Create department request received');
        if (req.body == null) {
            this.sendResponse(res, 400, 'Error', { error: 'invalid_request', error_description: 'Invalid request object' });
            return next();
        }

        const departmentData = req.body;

        // TODO: Verify if the company with the given ID exists (add relations)

        try {
            const department = await this.departmentController.create(departmentData);
            this.sendResponse(res, 201, 'Department created', department);
        } catch (err) {
            if (err instanceof ValidationError) {
                this.sendResponse(res, 400, 'Error', { error: 'invalid_request', error_description: err.message });
            } else if (err instanceof UniqueConstraintError) {
                this.sendResponse(res, 400, 'Error', { error: 'invalid_request', error_description: 'Department already exists' });
            } else {
                this.utils.log(err);
                this.sendResponse(res, 500, 'Error', { error: 'internal_error', error_description: 'Internal server error' });
            }
        }

        return next();
    }

    /**
     * Fetch one department by id
     * @param {} req
     * @param {*} res
     * @param {*} next
     * @returns
     */
    async fetchSingleDepartmentHandler(req, res, next) {
        this.utils.log('Fetch single department request received');

        const departmentId = req.params.id;

        try {
            const department = await this.departmentController.findOne({ id: departmentId });
            if (department == null) {
                this.sendResponse(res, 404, 'Error', { error: 'not_found', error_description: 'Department not found' });
            }
            this.sendResponse(res, 200, 'Success', department);
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
     * Update one department
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @returns
     */
    async updateDepartmentHandler(req, res, next) {
        this.utils.log('Update department request received');

        const { id: departmentId } = req.params;
        const departmentUpdate = req.body;

        // TODO: Verify if the company with the given ID exists (add relations)

        try {
            const department = await this.departmentController.findOne({ id: departmentId });
            
            if (department == null) {
                this.sendResponse(res, 404, 'Error', { error: 'not_found', error_description: 'Department not found' });
            } else {
                await this.departmentController.findAndUpdate({ id: departmentId }, departmentUpdate);
                this.sendResponse(res, 201, 'Department updated', null);
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
   * Delete department
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
    async deleteDepartmentHandler(req, res, next) {
        this.utils.log('Delete department request received');

        const { id: departmentId } = req.params;

        try {
            const department = await this.departmentController.findOne({ id: departmentId });
            if (department == null) {
                this.sendResponse(res, 404, 'Error', { error: 'not_found', error_description: 'Department not found' });
            } else {
                await this.departmentController
                .findAndDelete({ id: departmentId });
                this.sendResponse(res, 201, 'Department deleted', null);
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

module.exports = DepartmentRouteHandlers;
