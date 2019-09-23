import _ from "lodash";
import ChatGroupModel from "./../models/chatGroupModel";

let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
  return new Promise(async (resolve, reject) => {
    try {
      // add current user id to array msembers
      arrayMemberIds.unshift({userId: `${currentUserId}`}); // day len dau cua 1 mang
      arrayMemberIds = _.uniqBy(arrayMemberIds, "userId");
      
      let newGroupItem = {
        name: groupChatName,
        userAmount: arrayMemberIds.length,
        userId: `${currentUserId}`,
        members: arrayMemberIds
      };
    
      let newGroup = await ChatGroupModel.createNew(newGroupItem);
      resolve(newGroup);
      
    } catch (error) {
      reject(error);
    }
  });
};

module.exports  ={
  addNewGroup: addNewGroup
}