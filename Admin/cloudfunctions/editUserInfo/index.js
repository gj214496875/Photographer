// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
exports.main = async(event, context) => {
  console.error(event.userInfo)
  try {
    return await db.collection('customer').where({
        _id: '34ab1ee6-d428-45db-a0dc-6454d58040e4'
      })
      .update({
        data: event.userInfo
      })
  } catch (e) {
    console.error(e)
  }
}