const { user } = require('../../models');

export = {
    idCheck : async (id:string) =>{
        let check = await user.findOne({
            where: {
                identity : id
              }
          })
        return check;
    }
}