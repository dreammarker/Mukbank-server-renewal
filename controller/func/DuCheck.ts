const { user } = require('../../models');

export = {
    idCheck : async (id:string) =>{
        let check = await user.findOne({
            where: {
                identity : id
              }
          })
        return check;
    },
    NameCheck : async (name:string) => {
        let check = await user.findOne({
            where :  {
                nick : name
            }
        })
        return check;
    }
}