// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "qsp-i1d4d"
})
// 云函数入口函数
const db = cloud.database()
exports.main = async(event, context) => {
  // try {
  //   const a = await db.collection('works').doc(event.id).remove()
  //   return true
  //   const fileIDs = event.urls
  //   const b = await cloud.deleteFile({
  //     fileList: fileIDs,
  //   })
  //   return true
  // } catch {
  //   return false
  // }
  try {
    const fileIDs = event.urls
    cloud.deleteFile({
      fileList: fileIDs,
    })
    await db.collection('works').doc(event.id).remove()
    return true
  } catch (e) {
    return false
  }
}