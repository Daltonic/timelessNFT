import { CometChat } from '@cometchat-pro/chat'
import { setGlobalState } from './store'

const CONSTANTS = {
  APP_ID: process.env.REACT_APP_COMET_CHAT_APP_ID,
  REGION: process.env.REACT_APP_COMET_CHAT_REGION,
  Auth_Key: process.env.REACT_APP_COMET_CHAT_AUTH_KEY,
}

const initCometChat = async () => {
  const appID = CONSTANTS.APP_ID
  const region = CONSTANTS.REGION

  const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build()

  await CometChat.init(appID, appSetting)
    .then(() => console.log('Initialization completed successfully'))
    .catch((error) => error)
}

const loginWithCometChat = async (UID) => {
  const authKey = CONSTANTS.Auth_Key
  await CometChat.login(UID, authKey)
    .then((user) => setGlobalState('currentUser', user))
    .catch((error) => {
      if(error.code == 'ERR_UID_NOT_FOUND')
        signUpWithCometChat(UID, UID)

      console.log(error)
    })
}

const signUpWithCometChat = async (UID, name) => {
  let authKey = CONSTANTS.Auth_Key
  const user = new CometChat.User(UID)
  user.setName(name)

  await CometChat.createUser(user, authKey)
    .then((user) => loginWithCometChat(user.uid))
    .catch((error) => console.log(error))
}

const logOutWithCometChat = async () => {
  return await CometChat.logout()
    .then(() => console.log('Logged Out Successfully'))
    .catch((error) => error)
}

const isUserLoggedIn = async () => {
  await CometChat.getLoggedinUser()
    .then((user) => setGlobalState('currentUser', user))
    .catch((error) => console.log('error:', error))
}

const createNewGroup = async (GUID, groupName) => {
  const groupType = CometChat.GROUP_TYPE.PUBLIC
  const password = ''
  const group = new CometChat.Group(GUID, groupName, groupType, password)

  return await CometChat.createGroup(group)
    .then((group) => group)
    .catch((error) => error)
}

const getGroup = async (GUID) => {
  return await CometChat.getGroup(GUID)
    .then((group) => group)
    .catch((error) => error)
}

const joinGroup = async (GUID) => {
  const groupType = CometChat.GROUP_TYPE.PUBLIC
  const password = ''

  return CometChat.joinGroup(GUID, groupType, password)
    .then((group) => group)
    .catch((error) => error)
}

const getMessages = async (UID) => {
  const limit = 30
  const messagesRequest = new CometChat.MessagesRequestBuilder()
    .setGUID(UID)
    .setLimit(limit)
    .build()

  return await messagesRequest
    .fetchPrevious()
    .then((messages) => messages)
    .catch((error) => error)
}

const sendMessage = async (receiverID, messageText) => {
  const receiverType = CometChat.RECEIVER_TYPE.GROUP
  const textMessage = new CometChat.TextMessage(
    receiverID,
    messageText,
    receiverType
  )

  return await CometChat.sendMessage(textMessage)
    .then((message) => message)
    .catch((error) => error)
}

export {
  initCometChat,
  loginWithCometChat,
  signUpWithCometChat,
  logOutWithCometChat,
  getMessages,
  sendMessage,
  isUserLoggedIn,
  createNewGroup,
  getGroup,
  joinGroup,
  CometChat
}