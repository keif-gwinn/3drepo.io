/**
 *  Copyright (C) 2021 3D Repo Ltd
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const { addTicket, getTicketById, getTicketList, getTicketResourceAsStream } = require('../../../../processors/teamspaces/projects/models/containers');
const { hasCommenterAccessToContainer, hasReadAccessToContainer } = require('../../../../middleware/permissions/permissions');
const { respond, writeStreamRespond } = require('../../../../utils/responder');
const { serialiseFullTicketTemplate, serialiseTicket, serialiseTicketList } = require('../../../../middleware/dataConverter/outputs/teamspaces/projects/models/commons/tickets');
const { templateExists, validateNewTicket } = require('../../../../middleware/dataConverter/inputs/teamspaces/projects/models/commons/tickets');
const { Router } = require('express');
const { UUIDToString } = require('../../../../utils/helper/uuids');
const { getAllTemplates: getAllTemplatesInProject } = require('../../../../processors/teamspaces/projects');
const { templates } = require('../../../../utils/responseCodes');

const createTicket = async (req, res) => {
	const { teamspace, project, container } = req.params;
	try {
		const _id = await addTicket(teamspace, project, container, req.body, req.templateData);

		respond(req, res, templates.ok, { _id: UUIDToString(_id) });
	} catch (err) {
		// istanbul ignore next
		respond(req, res, err);
	}
};

const getAllTemplates = async (req, res) => {
	const { teamspace, project } = req.params;
	const showDeprecated = req.query.showDeprecated === 'true';

	try {
		const data = await getAllTemplatesInProject(teamspace, project, showDeprecated);

		respond(req, res, templates.ok,
			{ templates: data.map(({ _id, ...rest }) => ({ _id: UUIDToString(_id), ...rest })) });
	} catch (err) {
		// istanbul ignore next
		respond(req, res, err);
	}
};

const getTicket = async (req, res, next) => {
	const { teamspace, project, container, ticket } = req.params;

	try {
		req.ticket = await getTicketById(teamspace, project, container, ticket);
		req.showDeprecated = req.query.showDeprecated === 'true';

		await next();
	} catch (err) {
		// istanbul ignore next
		respond(req, res, err);
	}
};

const getTicketsInContainer = async (req, res, next) => {
	const { teamspace, project, container } = req.params;

	try {
		req.tickets = await getTicketList(teamspace, project, container);
		await next();
	} catch (err) {
		// istanbul ignore next
		respond(req, res, err);
	}
};

const getTicketResource = async (req, res) => {
	const { teamspace, project, container, ticket, resource } = req.params;

	try {
		const { readStream, size, mimeType } = await getTicketResourceAsStream(
			teamspace,
			project,
			container,
			ticket,
			resource,
		);

		writeStreamRespond(req, res, templates.ok, readStream, UUIDToString(resource), size, { mimeType });
	} catch (err) {
		// istanbul ignore next
		respond(req, res, err);
	}
};

const establishRoutes = () => {
	const router = Router({ mergeParams: true });

	/**
	 * @openapi
	 * /teamspaces/{teamspace}/projects/{project}/containers/{container}/tickets/templates:
	 *   get:
	 *     description: Get the the available ticket templates for this container
	 *     tags: [Containers]
	 *     operationId: getContainerTicketTemplates
	 *     parameters:
	 *       - name: teamspace
	 *         description: Name of teamspace
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: project
	 *         description: Project ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: container
	 *         description: Container ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: showDeprecated
	 *         description: Indicate if the response should return deprecated schemas (default is false)
	 *         in: query
	 *         required: false
	 *         schema:
	 *           type: boolean
	 *     responses:
	 *       401:
	 *         $ref: "#/components/responses/notLoggedIn"
	 *       404:
	 *         $ref: "#/components/responses/teamspaceNotFound"
	 *       200:
	 *         description: returns an array of template names and ids
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 type: object
	 *                 properties:
	 *                   _id:
	 *                     type: string
	 *                     format: uuid
	 *                   name:
	 *                     type: string
	 *                     example: Risk
	 */
	router.get('/templates', hasReadAccessToContainer, getAllTemplates);

	/**
	 * @openapi
	 * /teamspaces/{teamspace}/projects/{project}/containers/{container}/tickets/templates/{template}:
	 *   get:
	 *     description: Get the full definition of a template
	 *     tags: [Containers]
	 *     operationId: getTicketTemplateDetails
	 *     parameters:
	 *       - name: teamspace
	 *         description: Name of teamspace
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: project
	 *         description: Project ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: container
	 *         description: Container ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
   	 *       - name: template
	 *         description: Template ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *           format: uuid
 	 *       - name: showDeprecated
	 *         description: Indicate if the response should return deprecated properties/modules (default is false)
	 *         in: query
	 *         required: false
	 *         schema:
	 *           type: boolean
	 *     responses:
	 *       401:
	 *         $ref: "#/components/responses/notLoggedIn"
	 *       404:
	 *         $ref: "#/components/responses/teamspaceNotFound"
	 *       200:
	 *         description: returns the definition of a template
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: "#/components/schemas/ticketTemplate"
	 */
	router.get('/templates/:template', hasReadAccessToContainer, templateExists, serialiseFullTicketTemplate);

	/**
	 * @openapi
	 * /teamspaces/{teamspace}/projects/{project}/containers/{container}/tickets:
	 *   post:
	 *     description: Create a ticket. The Schema of the payload depends on the ticket template being used
	 *     tags: [Containers]
	 *     operationId: createContainerTicket
	 *     parameters:
	 *       - name: teamspace
	 *         description: Name of teamspace
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: project
	 *         description: Project ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: container
	 *         description: Container ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *     requestBody:
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *                 type:
	 *                   type: string
	 *                   format: uuid
	 *                   description: Template id this ticket is based on
	 *                 title:
	 *                   type: string
	 *                   description: Title of the ticket
	 *                   example: Doorway too narrow
	 *                 properties:
	 *                   type: object
	 *                   description: properties within the ticket
	 *                   properties:
	 *                     Description:
	 *                       type: string
	 *                       description: A detailed description of the ticket
	 *                       example: "The door way is too narrow for disable access"
	 *                     CustomProperty1:
	 *                       type: string
	 *                       description: Any custom properties in the ticket should be filled in this way
	 *                       example: "Data1"
	 *                 modules:
	 *                   type: object
	 *                   description: modules within the ticket
	 *                   properties:
	 *                     Module1:
	 *                       type: object
	 *                       description: properties within Module1
	 *                       properties:
	 *                         Property1:
	 *                           type: string
	 *                           description: Any properties in the module should be filled in this way
	 *                           example: "Data1"
	 *
	 *
	 *     responses:
	 *       401:
	 *         $ref: "#/components/responses/notLoggedIn"
	 *       404:
	 *         $ref: "#/components/responses/teamspaceNotFound"
	 *       200:
	 *         description: ticket has been successfully added, returns the id of the newly created template
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 _id:
	 *                   type: string
	 *                   format: uuid
	 */
	router.post('/', hasCommenterAccessToContainer, validateNewTicket, createTicket);

	/**
	 * @openapi
	 * /teamspaces/{teamspace}/projects/{project}/containers/{container}/tickets/{ticket}:
	 *   get:
	 *     description: Get ticket by ID
	 *     tags: [Containers]
	 *     operationId: GetTicket
	 *     parameters:
	 *       - name: teamspace
	 *         description: Name of teamspace
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: project
	 *         description: Project ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: container
	 *         description: Container ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: ticket
	 *         description: Ticket ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
 	 *       - name: showDeprecated
	 *         description: Indicate if the response should return deprecated properties/modules (default is false)
	 *         in: query
	 *         required: false
	 *         schema:
	 *           type: boolean
	 *     responses:
	 *       401:
	 *         $ref: "#/components/responses/notLoggedIn"
	 *       404:
	 *         $ref: "#/components/responses/teamspaceNotFound"
	 *       200:
	 *         description: returns the ticket as a json object
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 tickets:
	 *                   type: array
	 *                   items:
	 *                     type: object
	 *                     description: schema is subject to the template the ticket follows
	 *                     properties:
	 *                       _id:
	 *                         type: string
	 *                         format: uuid
	 *                         description: id of the ticket
	 *                       title:
	 *                         type: string
	 *                         description: ticket title
	 *                         example: "Missing door"
	 *                       number:
	 *                         type: number
	 *                         description: ticket number
	 *                       properties:
	 *                         type: object
	 *                         description: ticket properties
	 *                       modules:
	 *                         type: object
	 *                         description: ticket modules and their properties
	 *
	 */
	router.get('/', hasReadAccessToContainer, getTicketsInContainer, serialiseTicketList);

	/**
	 * @openapi
	 * /teamspaces/{teamspace}/projects/{project}/containers/{container}/tickets/{ticket}:
	 *   get:
	 *     description: Get ticket by ID
	 *     tags: [Containers]
	 *     operationId: GetTicket
	 *     parameters:
	 *       - name: teamspace
	 *         description: Name of teamspace
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: project
	 *         description: Project ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: container
	 *         description: Container ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: ticket
	 *         description: Ticket ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
 	 *       - name: showDeprecated
	 *         description: Indicate if the response should return deprecated properties/modules (default is false)
	 *         in: query
	 *         required: false
	 *         schema:
	 *           type: boolean
	 *     responses:
	 *       401:
	 *         $ref: "#/components/responses/notLoggedIn"
	 *       404:
	 *         $ref: "#/components/responses/teamspaceNotFound"
	 *       200:
	 *         description: returns the ticket as a json object
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               description: schema is subject to the template the ticket follows
	 *               properties:
	 *                 _id:
	 *                   type: string
	 *                   format: uuid
	 *                   description: id of the ticket
	 *                 title:
	 *                   type: string
	 *                   description: ticket title
	 *                   example: "Missing door"
	 *                 number:
	 *                   type: number
	 *                   description: ticket number
	 *                 properties:
	 *                   type: object
	 *                   description: ticket properties
	 *                 modules:
	 *                   type: object
	 *                   description: ticket modules and their properties
	 *
	 */
	router.get('/:ticket', hasReadAccessToContainer, getTicket, serialiseTicket);

	/**
	 * @openapi
	 * /teamspaces/{teamspace}/projects/{project}/containers/{container}/tickets/{ticket}/resources/{resource}:
	 *   get:
	 *     description: Get the binary resource associated with the given ticket
	 *     tags: [Containers]
	 *     operationId: getTicketResource
	 *     parameters:
	 *       - name: teamspace
	 *         description: Name of teamspace
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: project
	 *         description: Project ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: container
	 *         description: Container ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *       - name: ticket
	 *         description: Ticket ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
   	 *       - name: resource
	 *         description: Resource ID
	 *         in: path
	 *         required: true
	 *         schema:
	 *           type: string
	 *     responses:
	 *       401:
	 *         $ref: "#/components/responses/notLoggedIn"
	 *       404:
	 *         $ref: "#/components/responses/teamspaceNotFound"
	 *       200:
	 *         description: downloads the binary file
	 *         content:
	 *           application/octet-stream:
	 *             schema:
	 *               type: string
	 *               format: binary
	 */
	router.get('/:ticket/resources/:resource', hasReadAccessToContainer, getTicketResource);

	return router;
};

module.exports = establishRoutes();
