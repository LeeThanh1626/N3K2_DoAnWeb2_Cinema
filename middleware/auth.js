//không cần user phải chạy từng trang web nữa các câu lệnh phía dưới giúp việc kiểm soát user 1 cách tốt nhất
const User = require('../models/user');
module.exports = function auth(req, res, next) {
    //lấy userId ra khỏi session
    const { userId } = req.session;
    res.locals.currentUser = null;
    // nếu userId có trong session tìm thông tin tương ứng
    if (userId) {
        // const user = User.findbyId(userId);
        // // nếu có thông tin user
        // if (user) {
        //     req.user = user;
        //     res.locals.currentUser = user;
        // }

          User.findbyId(userId).then(function(user){
            if (user) {
                req.user = user;
                res.locals.currentUser = user;
            }
     next();
          }).catch(next);
        
        // nếu có thông tin user
       
    }
    else
    {
        next();

    }
};    