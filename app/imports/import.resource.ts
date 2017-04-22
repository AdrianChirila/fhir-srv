import {UserModel as User} from "../models"
const mongoose = require('mongoose');

export async function importResource(entry: any) {
    let resources: any[] = entry.resources;
    for(let index: number = 0; index < resources.length; index ++) {
        let currentResource: any = resources[index];
        let Model: any = mongoose.model(entry.type);
        let dbResource: any = await Model.findOne({id: currentResource.id});
        if (!dbResource) {
            await new Model(currentResource).save();
        }
    }
}