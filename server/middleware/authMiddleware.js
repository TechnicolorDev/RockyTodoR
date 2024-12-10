/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                     !CAUTION WARNING!                                           //
//                      This is just redirect for auth part of simpetodo                           //
//                     Do not edit this until you know what you are doing!                         //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
const authenticate = (req, res, next) => {
    if (!req.session.adminId) {
        return res.redirect('/login');
    }
    next();
};

module.exports = { authenticate };
