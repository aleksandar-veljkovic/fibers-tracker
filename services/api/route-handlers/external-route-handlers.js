const { default: axios } = require('axios');
const { ValidationError } = require('joi');
const { UniqueConstraintError } = require('sequelize');
const BaseRouteHandlers = require('../base-route-handlers');

// ------------------------------------------------
// External
// ------------------------------------------------

class ExternalRouteHandlers extends BaseRouteHandlers {

    queryPartner(prover, nodeApi, itemId) {
        return new Promise((resolve, reject) => {
            axios.get(`${nodeApi}/network/query/${itemId}`).then(res => {
                resolve({ prover, shipmentData: res.data.data });
            }).catch(err => { console.log(err); resolve({ prover, shipmentData: null })});
        })
    }

    async queryHandler(req, res, next) {
        const { itemId } = req.params;
        
        const requests = [];

        const companies = await this.companyController.findAll({});
        for (const company of companies) {
            const departments = await this.departmentController.findAll({ company_id: company.id});
            
            for (const department of departments) {
                const { id, title, api: nodeApi, latitude, longitude } = department;
                requests.push(this.queryPartner({
                    company: { 
                        id: company.id,
                        title: company.title,
                    },
                    department: {
                        id,
                        title,
                        latitude,
                        longitude,
                    
            }}, nodeApi, itemId));
            }
        }

        const responses = (await Promise.all(requests));//.filter(el => el.shipmentData != null);
        this.sendResponse(res, 200, 'Sucess', responses);
    }
};

module.exports = ExternalRouteHandlers;