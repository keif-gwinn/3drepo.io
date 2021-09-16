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


 const { getArrayDifference } = require("../../../../../utils/helper/arrays");
 const { templates, createResponseCode } = require('../../../../../utils/responseCodes');

 const Favourites = {};
 
 Favourites.checkModelsAreValid = async (accessibleModels, favourites) =>{
    const invalidFavourites = getArrayDifference(accessibleModels.map((c)=>c._id), favourites);
	if (invalidFavourites.length) {
		throw createResponseCode(templates.invalidArguments,  "The action cannot be performed on the following models: " + invalidFavourites);
	}
 };
 
 module.exports = Favourites;
 