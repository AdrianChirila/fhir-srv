const User = require('../models/user.model')
import {MODELS} from "../models/models";
export async function importResource(resources: any[]) {
    // let User: any = UserModel.model(MODELS.USER);
    console.log(resources);
    for(let index: number = 0; index < resources.length; index ++) {
        console.log(index);
        let currentResource: any = resources[index];
        console.log('FInd', User.findOne);
        let dbResource: any = await User.findOne({});
        if (!dbResource) {
            console.log(`No resource found in db!`);
        }
        console.log('ffff');
    }
}