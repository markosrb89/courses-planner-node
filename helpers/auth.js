module.exports = {
    ensureAuthenticated: (request, response, next) => {
        if (request.isAuthenticated()) {
            return next();
        }

        request.flash("error_msg", "Not Authorized");
        response.redirect("/users/login");
    }
};