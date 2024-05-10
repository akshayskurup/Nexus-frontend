export const userUrl = {

    login :"/user/login",
    register:"/user/register",
    registerOtp:"/user/register-otp",
    resendOtp:"/user/resend-otp",
    forgetPassword:"/user/forget-password",
    forgetOtp:"user/forget-otp",
    resetPassword:"user/reset-password",
    accountSetup:"user/account-setup",
    editProfile:"user/edit-profile",
    userProfile:"user/user-profile"

}

export const adminUrl = {
    login :"admin/login",
    AllUsers:"admin/all-users",
    changeUserStatus:"admin/change-user-status",
    getAllPost:"admin/all-posts",
    changePostStatus:"admin/change-post-status"
}

export const postUrl = {
    addPost:"/post/add-post",
    getAllPost:"/post/get-post",
    likePost:"/post/like-post",
    updatePost:"/post/update-post",
    deletePost:"/post/delete-post",
    reportPost:"/post/report-post",
    savePost:"/post/save-post",
    userPost:"/post/get-post",
    getSavedPost:"/post/get-saved-post",
    addComment:"/post/add-comment",
    getMyComment:"/post/my-comment",
    allComments:"/post/get-comments",
    getCommentsCount:"/post/get-comments-count",
    commentDelete:"/post/delete-comment",
    replyComment:"/post/reply-comment"
}

export const connectionUrls = {
    follow:"/connection/follow",
    unFollow:"/connection/unfollow",
    getConnection:"/connection/get-connection"
}

export const chatUrl = {
    addConversation: "/chat/add-conversation",
    getUserConversation: "/chat/get-conversations",
    findConversationOfTwoUsers: "/chat/find-conversation",
    addMessage: "/chat/add-message",
    getMessages: "/chat/get-messages",

    addGroup: "/chat/add-group",
    getUserGroups: "/chat/get-groups",
    addGroupMesssage:"/chat/add-group-message",
    getGroupMessages:"/chat/get-group-messages"
}